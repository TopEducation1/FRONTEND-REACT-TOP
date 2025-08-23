import React, { useRef, useEffect, useState } from "react";
import { useLenis } from "@studio-freight/react-lenis";

export default function HorizontalScroll({ children }) {
  const wrapperRef = useRef(null);        // sección alta (scroll vertical)
  const viewportRef = useRef(null);       // sticky viewport (100vw, overflow-x hidden)
  const trackRef = useRef(null);          // pista que se traslada en X

  const [sectionHeight, setSectionHeight] = useState(0);
  const [maxScrollX, setMaxScrollX] = useState(0);

  const lenis = useLenis();

  // Recalcular medidas
  useEffect(() => {
    const calc = () => {
      if (!viewportRef.current || !trackRef.current) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Ancho real del contenido que se moverá
      const contentWidth = trackRef.current.scrollWidth || 0;

      // Si el contenido cabe en pantalla, no generamos extra de alto
      const maxX = Math.max(0, contentWidth - vw);

      setMaxScrollX(maxX);
      setSectionHeight(vh + maxX); // alto total para mapear vertical -> horizontal
    };

    calc();
    window.addEventListener("resize", calc);

    const ro = new ResizeObserver(calc);
    if (trackRef.current) ro.observe(trackRef.current);

    const imgs = trackRef.current?.querySelectorAll?.("img") ?? [];
    let pending = 0;
    imgs.forEach((img) => {
      if (!img.complete) {
        pending++;
        const done = () => {
          pending--;
          if (pending === 0) calc();
        };
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });

    return () => {
      window.removeEventListener("resize", calc);
      ro.disconnect();
    };
  }, []);

  // Sincronizar con Lenis
  useEffect(() => {
    if (!lenis) return;

    const onScroll = ({ scroll }) => {
      if (!wrapperRef.current || !viewportRef.current || !trackRef.current) return;

      const start = wrapperRef.current.offsetTop;
      const end = start + sectionHeight;

      if (scroll <= start) {
        trackRef.current.style.transform = "translateX(0px)";
        return;
      }
      if (scroll >= end) {
        trackRef.current.style.transform = `translateX(-${maxScrollX}px)`;
        return;
      }

      const y = scroll - start;
      const x = Math.min(Math.max(y, 0), maxScrollX);
      trackRef.current.style.transform = `translateX(-${x}px)`;
    };

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis, sectionHeight, maxScrollX]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        height: `${sectionHeight}px`,
      }}
    >
      {/* Viewport pegajoso que NO crece de ancho */}
      <div
        ref={viewportRef}
        className="horizontal-scroll-viewport"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100vw",          // clave: limita el ancho al viewport
          overflowX: "hidden",     // clave: evita scroll horizontal
          overscrollBehaviorX: "contain",
          willChange: "transform",
        }}
      >
        {/* Pista que sí puede medir >100vw y es la que movemos */}
        <div
          ref={trackRef}
          className="horizontal-scroll-track"
          style={{
            display: "flex",
            width: "max-content",
            height: "100%",
            willChange: "transform",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
