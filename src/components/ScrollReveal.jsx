import React, {
  useEffect,
  useRef,
  useState,
} from "react";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  distance = 40,
  duration = 700,
  once = true,
  threshold = 0.12,
}) {
  const elementRef = useRef(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    /*
     * Respeta usuarios que prefieren
     * menos animaciones.
     */
    const prefersReducedMotion =
      window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      )?.matches;

    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);

          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once, threshold]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: visible ? 1 : 0,

        transform: visible
          ? "translate3d(0, 0, 0)"
          : `translate3d(0, ${distance}px, 0)`,

        transitionProperty:
          "opacity, transform",

        transitionDuration:
          `${duration}ms`,

        transitionTimingFunction:
          "cubic-bezier(0.22, 1, 0.36, 1)",

        transitionDelay:
          `${delay}ms`,

        willChange:
          visible
            ? "auto"
            : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}