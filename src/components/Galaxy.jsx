import React, { useEffect, useRef } from "react";

/**
 * Galaxy — Fondo animado con canvas (ligero y configurable)
 * Props:
 *  - density (number): multiplica la cantidad de partículas. Default 1.2
 *  - glowIntensity (number): 0–1.5 aprox. Define blur/sombra y brillo de los trazos. Default 0.6
 *  - saturation (number): 0–1 para saturación HSL. Default 0.8
 *  - hueShift (number): 0–360. Desplazamiento de color principal. Default 240 (azules)
 *  - mouseInteraction (boolean): si true, reacciona al mouse. Default false
 *  - mouseRepulsion (boolean): si true, partículas se repelen del mouse; si false, se atraen levemente. Default false
 */
export default function Galaxy({
  density = 1.2,
  glowIntensity = 0.6,
  saturation = 0.8,
  hueShift = 240,
  mouseInteraction = false,
  mouseRepulsion = false,
  className = "",
  style,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, inside: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    let w = 0,
      h = 0,
      dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      const parent = canvas.parentElement || document.body;
      w = parent.clientWidth || window.innerWidth;
      h = parent.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function initParticles() {
      const area = w * h;
      const base = 0.00012; // densidad base
      const count = Math.max(60, Math.floor(area * base * density));
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.55;
      const arms = 3 + Math.floor(Math.random() * 2); // 3–4 brazos
      const armOffset = rand(0, Math.PI * 2);

      particlesRef.current = new Array(count).fill(0).map((_, i) => {
        // distribuye en espiral con brazos
        const t = Math.random();
        const r = Math.pow(t, 0.6) * maxR; // más densidad en el centro
        const arm = i % arms;
        const baseAngle = (arm / arms) * Math.PI * 2 + armOffset;
        const swirl = r * 0.0025; // giro espiral
        const a = baseAngle + swirl + rand(-0.3, 0.3);

        const speed = rand(0.00015, 0.00045); // radianes por frame
        const size = rand(0.6, 1.6);

        // color HSL basado en radio
        const hue = (hueShift + (r / maxR) * 60 + rand(-10, 10) + 360) % 360;
        const sat = Math.round(saturation * 100);
        const light = 65 + (1 - r / maxR) * 20 + rand(-5, 5); // más claro en el centro

        return {
          cx,
          cy,
          r,
          a,
          speed,
          size,
          hue,
          sat,
          light,
          vx: 0,
          vy: 0,
        };
      });
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const blur = 8 + glowIntensity * 12; // 8–26 aprox
      ctx.shadowBlur = blur;
      ctx.shadowColor = `hsla(${hueShift}, ${Math.round(saturation * 100)}%, 60%, ${0.25 + glowIntensity * 0.35})`;

      const particles = particlesRef.current;
      const m = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // rotación suave
        p.a += p.speed;

        // posición base por ángulo/radio
        let x = p.cx + Math.cos(p.a) * p.r;
        let y = p.cy + Math.sin(p.a) * p.r;

        // interacción de mouse
        if (mouseInteraction && m.inside) {
          const dx = x - m.x;
          const dy = y - m.y;
          const dist2 = dx * dx + dy * dy;
          const maxInfluence = 140;
          if (dist2 < maxInfluence * maxInfluence) {
            const dist = Math.sqrt(Math.max(0.0001, dist2));
            const force = (mouseRepulsion ? 1 : -1) * (1 - dist / maxInfluence) * 2.2; // empuja/atrae
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // aplica inercia leve y decaimiento
        x += p.vx;
        y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;

        // dibuja partícula
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, 0.9)`;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(step);
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.inside = true;
    }
    function onMouseLeave() {
      mouseRef.current.inside = false;
    }

    resize();
    window.addEventListener("resize", resize);
    if (mouseInteraction) {
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseleave", onMouseLeave);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      if (mouseInteraction) {
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [density, glowIntensity, saturation, hueShift, mouseInteraction, mouseRepulsion]);

  return (
    <canvas
      ref={canvasRef}
      className={["absolute inset-0 h-full w-full", className].join(" ")}
      style={style}
      aria-hidden
    />
  );
}
