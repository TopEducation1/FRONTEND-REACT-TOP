import React, { useEffect, useState, useRef } from "react";
import BlobsCircle from "./BlobsCircle";
import ReactModal from "react-modal";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import { useNavigate } from "react-router-dom";





ReactModal.setAppElement("#root");

const FinisherHeaderComponent = () => {
  const contentRef = useRef(null);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start end", "end start"],
  });

  const clampedProgress = useTransform(scrollYProgress, (val) =>
    val < 0.2 ? 0 : (val - 0.2) / (1 - 0.2)
  );

  const opacity = useTransform(clampedProgress, [0.3, 1], [1, 0.3]);
  const scale = useTransform(clampedProgress, [0, 1], [1, 0.92]);
  const y = useTransform(clampedProgress, [0, 1], [0, 40]);

  const [isOpen, setIsOpen] = useState(false);
  const [modalMounted, setModalMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const buttonRef = useRef(null);
  const videoRef = useRef(null);

  const [buttonRect, setButtonRect] = useState(null);

  const openModal = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    setButtonRect(rect);
    setModalMounted(true);
    setIsOpen(true);
  };

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setIsOpen(false);

    setTimeout(() => {
      setModalMounted(false);
    }, 450);
  };

  const togglePlayPause = () => {
  if (!videoRef.current) return;

  if (videoRef.current.paused) {
    videoRef.current.play();
  } else {
    videoRef.current.pause();
  }
};

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(path));
    } else {
      navigate(path);
    }
  }

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [modalMounted]);


  return (
    <>
      <section
        className="header relative isolate w-full min-h-[95vh] overflow-hidden bg-[#FAF9F6] flex items-center justify-center px-6 py-20
        "
      >
        <BlobsCircle/>
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #FCFBF8 0%, #F5F3EE 100%)",
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "radial-gradient(#B9BAC3 0.9px, transparent 0.9px)",
              backgroundSize: "22px 22px",
            }}
          />
        </div>

        {/* Content */}
        <motion.div
          ref={contentRef}
          style={{ opacity, scale, y }}
          className="relative z-10 flex flex-col items-center justify-center text-center max-w-full md:max-w-[1100px] mx-auto
          "
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            
            className="mb-8 px-5 py-2 rounded-full border border-[#5CC781] backdrop-blur-md text-[12px] md:text-[12px] uppercase text-[#5CC781] bg-[#5CC781]/10 font-semibold
            "
          >
            ● más de 25,000 piezas de contenido
          </motion.div>

          {/* Title */}
          <h1
            className="w-full text-center leading-[1.1em] text-[#100A0D] text-[3.2rem] sm:text-[3.2rem] md:text-[4.8rem] lg:text-[5.2rem] xl:text-[5.8rem] max-w-full md:max-w-[1250px] font-te
            "
          >
            <span className="block">
              Conecta los{" "}
              <span className="text-[#1941CF]">puntos,</span>
            </span>

            <span className="block">
              forma tu{" "}
              <span className="font-te-it font-light text-[#100A0D]">historia</span>
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.5,
            }}
            className="mt-5 max-w-full md:max-w-[760px] text-center text-[#6B6560] text-[1rem] md:text-[1.3rem] leading-[1.3em] font-light
            "
          >
            Explora, aprende, crece y conecta con las mejores certificaciones del mundo. edX, Coursera y MasterClass en un solo lugar.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.8,
            }}
            className="flex flex-row justify-center gap-2 md:gap-4 mt-8 w-full"
          >
            <button
              type="button"
              /*onClick={() => navigateWithTransition("/empieza-ahora")} */
              className=" bg-[#0F090B] hover:bg-black text-white flex items-center gap-2 px-4 py-2 md:px-8 md:py-4 rounded-full text-[15px] font-medium transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.08)]
              "
            >
              Empieza ahora
              <ArrowRight
                size={20}
                strokeWidth={2}
                className="translate-y-[1px]"
              />
            </button>

            <button
              ref={buttonRef}
              type="button"
              onClick={openModal}
              className="border border-[#DDDDDD] bg-white/70 backdrop-blur-md hover:bg-white text-[#0F090B] px-4 py-2 md:px-8 md:py-4 rounded-full text-[15px] font-medium transition-all duration-300"
            >
              ¿Qué es top.education?
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              delay: 1.1,
            }}
            className="mt-12 grid grid-cols-3 gap-8 md:gap-15
            "
          >
            <div className="text-center">
              <h3
                className="text-[#0F090B] text-[1.2rem] md:text-[2rem] font-semibold !font-[Montserrat]
                "
              >
                +2,400
              </h3>

              <p
                className="text-[#6B6560] leading-[1.2em] text-[0.6rem] md:text-[0.9rem] mt-0
                "
              >
                Especializaciones
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-[#0F090B] text-[1.2rem] md:text-[2rem] font-semibold !font-[Montserrat]">
                +21,000
              </h3>

              <p className=" text-[#6B6560] leading-[1.2em] text-[0.6rem] md:text-[0.9rem] mt-0" >
                Certificaciones
              </p>
            </div>

            <div className="text-center">
              <h3 className=" text-[#0F090B] text-[1.2rem] md:text-[2rem] font-semibold !font-[Montserrat]" >
                4.8
              </h3>

              <p className="text-[#6B6560] leading-[1.2em] text-[0.6rem] md:text-[0.9rem] mt-0" >
                Calificación promedio
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Modal */}
        {modalMounted && (
          <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className="modal"
            overlayClassName="overlay"
            closeTimeoutMS={400}
            ariaHideApp={false}
            shouldCloseOnOverlayClick
          >
            <AnimatePresence mode="wait">
              {isOpen && buttonRect && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.2,
                    x:
                      buttonRect.left +
                      buttonRect.width / 2 -
                      window.innerWidth / 2,
                    y:
                      buttonRect.top +
                      buttonRect.height / 2 -
                      window.innerHeight / 2,
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
                    x:
                      buttonRect.left +
                      buttonRect.width / 2 -
                      window.innerWidth / 2,
                    y:
                      buttonRect.top +
                      buttonRect.height / 2 -
                      window.innerHeight / 2,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: "easeInOut",
                  }}
                  onAnimationComplete={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;

                      videoRef.current
                        .play()
                        .then(() => setIsPlaying(true))
                        .catch(console.error);
                    }
                  }}
                  className="modal-inner-content rounded-[32px] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={closeModal}
                    className="absolute top-5 right-5 z-[5] w-10 h-10 rounded-full bg-black text-white"
                  >
                    ×
                  </button>

                  <div className="video-container">
                    <video
                      ref={videoRef}
                      src="/assets/video/main-video.mp4"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ReactModal>
        )}
      </section>
    </>
  );
};

export default FinisherHeaderComponent;