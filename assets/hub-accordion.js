(function () {
    'use strict';

    const DURATION = 360;
    const ease = (value) => value * value * (3 - 2 * value);

    function create(root) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const entries = [];
        const moving = new Set();
        const guard = document.createElement('div');
        guard.setAttribute('aria-hidden', 'true');
        guard.style.cssText = 'height:0;pointer-events:none;overflow-anchor:none';
        document.body.append(guard);
        // This script initializes before the trailing footer is parsed.
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => document.body.append(guard), { once: true });
        }
        let frame = 0;
        let session = null;
        let pageFloor = 0;

        function add(node, trigger, panel, category) {
            if (!trigger || !panel) return;
            const expanded = category ? trigger.getAttribute('aria-expanded') === 'true' : node.open;
            const entry = { node, trigger, panel, category, expanded, visual: expanded ? 1 : 0, motion: null };
            if (!panel.id) panel.id = `hub-group-options-${entries.length}`;
            trigger.setAttribute('aria-controls', panel.id);
            trigger.setAttribute('aria-expanded', String(expanded));
            panel.inert = !expanded;
            entries.push(entry);
        }

        root.querySelectorAll('[data-category-section]').forEach((node) => {
            const trigger = node.querySelector('.category-toggle');
            add(node, trigger, document.getElementById(trigger?.getAttribute('aria-controls')), true);
        });
        root.querySelectorAll('.worksheet-group').forEach((node) => {
            add(node, node.querySelector(':scope > summary'), node.querySelector(':scope > .worksheet-group-options'), false);
        });

        function naturalPageHeight() {
            const padding = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;
            let bottom = guard.getBoundingClientRect().top + window.scrollY + padding;
            for (const entry of entries) {
                if (entry.category || !entry.node.open || entry.node.closest('.hub-accordion-clipping')) continue;
                if (getComputedStyle(entry.panel).position !== 'absolute') continue;
                const rect = entry.panel.getBoundingClientRect();
                if (rect.height) bottom = Math.max(bottom, rect.top + window.scrollY + rect.height * entry.visual + padding);
            }
            return Math.max(window.innerHeight, bottom);
        }

        function reservePageHeight() {
            // Keep the browser from clamping scrollY before our animated layout and
            // scroll position have reached their destination together.
            // The spacer extends document flow, not an absolutely positioned menu.
            const padding = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;
            const flowBottom = guard.getBoundingClientRect().top + window.scrollY + padding;
            guard.style.height = `${Math.max(0, pageFloor - flowBottom)}px`;
        }

        function requestTick() {
            if (!frame) frame = requestAnimationFrame(tick);
        }

        function interact(trigger, change) {
            if (guard !== document.body.lastElementChild) document.body.append(guard);
            pageFloor = Math.max(pageFloor, document.documentElement.scrollHeight);
            session = {
                trigger,
                top: trigger?.getBoundingClientRect().top || 0,
                scroll: window.scrollY,
                started: performance.now(),
                reveal: null,
            };
            document.documentElement.classList.add('hub-accordion-active');
            reservePageHeight();
            change();
            requestTick();
        }

        function dock(entry) {
            if (entry.category || getComputedStyle(entry.panel).position !== 'absolute') return;
            entry.panel.style.left = '';
            entry.panel.style.right = '';
            if (entry.panel.getBoundingClientRect().right > document.documentElement.clientWidth - 8) {
                entry.panel.style.left = 'auto';
                entry.panel.style.right = '0';
            }
        }

        function openHeight(entry) {
            const savedHeight = entry.node.style.height;
            const children = [];
            for (const child of moving) {
                if (child === entry || !child.motion.layout || !entry.node.contains(child.node)) continue;
                children.push([child.node, child.node.style.height]);
                child.node.style.height = `${child.motion.toHeight}px`;
            }
            entry.node.style.height = '';
            const height = entry.node.getBoundingClientRect().height;
            entry.node.style.height = savedHeight;
            children.forEach(([node, value]) => { node.style.height = value; });
            return height;
        }

        function closedHeight(entry) {
            const heading = entry.category ? entry.trigger.closest('.category-heading') : entry.trigger;
            const style = getComputedStyle(entry.node);
            return heading.getBoundingClientRect().height
                + (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.borderBottomWidth) || 0)
                + (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
        }

        function finish(entry) {
            entry.motion = null;
            moving.delete(entry);
            entry.visual = entry.expanded ? 1 : 0;
            entry.node.style.height = '';
            entry.node.classList.remove('hub-accordion-clipping');
            entry.panel.style.opacity = '';
            entry.panel.style.transform = '';
            entry.panel.style.clipPath = '';
            if (entry.category) {
                if (!entry.expanded) {
                    for (const child of entries) {
                        if (child.category || !entry.node.contains(child.node)) continue;
                        child.expanded = false;
                        child.trigger.setAttribute('aria-expanded', 'false');
                        child.panel.inert = true;
                        finish(child);
                    }
                    entry.panel.hidden = true;
                }
            } else entry.node.open = entry.expanded;
        }

        function setExpanded(entry, expanded, retarget = false) {
            if (!entry || (!retarget && entry.expanded === expanded)) return;
            const fromHeight = entry.node.getBoundingClientRect().height;
            const fromVisual = entry.visual;
            entry.expanded = expanded;
            entry.trigger.setAttribute('aria-expanded', String(expanded));
            if (!expanded && entry.panel.contains(document.activeElement)) entry.trigger.focus({ preventScroll: true });
            entry.panel.inert = !expanded;
            if (entry.category) {
                entry.panel.hidden = false;
                entry.node.classList.toggle('is-expanded', expanded);
            } else entry.node.open = true;
            dock(entry);
            const layout = entry.category || getComputedStyle(entry.panel).position !== 'absolute';
            const toHeight = expanded ? openHeight(entry) : closedHeight(entry);
            entry.motion = {
                started: performance.now(),
                duration: reducedMotion.matches ? 0 : DURATION,
                fromHeight,
                toHeight,
                fromVisual,
                toVisual: expanded ? 1 : 0,
                layout,
            };
            if (layout) {
                entry.node.style.height = `${fromHeight}px`;
                entry.node.classList.add('hub-accordion-clipping');
            }
            entry.panel.style.opacity = String(fromVisual);
            entry.panel.style.transform = `translateY(${(1 - fromVisual) * -6}px)`;
            if (!layout) entry.panel.style.clipPath = `inset(0 0 ${(1 - fromVisual) * 100}% 0)`;
            moving.add(entry);
            // A quick second click can open a child before its parent has finished.
            // Retarget the parent instead of letting it jump to an obsolete height.
            for (const parent of entries) {
                if (parent !== entry && parent.motion?.layout && parent.expanded && parent.node.contains(entry.node)) {
                    setExpanded(parent, true, true);
                }
            }
            requestTick();
        }

        function tick(now) {
            frame = 0;
            for (const entry of Array.from(moving)) {
                if (!entry.motion) continue;
                const motion = entry.motion;
                const progress = motion.duration ? Math.min(1, (now - motion.started) / motion.duration) : 1;
                const amount = ease(progress);
                entry.visual = motion.fromVisual + (motion.toVisual - motion.fromVisual) * amount;
                if (motion.layout) entry.node.style.height = `${motion.fromHeight + (motion.toHeight - motion.fromHeight) * amount}px`;
                entry.panel.style.opacity = String(entry.visual);
                entry.panel.style.transform = `translateY(${(1 - entry.visual) * -6}px)`;
                if (!motion.layout) entry.panel.style.clipPath = `inset(0 0 ${(1 - entry.visual) * 100}% 0)`;
                if (progress === 1) finish(entry);
            }
            let naturalHeight = naturalPageHeight();
            // Reserve the opened menu's destination from the first frame. Otherwise
            // short pages cannot scroll until the growing menu reaches the bottom,
            // causing the page to catch up abruptly halfway through the animation.
            for (const entry of moving) {
                if (!entry.expanded) continue;
                const bottom = entry.panel.getBoundingClientRect().bottom + window.scrollY
                    + (1 - entry.visual) * 6 + 18;
                naturalHeight = Math.max(naturalHeight, bottom);
                pageFloor = Math.max(pageFloor, bottom);
            }
            reservePageHeight();
            const maxScroll = Math.max(0, naturalHeight - window.innerHeight);
            let scroll = Math.min(window.scrollY, maxScroll);
            if (session) {
                scroll = session.trigger
                    ? session.trigger.getBoundingClientRect().top + window.scrollY - session.top
                    : session.scroll;
                const reveal = session.reveal;
                if (reveal?.expanded) {
                    // Fit the complete menu, including its last button and padding.
                    // Remove the entrance translation from the target so expansion
                    // and scrolling follow one easing curve without a final jump.
                    const extent = reveal.panel.getBoundingClientRect().bottom
                        + (1 - reveal.visual) * 6 - reveal.trigger.getBoundingClientRect().top;
                    const shift = Math.max(0, session.top + extent - (window.innerHeight - 12));
                    const progress = reducedMotion.matches ? 1 : Math.min(1, (now - session.started) / DURATION);
                    scroll += shift * ease(progress);
                }
                scroll = Math.max(0, Math.min(scroll, maxScroll));
            }
            if (Math.abs(window.scrollY - scroll) > 0.25) window.scrollTo(window.scrollX, scroll);
            if (moving.size) requestTick();
            else {
                // Floating menus also need real document space below their last
                // button; removing it here would clamp scrollY on the final frame.
                pageFloor = naturalPageHeight();
                reservePageHeight();
                pageFloor = 0;
                session = null;
                document.documentElement.classList.remove('hub-accordion-active');
            }
        }

        for (const entry of entries) {
            entry.trigger.addEventListener('click', (event) => {
                if (event.defaultPrevented) return;
                event.preventDefault();
                interact(entry.trigger, () => {
                    const shouldExpand = !entry.expanded;
                    if (entry.category) {
                        entries.filter((item) => item.category).forEach((item) => setExpanded(item, item === entry && shouldExpand));
                    } else setExpanded(entry, shouldExpand);
                    if (shouldExpand) session.reveal = entry;
                });
            });
        }

        document.addEventListener('click', (event) => {
            const outside = entries.filter((entry) => !entry.category && entry.expanded && !entry.node.contains(event.target));
            if (!outside.length) return;
            const trigger = event.target.closest('.category-toggle, .worksheet-group > summary');
            interact(trigger, () => outside.forEach((entry) => setExpanded(entry, false)));
        }, true);

        const stopScroll = () => { session = null; };
        document.addEventListener('wheel', stopScroll, { passive: true });
        document.addEventListener('touchmove', stopScroll, { passive: true });
        document.addEventListener('keydown', (event) => {
            if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Tab'].includes(event.key)) stopScroll();
        });
        window.addEventListener('resize', () => {
            session = null;
            Array.from(moving).forEach(finish);
            entries.filter((entry) => entry.expanded).forEach(dock);
            requestTick();
        });
        reducedMotion.addEventListener('change', () => {
            if (reducedMotion.matches) {
                for (const entry of moving) entry.motion.duration = 0;
                requestTick();
            }
        });

        return {
            closeGroups() {
                interact(null, () => entries.filter((entry) => !entry.category).forEach((entry) => setExpanded(entry, false)));
            },
        };
    }

    window.ClassroomHubAccordion = { create };
})();
