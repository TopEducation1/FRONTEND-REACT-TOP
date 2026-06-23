import React, { useRef, useEffect, useState } from "react";
import { useLenis } from "@studio-freight/react-lenis";

export default function HorizontalScroll({ children }) {
  const wrapperRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  const [sectionHeight, setSectionHeight] = useState(0);
  const [maxScrollX, setMaxScrollX] = useState(0);

  const lenis = useLenis();

  useEffect(() => {
    let ro = null;

    const calc = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;

      if (!viewport || !track) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const contentWidth = track.scrollWidth || 0;
      const maxX = Math.max(0, contentWidth - vw);

      setMaxScrollX(maxX);
      setSectionHeight(vh + maxX);
    };

    const setup = () => {
      const track = trackRef.current;

      if (!track) return;

      calc();

      window.addEventListener("resize", calc);

      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(calc);
        ro.observe(track);
      }

      const imgs = track.querySelectorAll("img");

      imgs.forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", calc, { once: true });
          img.addEventListener("error", calc, { once: true });
        }
      });
    };

    requestAnimationFrame(setup);

    return () => {
      window.removeEventListener("resize", calc);

      if (ro) {
        ro.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;

    const onScroll = ({ scroll }) => {
      const wrapper = wrapperRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;

      if (!wrapper || !viewport || !track) return;

      const start = wrapper.offsetTop;
      const end = start + sectionHeight;

      if (scroll <= start) {
        track.style.transform = "translateX(0px)";
        return;
      }

      if (scroll >= end) {
        track.style.transform = `translateX(-${maxScrollX}px)`;
        return;
      }

      const y = scroll - start;
      const x = Math.min(Math.max(y, 0), maxScrollX);

      track.style.transform = `translateX(-${x}px)`;
    };

    lenis.on("scroll", onScroll);

    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis, sectionHeight, maxScrollX]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        height: sectionHeight ? `${sectionHeight}px` : "100vh",
      }}
    >
      <div
        ref={viewportRef}
        className="horizontal-scroll-viewport"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100vw",
          overflowX: "hidden",
          overscrollBehaviorX: "contain",
          willChange: "transform",
        }}
      >
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