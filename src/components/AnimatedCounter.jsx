import React, { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

const AnimatedCounter = ({ end = 100, title, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration / 16); // ~60fps
      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 16); // ~60fps
    }
  }, [isInView, end, duration]);

  return (
    <span
      ref={ref}
    >
      +{count} {title}
    </span>
  );
};

export default AnimatedCounter;
