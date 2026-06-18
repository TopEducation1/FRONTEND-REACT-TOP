// BlobsCircle.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BlobsCircle = () => {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 5,
    }));

    setDots(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      
      {/* Glow superior izquierdo */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(92,124,250,0.12) 0%, rgba(92,124,250,0) 70%)",
        }}
      />

      {/* Glow derecho */}
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] right-[-150px] w-[400px] h-[400px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(132,94,247,0.10) 0%, rgba(132,94,247,0) 70%)",
        }}
      />

      {/* Glow inferior */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-200px] left-[30%] w-[500px] h-[500px] rounded-full blur-[150px]"
        style={{
          background:
            "radial-gradient(circle, rgba(160,160,255,0.08) 0%, rgba(160,160,255,0) 70%)",
        }}
      />

      {/* Puntos */}
      {dots.map((dot) => (
        <motion.span
          key={dot.id}
          className="absolute rounded-full bg-[#B8B8C7]"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [
              dot.opacity,
              dot.opacity + 0.2,
              dot.opacity,
            ],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            delay: dot.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default BlobsCircle;