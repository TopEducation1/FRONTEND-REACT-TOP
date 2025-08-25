// BlobsCircle.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

const BlobsCircle = () => {
  // Clase Tailwind + HEX (inline fallback) para blindar el color en prod
  const palette = [
    { cls: "bg-[#D33B3E]", hex: "#D33B3E" }, // rojo
    { cls: "bg-[#034694]", hex: "#034694" }, // azul
    { cls: "bg-[#5CC781]", hex: "#5CC781" }, // verde
  ];

  const COUNT = 6;           // 6 blobs por ronda
  const SIZE = 100;          // px
  const DURATION = 7000;     // ms (como antes)
  const STAGGER = 250;       // ms entre cada blob de la ronda
  const BASE_RADIUS = 250;   // como el original

  const wrapRef = useRef(null);
  const timers = useRef([]);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [blobs, setBlobs] = useState([]); // { id, left, top, colorIdx }

  // Medir el contenedor (el padre ya es relative)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: r.width, h: r.height });
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Radio: usa 280 como máximo, pero clámalo al contenedor para no salirse
  const radius = useMemo(() => {
    if (!box.w || !box.h) return BASE_RADIUS;
    const maxR = Math.max(60, Math.min(BASE_RADIUS, Math.min(box.w, box.h) / 2 - SIZE));
    return maxR;
  }, [box]);

  // Generar rondas periódicas como el original
  useEffect(() => {
    if (!box.w || !box.h) return;

    const center = { x: box.w / 2, y: box.h / 2 };

    const launchRound = () => {
      for (let i = 0; i < COUNT; i++) {
        const angle = (i / COUNT) * 2 * Math.PI;
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);
        const colorIdx = i % palette.length;

        const tAdd = setTimeout(() => {
          const id = Date.now() + i + Math.random();
          setBlobs((prev) => [
            ...prev,
            {
              id,
              left: x - SIZE / 2, // centrado en la coordenada
              top: y - SIZE / 2,
              colorIdx,
            },
          ]);

          // limpiar al finalizar animación
          const tDel = setTimeout(() => {
            setBlobs((prev) => prev.filter((b) => b.id !== id));
          }, DURATION);
          timers.current.push(tDel);
        }, i * STAGGER);

        timers.current.push(tAdd);
      }
    };

    // primera ronda inmediatamente y luego cada 3s (como antes)
    launchRound();
    const interval = setInterval(launchRound, 3000);

    return () => {
      clearInterval(interval);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [box, radius]);

  return (
    // 👇 absoluto dentro del padre relative, sin fixed y sin scroll lateral
    <div
      ref={wrapRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ contain: "paint" }}
    >
      {blobs.map((blob) => {
        const cx = box.w / 2;
        const cy = box.h / 2;
        // traslación necesaria para llevar cada blob exactamente al centro
        const tx = cx - (blob.left + SIZE / 2);
        const ty = cy - (blob.top + SIZE / 2);
        const { cls, hex } = palette[blob.colorIdx];

        return (
          <motion.span
            key={blob.id}
            className={`absolute ${cls} rounded-full blur-md mix-blend-screen will-change-transform`}
            style={{
              top: blob.top,
              left: blob.left,
              width: SIZE,
              height: SIZE,
              opacity: 0.8,
              // Fallback de color por si Tailwind purga la clase en prod
              backgroundColor: hex,
            }}
            initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
            animate={{ x: tx, y: ty, scale: 0.1, opacity: 0 }}
            transition={{ duration: DURATION / 1000, ease: "easeInOut" }}
          />
        );
      })}
    </div>
  );
};

export default BlobsCircle;
