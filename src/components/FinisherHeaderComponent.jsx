import React, { useEffect, useMemo, useState, useRef } from 'react';
import BlurText from "./BlurText";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import ReactModal from 'react-modal';
import { loadSlim } from "@tsparticles/slim";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";

ReactModal.setAppElement('#root');

const FinisherHeaderComponent = () => {
  const ref = useRef();
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const controls = useAnimation();

  const [isOpen, setIsOpen] = useState(false);
  const [init, setInit] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // 🎬 Fade out al hacer scroll
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  // Animación de introducción del título
  useEffect(() => {
    async function runIntroAnimation() {
      await controls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 2.5, ease: "easeOut" },
      });
      setShowIntro(false);
      await controls.start({
        opacity: 0,
        transition: { duration: 1.2, ease: "easeInOut", delay: 0.8 },
      });
    }
    controls.set({ scale: 6, opacity: 1 });
    runIntroAnimation();
  }, [controls]);

  const positions = [
    { top: "65%", left: "15%" },
    { top: "40%", left: "45%" },
    { top: "65%", left: "75%" },
  ];
  const colors = ["blue", "green", "red"];

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      background: { color: { value: "#0F090B" } },
      fpsLimit: 200,
      interactivity: {
        events: {
          onClick: { enable: false, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 100, duration: 0.4 },
        },
      },
      particles: {
        color: { value: "#b0b0b0" },
        links: {
          color: "#b0b0b0",
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "bounce" },
          random: false,
          speed: 2,
          straight: false,
        },
        number: { density: { enable: false }, value: 50 },
        opacity: { value: 0.5 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 5 } },
      },
      detectRetina: false,
    }),
    []
  );

  return (
    <>
      {/* Overlay de introducción */}
      {showIntro && (
        <motion.div
          initial={{ scale: 6, opacity: 1 }}
          animate={controls}
          style={{
            position: "fixed",
            zIndex: 9999,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#0F090B",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            lineHeight: "8em",
          }}
        >
          <h1
            style={{
              color: "#F6F4EF",
              fontSize: "6rem",
              textAlign: "center",
              marginBottom: "100px",
              userSelect: "none",
            }}
          >
            Conecta los puntos,<br /> forma tu historia
          </h1>
        </motion.div>
      )}

      <div className="header finisher-header w-full h-[100vh] top-0 mx-auto px-4 justify-center-safe bg-[#0F090B] relative gap-2">
        <Particles id="tsparticles" options={options} />

        {positions.map((pos, index) => (
          <motion.span
            key={index}
            className={`blob ${colors[index % colors.length]}`}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
            }}
            animate={{
              y: [0, -window.innerHeight * 0.8, 0],
              x: [0, (Math.random() - 0.5) * 200, 0],
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        ))}

        {/* ⬇ Sección que se desvanece al hacer scroll */}
        <motion.div
          ref={contentRef}
          style={{ opacity }}
          className="grid columns-1 justify-items-center content-evenly gap-4 z-10"
        >
          {!showIntro && (
            <>
              <h1 className="text-8xl w-full xl:w-[45vw] text-[#F6F4EF] text-center leading-30">
                Conecta los puntos,<br /> forma tu historia
              </h1>
              <p className="text-[#F6F4EF] text-center font-['Montserrat'] text-2xl">
                Crea tu ruta de aprendizaje con los más top del mundo.
              </p>
            </>
          )}
          <button className="btn btn-col-4 py-3 px-5 w-auto" onClick={openModal}>
            ¿Qué es<span id="top">top</span>
            <span id="education">.education</span>?
          </button>

          <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Video Pop-up"
            className="modal"
            overlayClassName="overlay"
            closeTimeoutMS={400}
          >
            <button onClick={closeModal} className="btn btn-close">x</button>
            <div className="video-container">
              <video ref={videoRef} src="/assets/video/main-video.mp4" controls></video>
            </div>
          </ReactModal>
        </motion.div>
      </div>
    </>
  );
};

export default FinisherHeaderComponent;
