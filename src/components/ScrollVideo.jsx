import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { useInView } from "framer-motion";

const ScrollVideo = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { threshold: 0.5 });

  // Lenis scroll initialization
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  useEffect(() => {
  const handleScroll = () => {
    if (!videoRef.current) return;

    const scrollTop = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScroll;

    const duration = videoRef.current.duration || 1;
    videoRef.current.currentTime = scrollFraction * duration;
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  // Video playback control
  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <section ref={containerRef} className="h-[100vh] relative overflow-hidden">
      <video
        ref={videoRef}
        src="/assets/video/main-video.mp4"
        className="w-full h-full object-cover absolute top-0 left-0"
        muted
        playsInline
      />
      <div className="relative z-10 flex h-full justify-center items-center text-white text-4xl">
        <h2>Video empieza al hacer scroll</h2>
      </div>
    </section>
  );
};

export default ScrollVideo;
