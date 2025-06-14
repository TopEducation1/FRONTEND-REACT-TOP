// SmoothScrollProvider.jsx
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SmoothScrollProvider = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // curva de impulso
      smoothWheel: true,
      smoothTouch: true,
      autoRaf: false, // lo controlamos manualmente con GSAP
    });

    // Sincronizar Lenis con ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Usar el ticker de GSAP para controlar el raf de Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // gsap da el tiempo en segundos, Lenis lo quiere en ms
    });

    // Desactivar smoothing de GSAP para evitar retrasos
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScrollProvider;
