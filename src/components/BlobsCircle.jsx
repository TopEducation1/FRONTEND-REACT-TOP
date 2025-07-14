import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BlobsCircle = () => {
  const [blobs, setBlobs] = useState([]);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const colors = ["bg-[#D33B3E]", "bg-[#034694]", "bg-[#5CC781]"];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const radius = 280;

  // Detectar scroll


  // Generar blobs periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const color = colors[i % colors.length];

        setTimeout(() => {
          setBlobs((prev) => [
            ...prev,
            {
              id: Date.now() + i + Math.random(),
              left: x,
              top: y,
              color,
            },
          ]);
        }, i * 280);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute w-screen h-screen ">
      {blobs.map((blob) => (
        <motion.span
          key={blob.id}
          className={`blob ${blob.color} absolute rounded-full blur-md mix-blend-screen`}
          style={{
            top: blob.top,
            left: blob.left,
            width: 110,
            height: 110,
            borderRadius: "50%",
            opacity: 0.8,
          }}
          initial={{
            scale: 1,
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            x: centerX - blob.left - 30,
            y: centerY - blob.top - 30,
            scale: 0.1,
            opacity: 0,
          }}
          transition={{
            duration: 7,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default BlobsCircle;
