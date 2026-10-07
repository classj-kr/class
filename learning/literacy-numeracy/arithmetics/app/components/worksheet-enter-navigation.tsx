"use client";

import { useEffect } from "react";

const ANSWER_INPUT_SELECTOR = '.worksheet-stage input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"])';

export default function WorksheetEnterNavigation() {
  useEffect(() => {
    function moveToNextAnswer(event: KeyboardEvent) {
      if (event.key !== "Enter" || event.defaultPrevented || event.isComposing || event.ctrlKey || event.altKey || event.metaKey) return;
      const current = event.target;
      if (!(current instanceof HTMLInputElement)) return;
      const worksheet = current.closest<HTMLElement>(".counting-page .worksheet-stage");
      const page = worksheet?.closest<HTMLElement>(".counting-page");
      if (!page || !current.matches(ANSWER_INPUT_SELECTOR)) return;

      const inputs = Array.from(page.querySelectorAll<HTMLInputElement>(ANSWER_INPUT_SELECTOR))
        .filter((input) => !input.disabled && !input.hidden && input.getClientRects().length > 0);
      const next = inputs[inputs.indexOf(current) + 1];
      if (!next) return;

      event.preventDefault();
      next.focus();
      next.select();
    }

    document.addEventListener("keydown", moveToNextAnswer);
    return () => document.removeEventListener("keydown", moveToNextAnswer);
  }, []);

  return null;
}
