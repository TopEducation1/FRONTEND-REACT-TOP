import React, { useMemo, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

// Distancia euclidiana
const hypot = (dx, dy) => Math.hypot(dx, dy);

/**
 * NeuronBackground con:
 * - Conexiones k-NN con dash animado
 * - "Chispas" (sparks) que viajan por las conexiones
 *
 * props:
 * - nodes: [{ id: string, xPct: number, yPct: number }]
 * - hoveredId?: string | null
 * - k?: number (default 3)
 * - maxDistPct?: number (default 28)
 * - disableOnMobile?: boolean (default true)
 * - sparkDensity?: 0..1 (default 0.6)  // cuántas chispas por arista
 * - speedRangeSec?: [min,max] (default [2.2, 4.0])
 */
export default function NeuronBackground({
  nodes,
  hoveredId = null,
  k = 3,
  maxDistPct = 28,
  disableOnMobile = true,
  sparkDensity = 0.6,
  speedRangeSec = [2.2, 4.0],
}) {
  const svgRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Observa el tamaño del contenedor padre del SVG
  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect || {};
      setSize({ w: width ?? 0, h: height ?? 0 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Bandera móvil
  useEffect(() => {
    const setFlag = () =>
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    setFlag();
    window.addEventListener("resize", setFlag);
    return () => window.removeEventListener("resize", setFlag);
  }, []);

  // Nodos a px
  const pxNodes = useMemo(() => {
    const { w, h } = size;
    if (!w || !h) return [];
    return nodes
      .filter(
        (n) =>
          typeof n.xPct === "number" &&
          typeof n.yPct === "number" &&
          !Number.isNaN(n.xPct) &&
          !Number.isNaN(n.yPct)
      )
      .map((n) => ({
        ...n,
        x: (n.xPct / 100) * w,
        y: (n.yPct / 100) * h,
      }));
  }, [nodes, size]);

  // Conexiones k-NN (sin duplicados) y métricas
  const edges = useMemo(() => {
    if (pxNodes.length === 0) return [];
    const uniq = new Set();
    const out = [];
    const avg = (size.w + size.h) / 2 || 1;

    for (let i = 0; i < pxNodes.length; i++) {
      const a = pxNodes[i];
      const sorted = pxNodes
        .filter((_, j) => j !== i)
        .map((b) => {
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          return { b, d: hypot(dx, dy), dx, dy };
        })
        .sort((u, v) => u.d - v.d)
        .slice(0, k);

      for (const { b, d, dx, dy } of sorted) {
        const dPct = (d / avg) * 100;
        if (dPct > maxDistPct) continue;
        const key = a.id < b.id ? `${a.id}__${b.id}` : `${b.id}__${a.id}`;
        if (uniq.has(key)) continue;
        uniq.add(key);

        const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
        out.push({
          key,
          a,
          b,
          length: d,
          angleDeg,
        });
      }
    }
    return out;
  }, [pxNodes, k, maxDistPct, size.w, size.h]);

  // Chispas por arista (2 como máx. si density=1)
  const sparks = useMemo(() => {
    const list = [];
    for (const e of edges) {
      const count = Math.max(
        0,
        Math.min(2, Math.round(sparkDensity * 2)) // 0..2
      );
      for (let i = 0; i < count; i++) {
        const dur =
          speedRangeSec[0] +
          Math.random() * Math.max(0, speedRangeSec[1] - speedRangeSec[0]);
        const delay = Math.random() * 2.0;
        const reverse = Math.random() < 0.35; // unas cuantas chispas van al revés
        list.push({
          id: `${e.key}-spark-${i}`,
          edgeKey: e.key,
          x0: reverse ? e.b.x : e.a.x,
          y0: reverse ? e.b.y : e.a.y,
          angle: reverse ? e.angleDeg + 180 : e.angleDeg,
          length: e.length,
          duration: Math.max(0.8, dur),
          delay,
          hot:
            hoveredId &&
            (e.a.id === hoveredId || e.b.id === hoveredId) &&
            Math.random() < 0.6, // más brillantes en hover
        });
      }
    }
    return list;
  }, [edges, hoveredId, sparkDensity, speedRangeSec]);

  // Condición de render al final
  if (disableOnMobile && isMobile) return null;

  const vw = Math.max(size.w, 1);
  const vh = Math.max(size.h, 1);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 -z-10"
      width="100%"
      height="100%"
      viewBox={`0 0 ${vw} ${vh}`}
      preserveAspectRatio="none"
      style={{ filter: "drop-shadow(0 0 18px rgba(246,244,239,0.08))" }}
    >
      {/* Glow radial muy sutil */}
      <defs>
        <radialGradient id="bg-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(246,244,239,0.05)" />
          <stop offset="100%" stopColor="rgba(246,244,239,0.0)" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={vw} height={vh} fill="url(#bg-glow)" />

      {/* Conexiones */}
      {edges.map(({ a, b, key }) => {
        const isHot =
          hoveredId && (a.id === hoveredId || b.id === hoveredId);
        const baseOpacity = isHot ? 0.9 : 0.35;
        const baseWidth = isHot ? 1.8 : 1;

        return (
          <motion.line
            key={key}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="rgba(246,244,239,0.8)"
            strokeWidth={baseWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: baseOpacity }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            style={{
              strokeDasharray: "6 10",
              animation: "dash-move 3.6s linear infinite",
              filter: isHot
                ? "drop-shadow(0 0 6px rgba(246,244,239,0.55))"
                : "none",
            }}
          />
        );
      })}

      {/* Chispas que viajan por las líneas */}
      {sparks.map((s) => (
        <g
          key={s.id}
          transform={`translate(${s.x0} ${s.y0}) rotate(${s.angle})`}
        >
          <motion.circle
            r={s.hot ? 2.1 : 1.6}
            cy={0}
            fill={s.hot ? "rgba(246,244,239,1)" : "rgba(246,244,239,0.9)"}
            style={{
              filter: s.hot
                ? "drop-shadow(0 0 10px rgba(246,244,239,0.8))"
                : "drop-shadow(0 0 6px rgba(246,244,239,0.5))",
            }}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: s.length, opacity: [0, 1, 0.2, 0] }}
            transition={{
              duration: s.duration,
              ease: "linear",
              repeat: Infinity,
              delay: s.delay,
              repeatDelay: 0.4,
            }}
          />
        </g>
      ))}

      {/* Nodos */}
      {pxNodes.map((n) => {
        const isHot = hoveredId && n.id === hoveredId;
        return (
          <motion.circle
            key={`node-${n.id}`}
            cx={n.x}
            cy={n.y}
            r={isHot ? 3.6 : 2.6}
            fill="rgba(246,244,239,0.95)"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: isHot ? [1, 1.22, 1] : [1, 1.08, 1],
              opacity: isHot ? 1 : 0.7,
            }}
            transition={{
              duration: 2.0,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: isHot ? 0.2 : 0.6,
            }}
          />
        );
      })}

      <style>{`
        @keyframes dash-move { 
          to { stroke-dashoffset: -320; } 
        }
      `}</style>
    </svg>
  );
}
