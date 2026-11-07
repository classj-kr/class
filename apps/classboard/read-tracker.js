// A group visit is not a read. Only acknowledge the end of a rendered item's
// content after it stays on screen in the foreground for a moment.
class ClassboardReadTracker {
    constructor(onRead) {
        this.onRead = onRead;
        this.visible = new Set();
        this.timers = new Map();
        this.pending = new Set();
        this.disposed = false;
        this.onVisibility = () => {
            for (const timer of this.timers.values()) clearTimeout(timer);
            this.timers.clear();
            if (!document.hidden) this.visible.forEach(el => this.schedule(el));
        };
        document.addEventListener('visibilitychange', this.onVisibility);
        if ('IntersectionObserver' in window) {
            const headerHeight = document.querySelector('.header')?.getBoundingClientRect().height || 80;
            this.observer = new IntersectionObserver(entries => {
                for (const entry of entries) {
                    const el = entry.target;
                    if (entry.isIntersecting) {
                        this.visible.add(el);
                        this.schedule(el);
                    } else {
                        this.visible.delete(el);
                        clearTimeout(this.timers.get(el));
                        this.timers.delete(el);
                    }
                }
            }, { rootMargin: `-${Math.ceil(headerHeight)}px 0px -16px 0px`, threshold: 1 });
        }
    }
    observe(content, id) {
        if (!this.observer || !content) return;
        const marker = document.createElement('span');
        marker.className = 'read-marker';
        marker.dataset.readId = String(id);
        marker.setAttribute('aria-hidden', 'true');
        content.appendChild(marker);
        this.observer.observe(marker);
    }
    schedule(el, delay = 1600) {
        if (this.disposed || document.hidden || this.timers.has(el) || this.pending.has(el)) return;
        this.timers.set(el, setTimeout(async () => {
            this.timers.delete(el);
            if (this.disposed || document.hidden || !el.isConnected || !this.visible.has(el)) return;
            this.pending.add(el);
            try {
                const accepted = await this.onRead(el.dataset.readId);
                if (accepted) {
                    this.observer?.unobserve(el);
                    this.visible.delete(el);
                }
            } catch (error) {
                console.error('읽음 저장 실패', error);
            } finally {
                this.pending.delete(el);
                // Retry only while the same content is still being viewed.
                if (!this.disposed && this.visible.has(el)) this.schedule(el, 5000);
            }
        }, delay));
    }
    disconnect() {
        this.disposed = true;
        this.observer?.disconnect();
        for (const timer of this.timers.values()) clearTimeout(timer);
        this.timers.clear();
        this.visible.clear();
        document.removeEventListener('visibilitychange', this.onVisibility);
    }
}
