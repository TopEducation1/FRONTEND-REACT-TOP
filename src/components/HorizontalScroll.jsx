import React, { useRef, useEffect, useState } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

export default function HorizontalScroll({ children }) {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  const [sectionHeight, setSectionHeight] = useState(0);
  const [maxScrollX, setMaxScrollX] = useState(0);

  const lenis = useLenis();

  // Recalcular medidas (incluye imágenes/resize/contenido dinámico)
  useEffect(() => {
    if (!contentRef.current) return;

    const calc = () => {
      if (!contentRef.current) return;
      const contentWidth = contentRef.current.scrollWidth || 0;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const maxX = Math.max(0, contentWidth - vw); // ancho a desplazar
      setMaxScrollX(maxX);
      setSectionHeight(maxX + vh);                  // altura total de la sección
    };

    // 1) inicio y cada resize
    calc();
    window.addEventListener('resize', calc);

    // 2) si cambian nodos/imagenes dentro
    const ro = new ResizeObserver(calc);
    ro.observe(contentRef.current);

    // 3) por si las imágenes cargan después
    const imgs = contentRef.current.querySelectorAll('img');
    let pending = 0;
    imgs.forEach(img => {
      if (!img.complete) {
        pending++;
        img.addEventListener('load', () => {
          pending--;
          if (pending === 0) calc();
        }, { once: true });
        img.addEventListener('error', () => {
          pending--;
          if (pending === 0) calc();
        }, { once: true });
      }
    });

    return () => {
      window.removeEventListener('resize', calc);
      ro.disconnect();
    };
  }, []);

  // Sincronizar con el scroll de Lenis
  useEffect(() => {
    if (!lenis) return;

    const onScroll = ({ scroll }) => {
      if (!wrapperRef.current || !contentRef.current) return;

      const start = wrapperRef.current.offsetTop;
      const end = start + sectionHeight;

      // fuera de rango → fija al inicio/fin para evitar “saltos”
      if (scroll <= start) {
        contentRef.current.style.transform = 'translateX(0px)';
        return;
      }
      if (scroll >= end) {
        contentRef.current.style.transform = `translateX(-${maxScrollX}px)`;
        return;
      }

      // dentro del rango → mapea scroll vertical a horizontal
      const y = scroll - start;                           // avance dentro de la sección
      const x = Math.min(Math.max(y, 0), maxScrollX);     // clamp
      contentRef.current.style.transform = `translateX(-${x}px)`;
    };

    lenis.on('scroll', onScroll);
    return () => lenis.off('scroll', onScroll);
  }, [lenis, sectionHeight, maxScrollX]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        height: `${sectionHeight}px`,
      }}
    >
      <div
        ref={contentRef}
        className="lenis-sticky horizontal-scroll-content"
        style={{
          position: 'sticky',   // importante
          top: 0,
          height: '100vh',
          display: 'flex',
          width: 'max-content', // evita que el contenido se comprima
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
