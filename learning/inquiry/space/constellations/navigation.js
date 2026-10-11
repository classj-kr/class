window.switchMainTab = function(targetTab) {
            var tabs = document.querySelectorAll('.nav-tab');
            var panes = document.querySelectorAll('.tab-pane');

            for (var i = 0; i < tabs.length; i++) {
                var t = tabs[i];
                if (t.getAttribute('data-tab') === targetTab) {
                    t.classList.add('active');
                } else {
                    t.classList.remove('active');
                }
            }

            for (var j = 0; j < panes.length; j++) {
                var p = panes[j];
                var isKnowledgePane = targetTab === 'knowledge'
                    && (p.id === 'tab-cards' || p.id === 'tab-calc');
                if (p.id === 'tab-' + targetTab || isKnowledgePane) {
                    p.classList.add('active');
                    p.style.display = 'block';
                } else {
                    p.classList.remove('active');
                    p.style.display = 'none';
                }
            }
        };

        window.switchSimMode = function(targetMode) {
            var modeBtns = document.querySelectorAll('#simModeSwitcher .sim-mode-btn');
            var modeContainers = document.querySelectorAll('.sim-mode-container');
            var subpanels = document.querySelectorAll('.sim-controls-subpanel');

            for (var i = 0; i < modeBtns.length; i++) {
                var b = modeBtns[i];
                if (b.getAttribute('data-sim-mode') === targetMode) {
                    b.classList.add('active');
                    b.style.background = 'rgba(56,189,248,0.2)';
                    b.style.color = '#38bdf8';
                    b.style.borderColor = '#38bdf8';
                } else {
                    b.classList.remove('active');
                    b.style.background = 'transparent';
                    b.style.color = '#94a3b8';
                    b.style.borderColor = 'transparent';
                }
            }

            for (var j = 0; j < modeContainers.length; j++) {
                var c = modeContainers[j];
                if (c.id === 'mode-' + targetMode) {
                    c.style.display = 'flex';
                } else {
                    c.style.display = 'none';
                }
            }

            for (var k = 0; k < subpanels.length; k++) {
                var p = subpanels[k];
                if (p.id === 'controls-' + targetMode) {
                    p.style.display = 'flex';
                } else {
                    p.style.display = 'none';
                }
            }

            // Some scenes own their controls inside the model. Do not leave an
            // empty full-width panel covering those controls at the bottom.
            var panel = document.querySelector('.sim-controls-panel');
            if (panel) {
                var hasControls = !!document.getElementById('controls-' + targetMode);
                panel.hidden = !hasControls;
                panel.style.display = hasControls ? 'flex' : 'none';
            }

            if (targetMode === 'diurnal' && typeof window.updateDiurnalUI === 'function') {
                window.updateDiurnalUI();
            } else if (targetMode === 'zodiac' && typeof window.updateZodiacUI === 'function') {
                window.updateZodiacUI();
            } else if (targetMode === '3ddepth' && typeof window.onResize3D === 'function') {
                window.onResize3D();
            }
        };
