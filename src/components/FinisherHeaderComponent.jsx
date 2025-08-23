import React, { useEffect, useMemo, useState, useRef } from 'react';
import BlurText from "./BlurText";
import BlobsCircle from "./BlobsCircle";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import ReactModal from 'react-modal';
import { loadSlim } from "@tsparticles/slim";
import { motion, useAnimation, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";


ReactModal.setAppElement('#root');

const FinisherHeaderComponent = () => {

  const contentRef = useRef(null);

  const [init, setInit] = useState(false);

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start end", "end start"],
  });

  // 🧠 Clamp scroll para evitar cambio antes de 0.2
  const clampedProgress = useTransform(scrollYProgress, (val) =>
    val < 0.2 ? 0 : (val - 0.2) / (1 - 0.2)
  );

  // 🎯 Transiciones después de scroll > 0.2
  const opacity = useTransform(clampedProgress, [0.3, 1], [1, 0.2]);
  const scale = useTransform(clampedProgress, [0, 1], [1, 0.5]);
  const y = useTransform(clampedProgress, [0, 1], [0, 50]);
  
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const videoRef = useRef(null);
  const [buttonRect, setButtonRect] = useState(null);

  const openModal = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    setButtonRect(rect);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };


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
          speed: 1,
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
  const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

  return (
    <>
      
      <div className="header finisher-header w-full h-[100vh] top-0 mx-auto px-4 justify-center-safe relative gap-2">
        {/*<Particles id="tsparticles" options={options} />
        
         ⬇ Sección que se desvanece al hacer scroll */}
        <BlobsCircle/>
        <motion.div
          ref={contentRef}
          style={{ opacity, scale, y }}
          className="grid columns-1 justify-items-center content-evenly gap-4 z-10"
        >
          <h1 className='m-auto w-full text-[4.75rem] max-w-[100%] md:max-w-[80%] lg:max-w-[55%] text-center leading-[1.2em]'>
            <BlurText
              text="Conecta los puntos, forma tu historia"
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className=" w-full  text-[#F6F4EF] "
            />
          </h1>
          <p className="text-[1.125rem] text-[#a8a8a8] text-center mt-[-15px] font-['Montserrat']">
            Crea tu ruta de aprendizaje con los más top del mundo.
          </p> 
          
          <button className="btn btn-col-4 py-2 px-5 w-auto" ref={buttonRef} onClick={openModal}>
            ¿Qué es<span id="top">top</span>
            <span id="education">.education</span>?
          </button>

          <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="overlay"
        closeTimeoutMS={400}
        ariaHideApp={false}
      >
        <AnimatePresence>
          {isOpen && buttonRect && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.2,
                x: buttonRect.left + buttonRect.width / 2 - window.innerWidth / 2,
                y: buttonRect.top + buttonRect.height / 2 - window.innerHeight / 2,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.2,
                x: buttonRect.left + buttonRect.width / 2 - window.innerWidth / 2,
                y: buttonRect.top + buttonRect.height / 2 - window.innerHeight / 2,
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="modal-inner-content"
            >
              <button onClick={closeModal} className="btn btn-close">x</button>
              <div className="video-container">
                <video ref={videoRef} src="/assets/video/main-video.mp4" controls />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ReactModal>
        </motion.div>
      </div>
    </>
  );
};

export default FinisherHeaderComponent;
