(() => {
  "use strict";
  const M = window.ToolMath,
    $ = (id) => document.getElementById(id);
  function app(options) {
    let state = M.copy(options.initial),
      edited = false,
      store,
      saving = false,
      queued = false,
      errors = 0,
      timer,
      gesture,
      frame;
    const past = [],
      future = [];
    function status(text) {
      $("save-status").textContent = text;
    }
    function notice(text) {
      $("notice").textContent = text;
      $("notice").hidden = false;
      clearTimeout(timer);
      timer = setTimeout(() => ($("notice").hidden = true), 3200);
    }
    function render() {
      options.render(state);
      $("undo").disabled = Boolean(options.locked?.()) || !past.length;
      $("redo").disabled = Boolean(options.locked?.()) || !future.length;
    }
    async function save() {
      edited = true;
      if (!store) return;
      if (!store.persistent) {
        status("이 탭에서 사용 중");
        return;
      }
      queued = true;
      if (saving) return;
      saving = true;
      try {
        while (queued) {
          queued = false;
          const before = errors;
          status("저장 중");
          store.set("board", M.copy(state));
          await store.flush();
          if (!queued && before === errors) status("계정에 자동 저장됨");
        }
      } finally {
        saving = false;
      }
    }
    function finish(before, sound = true) {
      try {
        state = options.validate(state);
      } catch (error) {
        state = before;
        notice(error.message);
        render();
        return false;
      }
      if (JSON.stringify(state) !== JSON.stringify(before)) {
        past.push(before);
        if (past.length > 60) past.shift();
        future.length = 0;
        save();
        if (sound) window.ClassGameSfx?.play("tick");
      }
      render();
      return true;
    }
    const api = {
      get state() {
        return state;
      },
      render,
      notice,
      commit(change, sound = true) {
        api.stop();
        if (gesture) api.end(false);
        const before = M.copy(state);
        change(state);
        return finish(before, sound);
      },
      begin() {
        api.stop();
        if (gesture) api.end(false);
        edited = true;
        gesture = M.copy(state);
      },
      preview(change) {
        if (!gesture) api.begin();
        change(state);
        render();
      },
      end(sound = true) {
        if (!gesture) return;
        const before = gesture;
        gesture = null;
        return finish(before, sound);
      },
      abort() {
        if (gesture) {
          state = gesture;
          gesture = null;
          render();
        }
      },
      stop() {
        if (frame) {
          cancelAnimationFrame(frame);
          frame = null;
          options.stopped?.();
        }
      },
      animate(duration, update, done) {
        api.stop();
        const start = performance.now();
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const step = (now) => {
          const t = reduced ? 1 : Math.min(1, (now - start) / duration);
          update(t);
          render();
          if (t < 1) frame = requestAnimationFrame(step);
          else {
            frame = null;
            done?.();
          }
        };
        frame = requestAnimationFrame(step);
      },
      start() {
        $("undo").onclick = () => history(past, future);
        $("redo").onclick = () => history(future, past);
        $("reset").onclick = () =>
          api.commit((s) => {
            for (const key of Object.keys(s)) delete s[key];
            Object.assign(s, M.copy(options.initial));
          });
        document.addEventListener("keydown", (event) => {
          if (event.target.closest("input,textarea,select,[contenteditable]"))
            return;
          if (
            (event.ctrlKey || event.metaKey) &&
            ["z", "y"].includes(event.key.toLowerCase())
          ) {
            event.preventDefault();
            history(
              event.shiftKey || event.key.toLowerCase() === "y" ? future : past,
              event.shiftKey || event.key.toLowerCase() === "y" ? past : future,
            );
          }
          if (event.key === "Escape") {
            api.stop();
            api.abort();
          }
        });
        render();
        SiteStorage.open(options.name)
          .then((opened) => {
            store = opened;
            store.onError(() => {
              errors++;
              status("저장 실패");
              notice("저장하지 못했어요. 연결을 확인한 뒤 다시 조작해 주세요.");
            });
            if (!edited && store.has("board")) {
              try {
                state = options.validate(store.get("board"));
                render();
              } catch (_) {
                notice("저장한 작업을 읽지 못해서 새로 열었어요.");
              }
            }
            if (edited) save();
            else
              status(
                store.persistent ? "계정에 자동 저장" : "이 탭에서 사용 중",
              );
          })
          .catch(() => status("이 탭에서 사용 중"));
        return api;
      },
    };
    function history(from, to) {
      if (options.locked?.()) return;
      api.stop();
      api.abort();
      if (!from.length) return;
      to.push(M.copy(state));
      state = from.pop();
      save();
      render();
    }
    return api;
  }
  function pointer(svg, handlers) {
    let active = null;
    const point = (event) => {
      const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
        svg.getScreenCTM().inverse(),
      );
      return { x: p.x, y: p.y };
    };
    // Children are presentation-only; the stable SVG root receives every touch.
    for (const type of ["touchstart", "touchmove"])
      svg.addEventListener(type, (event) => event.preventDefault(), {
        passive: false,
      });
    svg.addEventListener("pointerdown", (event) => {
      if (active || event.button !== 0 || !event.isPrimary) return;
      const p = point(event),
        data = handlers.start(p, event);
      if (data === false || data == null) return;
      active = { id: event.pointerId, data, start: p };
      svg.focus({ preventScroll: true });
      if (event.pointerType === "mouse") svg.setPointerCapture(event.pointerId);
    });
    svg.addEventListener("pointermove", (event) => {
      if (active?.id === event.pointerId)
        handlers.move?.(point(event), active.data, event, active.start);
    });
    svg.addEventListener("pointerup", (event) => {
      if (active?.id !== event.pointerId) return;
      const current = active;
      active = null;
      handlers.end?.(point(event), current.data, event, current.start);
    });
    for (const name of ["pointercancel", "lostpointercapture"])
      svg.addEventListener(name, (event) => {
        if (active?.id === event.pointerId) {
          active = null;
          handlers.cancel?.();
        }
      });
    return () => {
      active = null;
      handlers.cancel?.();
    };
  }
  function bind(id, event, fn) {
    $(id).addEventListener(event, fn);
  }
  function value(id, v) {
    $(id).value = String(v);
  }
  function pressed(id, v) {
    $(id).setAttribute("aria-pressed", String(v));
  }
  function text(x, y, content, attrs = "") {
    return `<text x="${x}" y="${y}" ${attrs}>${M.esc(content)}</text>`;
  }
  function line(x1, y1, x2, y2, attrs = "") {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attrs}/>`;
  }
  window.ToolUI = Object.freeze({
    $,
    app,
    pointer,
    bind,
    value,
    pressed,
    text,
    line,
  });
})();
