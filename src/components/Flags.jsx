import { useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import TagCanvas from "tag-canvas";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Importaciones necesarias
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

// Importa Navigation desde el path correcto
import { Navigation } from "swiper/modules";

const Flags = ({ logos = [] }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(path);
      });
    } else {
      navigate(path);
    }
  }

  const handleItemMenuClick = (category, tag) => {
    const initialTags = { [category]: [tag] };
    const queryParams = new URLSearchParams({
      page: 1,
      page_size: 15,
      [category]: tag,
    }).toString();

    navigateWithTransition(`/explora/filter?${queryParams}`, {
      replace: true,
      state: { selectedTags: initialTags },
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    try {
      TagCanvas.Start("flagsCanvas", "flagsTags", {
        textColour: null,
        reverse: false,
        activeCursor: "pointer" ,
        maxSpeed: 0.05,
        imageScale: 0.7,
        imageMode: "image",
        fadeIn: 300,
        outlineColour: "#0F090B",
        shuffleTags: true,
        wheelZoom: false,
        bgRadius: 0,
        pinchZoom: true,
        freezeActive: true,
        dragControl: true,
        clickToFront: null,
      });

      const handleCanvasClick = () => {
        const tagCanvas = TagCanvas.tc["flagsCanvas"];
        const active = tagCanvas?.active;

        if (active && logos[active.index]) {
          const logo = logos[active.index];
          handleItemMenuClick("Empresa", logo.nombre);
        }
      };

      canvas.addEventListener("click", handleCanvasClick);

      return () => {
        canvas.removeEventListener("click", handleCanvasClick);
      };
    } catch (e) {
      console.error("TagCanvas error:", e);
    }
  }, [logos]);

  return (
    <section className="relative w-screen h-[100vh] bg-[#0F090B] lg:bg-transparent flex flex-col items-center  justify-center px-5" >
      <div className="flex flex-col lg:flex-row items-center container m-auto justify-between">
        <div className="w-full lg:w-1/2 pr-0 lg:pr-25">
          <h2 className="text-[2.2rem] leading-[1.2em] font-[Lora] text-left text-[#a8a8a8]">
            <span className="text-[5rem] lg:text-[8rem] top-italic text-[#F6F4EF] block mb-[20px] lg:mb-[40px]">Certifícate</span> <span className="text-[1.6rem] ">con líderes de la industria</span> 
            <span className="text-[3.5rem] lg:text-[6rem] flex top-italic leading-[1em] text-[#F6F4EF] ">a nivel mundial!</span>
          </h2>
        </div>

        <div className="w-full lg:w-1/2 relative">
          <div className="block md:hidden">
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.boton-next',
                prevEl: '.boton-prev',
              }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              spaceBetween={10}
              slidesPerView={1} // solo un slide a la vez
              grabCursor={true}
              className="py-2"
            >
              {Array.from({ length: Math.ceil(logos.length / 4) }, (_, index) => {
                const chunk = logos.slice(index * 4, index * 4 + 4); // grupos de 4
                return (
                  <SwiperSlide key={index}>
                    <div className="grid grid-cols-2 gap-2">
                      {chunk.map((logo, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center gap-2 rounded-xl bg-[#F6F4EF] p-2"
                          onClick={() => handleItemMenuClick("Empresa", logo.nombre)}
                        >
                          <img
                            src={logo.empr_img}
                            alt={logo.nombre}
                            width={125}
                            height={64}
                            style={{
                              objectFit: "contain",
                              padding: 2,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            {/* Botones fuera del slider */}
            <div className="flex justify-between mt-4 mx-3">
              <button className="boton-prev bg-[#F6F4EF] hover:bg-[#F6F4EF]/70 text-[#0F090B] text-[1.8rem] lg:text-[2rem] px-4 py-1 lg:py-2 rounded-full"><FaChevronLeft /></button>
              <button className="boton-next bg-[#F6F4EF] hover:bg-[#F6F4EF]/70 text-[#0F090B] text-[1.8rem] lg:text-[2rem] px-4 py-1 lg:py-2 rounded-full"><FaChevronRight /></button>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            width="550"
            height="550"
            id="flagsCanvas"
            className="hidden md:block border border-[#F6F4EF]/75 rounded-full bg-[#F6F4EF]/85 shadow-[0px_0px_10px_15px_#F6F4EF]/85 cursor-pointer"
          ></canvas>

          {/* Contenedor oculto con las imágenes para TagCanvas */}
          <div className="hidden ">
            <div id="flagsTags">
              {logos.map((logo, i) => (
                <a key={i} href="#" onClick={() =>handleItemMenuClick("Empresa", logo.nombre)}>
                  <img
                    src={logo.empr_img}
                    alt={logo.nombre}
                    width={125}
                    height={64}
                    style={{
                      borderRadius: "50%",
                      objectFit: "contain",
                      padding: 3,
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Flags;
