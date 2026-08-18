import { useEffect, useRef, useState } from "react";

/**
 * Odhalí prvok pri scrollovaní do viewportu.
 * Vráti ref + boolean "shown". Kombinuj s CSS triedou .reveal / .is-visible,
 * alebo použi `shown` na spustenie vlastných animácií.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.18 },
  once = true,
) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setShown(false);
        }
      });
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, shown };
}
