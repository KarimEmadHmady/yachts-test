"use client";

import { useEffect } from "react";

// Single shared observer for every [data-reveal] element. Mounted once in the
// root layout; renders nothing. Styles live in src/app/globals.css.

type RevealElement = HTMLElement | SVGElement;

const SELECTOR = '[data-reveal]:not([data-reveal="none"])';
const STAGGER_SELECTOR = "[data-reveal-stagger]";
// Must match --reveal-failsafe in globals.css
const FAILSAFE_MS = 4000;
// Give up waiting for hydration after this and take the element over anyway
const HYDRATION_WAIT_MS = 10000;
const HYDRATION_POLL_MS = 50;

// This component hydrates with the root layout, before the page's streamed
// segments. Writing data-reveal-* attributes onto server HTML that React has
// not hydrated yet causes a hydration mismatch, so wait until React has
// claimed the node. React DOM stores its fiber on the node under a
// "__reactFiber$<random>" key once it hydrates (or creates) it. This is a
// React internal: if it ever disappears, elements are simply taken over after
// HYDRATION_WAIT_MS.
const isHydrated = (el: Element) => Object.keys(el).some((key) => key.startsWith("__reactFiber$"));

const toNumber = (value: string | undefined) => {
  if (value === undefined || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

// "0.8s, 120ms" -> 800
const maxTimeMs = (value: string) =>
  Math.max(
    0,
    ...value.split(",").map((part) => {
      const t = parseFloat(part);
      if (Number.isNaN(t)) return 0;
      return part.trim().endsWith("ms") ? t : t * 1000;
    })
  );

export default function ScrollReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tracked = new WeakSet<Element>();
    const timers = new Set<number>();

    const markDone = (el: RevealElement) => el.setAttribute("data-reveal-done", "");

    const showNow = (el: RevealElement) => {
      el.setAttribute("data-revealed", "true");
      markDone(el);
    };

    const reveal = (el: RevealElement, index: number) => {
      const delay = toNumber(el.dataset.revealDelay);
      if (delay !== null) el.style.setProperty("--reveal-delay", `${delay}ms`);

      const duration = toNumber(el.dataset.revealDuration);
      if (duration !== null) el.style.setProperty("--reveal-duration", `${duration}ms`);

      const staggerParent = el.parentElement?.closest<HTMLElement>(STAGGER_SELECTOR);
      if (staggerParent && !el.style.getPropertyValue("--reveal-index")) {
        el.style.setProperty("--reveal-index", String(index));
        const step = toNumber(staggerParent.dataset.revealStagger);
        if (step !== null) el.style.setProperty("--reveal-stagger-step", `${step}ms`);
      }

      el.setAttribute("data-revealed", "true");

      // Drop the transition/will-change once finished (transitionend, or a timeout fallback)
      const style = getComputedStyle(el);
      const total = maxTimeMs(style.transitionDuration) + maxTimeMs(style.transitionDelay);
      const finish = () => {
        window.clearTimeout(timer);
        timers.delete(timer);
        el.removeEventListener("transitionend", onEnd as EventListener);
        markDone(el);
      };
      const onEnd = (event: TransitionEvent) => {
        if (event.target === el && event.propertyName === "opacity") finish();
      };
      const timer = window.setTimeout(finish, total + 100);
      timers.add(timer);
      el.addEventListener("transitionend", onEnd as EventListener);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as RevealElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

        // Stagger index counts only elements revealed together in the same parent
        const batchIndex = new Map<Element | null, number>();
        for (const el of visible) {
          observer.unobserve(el);
          const parent = el.parentElement?.closest(STAGGER_SELECTOR) ?? null;
          const index = batchIndex.get(parent) ?? 0;
          batchIndex.set(parent, index + 1);
          reveal(el, index);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    // Elements waiting for React to hydrate them -> time they appeared in the DOM
    const pending = new Map<RevealElement, number>();
    let pollTimer: number | undefined;

    const takeOver = (el: RevealElement, appearedAt: number) => {
      if (tracked.has(el) || el.hasAttribute("data-revealed")) return;
      tracked.add(el);
      el.setAttribute("data-reveal-observed", "");
      // If the CSS failsafe has already shown it, keep it visible instead of
      // hiding and replaying.
      const failsafeFired = performance.now() - appearedAt >= FAILSAFE_MS;
      if (failsafeFired || reducedMotion.matches) showNow(el);
      else observer.observe(el);
    };

    const pollPending = () => {
      pollTimer = undefined;
      const now = performance.now();
      pending.forEach((appearedAt, el) => {
        if (!el.isConnected) pending.delete(el);
        else if (isHydrated(el) || now - appearedAt >= HYDRATION_WAIT_MS) {
          pending.delete(el);
          takeOver(el, appearedAt);
        }
      });
      if (pending.size) pollTimer = window.setTimeout(pollPending, HYDRATION_POLL_MS);
    };

    const track = (el: RevealElement, appearedAt: number) => {
      if (tracked.has(el) || pending.has(el) || el.hasAttribute("data-revealed")) return;
      if (isHydrated(el)) return takeOver(el, appearedAt);
      pending.set(el, appearedAt);
      if (pollTimer === undefined) pollTimer = window.setTimeout(pollPending, HYDRATION_POLL_MS);
    };

    const scan = (root: Element | Document, appearedAt = performance.now()) => {
      if (root instanceof Element && root.matches(SELECTOR)) track(root as RevealElement, appearedAt);
      root.querySelectorAll<RevealElement>(SELECTOR).forEach((el) => track(el, appearedAt));
    };

    const untrack = (root: Element) => {
      const els = root.matches(SELECTOR) ? [root, ...root.querySelectorAll(SELECTOR)] : root.querySelectorAll(SELECTOR);
      els.forEach((el) => {
        observer.unobserve(el);
        tracked.delete(el);
        pending.delete(el as RevealElement);
      });
    };

    // Server-rendered elements have been in the DOM since page load (time 0)
    scan(document, 0);

    // Client navigation / dynamically rendered content
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "attributes") {
          scan(record.target as Element);
          continue;
        }
        record.removedNodes.forEach((node) => {
          if (node instanceof Element && !node.isConnected) untrack(node);
        });
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) scan(node);
        });
      }
    });
    mutations.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-reveal"],
    });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(pollTimer);
    };
  }, []);

  return null;
}
