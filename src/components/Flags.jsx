import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TagCanvas from "tag-canvas";
import { ArrowRight } from "lucide-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const Flags = ({ logos = [] }) => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [loadedLogos, setLoadedLogos] = useState([]);

  const getLogoImage = (logo) =>
    logo?.empr_img || logo?.empr_ico || logo?.img || logo?.image || "";

  useEffect(() => {
    let mounted = true;

    const validateImages = async () => {
      const results = await Promise.all(
        logos.map(
          (logo) =>
            new Promise((resolve) => {
              const imgSrc = getLogoImage(logo);

              if (
                !imgSrc ||
                typeof imgSrc !== "string" ||
                imgSrc.trim() === "" ||
                imgSrc === "null" ||
                imgSrc === "undefined"
              ) {
                resolve(null);
                return;
              }

              const img = new Image();

              img.onload = () => {
                if (img.naturalWidth <= 2 || img.naturalHeight <= 2) {
                  resolve(null);
                  return;
                }

                resolve({
                  ...logo,
                  validImage: imgSrc,
                });
              };

              img.onerror = () => resolve(null);
              img.src = imgSrc;
            })
        )
      );

      if (mounted) setLoadedLogos(results.filter(Boolean));
    };

    validateImages();

    return () => {
      mounted = false;
    };
  }, [logos]);

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(path));
    } else {
      navigate(path);
    }
  }

  const getEmpresaPath = (logo) => {
    const queryParams = new URLSearchParams({
      page: "1",
      page_size: "15",
    });

    if (logo?.id) {
      queryParams.set("empresa_id", String(logo.id));
    } else {
      queryParams.set("Empresa", logo?.nombre || "");
    }

    return `/explora/filter?idioma=en&idioma=es&${queryParams.toString()}`;
  };

  const handleItemMenuClick = (logo) => {
    navigateWithTransition(getEmpresaPath(logo));
  };
  const loadedLogosRef = useRef([]);

  useEffect(() => {
    loadedLogosRef.current = loadedLogos;
  }, [loadedLogos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedLogos.length) return;

    try {
      if (TagCanvas.tc?.flagsCanvas) {
        TagCanvas.Delete("flagsCanvas");
      }

      TagCanvas.Start("flagsCanvas", "flagsTags", {
        textColour: null,
        reverse: false,
        activeCursor: "pointer",
        maxSpeed: 0.01,
        minSpeed: 0.01,
        decel: 1,
        initial: [0.2, -0.1],
        imageScale: 0.7,
        imageMode: "image",
        fadeIn: 300,
        outlineColour: "#0F090B",
        shuffleTags: true,
        wheelZoom: false,
        tooltipDelay: 300,
        bgRadius: 0,
        pinchZoom: true,
        freezeActive: true,
        freezeDecel: true,
        dragControl: true,
        clickToFront: null,
      });

      const handleCanvasClick = () => {
        const tagCanvas = TagCanvas.tc?.flagsCanvas;
        const active = tagCanvas?.active;

        const route =
          active?.a?.dataset?.route ||
          active?.a?.getAttribute?.("data-route");

        if (route) {
          navigateWithTransition(route);
          return;
        }

        const index = active?.index;

        if (index !== undefined && loadedLogosRef.current[index]) {
          handleItemMenuClick(loadedLogosRef.current[index]);
        }
      };

      canvas.addEventListener("click", handleCanvasClick);

      return () => {
        canvas.removeEventListener("click", handleCanvasClick);

        try {
          if (TagCanvas.tc?.flagsCanvas) {
            TagCanvas.Delete("flagsCanvas");
          }
        } catch {}
      };
    } catch (e) {
      console.error("TagCanvas error:", e);
    }
  }, [loadedLogos]);

  return (
    <section className="relative w-screen min-h-[100vh] bg-[#10090C] lg:bg-transparent flex flex-col items-center justify-center px-5 py-20">
      <div className="flex flex-col lg:flex-row items-center container m-auto justify-between gap-12">
        <div className="w-full lg:w-1/2 pr-0 lg:pr-25">
          <h2 className="text-left font-[Lora] text-[#F5F3EE] leading-[0.95em]">
            <span className="block text-[4.8rem] lg:text-[6rem] font-te-it">
              Certifícate
            </span>

            <span className="block text-[1.8rem] lg:text-[2rem] text-[#F5F3EE] leading-[1.5em] mt-10">
              con líderes de la industria
            </span>

            <span className="block text-[3.2rem] lg:text-[4.8rem] text-[#5CC781] font-te-it leading-[0.95em] mt-2">
              a nivel mundial
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-[#D6D0D2]/85 text-[1.05rem] lg:text-[1.2rem] leading-[1.2em]">
            Accede a certificaciones de MIT, Harvard, Stanford, Google Cloud,
            AWS, IBM y más de 200 instituciones líderes.
          </p>

          <Link
            to="/explora"
            className="inline-flex gap-3 mt-5 items-center justify-center rounded-full bg-[#2563EB] hover:bg-[#463FE8] text-white font-bold px-8 py-4 shadow-[0_18px_45px_rgba(87,80,255,0.35)] transition-all duration-300"
          >
            Explorar certificaciones
            <ArrowRight size={20} strokeWidth={2} className="translate-y-[1px]" />
          </Link>
        </div>

        <div className="w-full lg:w-1/2 relative flags-no-swiping swiper-no-swiping">
          <div className="block md:hidden">
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: ".boton-next",
                prevEl: ".boton-prev",
              }}
              spaceBetween={10}
              slidesPerView={1}
              grabCursor
              className="py-2"
            >
              {Array.from(
                { length: Math.ceil(loadedLogos.length / 4) },
                (_, index) => {
                  const chunk = loadedLogos.slice(index * 4, index * 4 + 4);

                  return (
                    <SwiperSlide key={index}>
                      <div className="grid grid-cols-2 gap-2">
                        {chunk.map((logo, i) => {
                          const img = logo.validImage || getLogoImage(logo);

                          return (
                            <button
                              key={logo.id || `${logo.nombre}-${i}`}
                              type="button"
                              className="flex items-center justify-center gap-2 rounded-xl bg-white p-4 min-h-[105px] shadow-sm"
                              onClick={() => handleItemMenuClick(logo)}
                            >
                              <img
                                src={img}
                                alt={logo.nombre}
                                width={125}
                                height={64}
                                className="max-w-[125px] max-h-[64px] object-contain mix-blend-multiply"
                                loading="lazy"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </SwiperSlide>
                  );
                }
              )}
            </Swiper>

            <div className="flex justify-center gap-4 mt-5">
              <button className="boton-prev bg-[#0F090B] hover:bg-[#0F090B]/70 text-white text-[1.3rem] px-4 py-3 rounded-full">
                <FaChevronLeft />
              </button>

              <button className="boton-next bg-[#0F090B] hover:bg-[#0F090B]/70 text-white text-[1.3rem] px-4 py-3 rounded-full">
                <FaChevronRight />
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width="550"
            height="550"
            id="flagsCanvas"
            className="flags-no-swiping swiper-no-swiping hidden md:block border border-[#F6F4EF]/75 rounded-full bg-[#F6F4EF]/85 shadow-[0px_0px_10px_15px_#F6F4EF]/85 cursor-pointer"
          />

          <div className="hidden">
            <div id="flagsTags">
              {loadedLogos.map((logo, i) => {
                const img = logo.validImage || getLogoImage(logo);

                return (
                  <a
                    key={logo.id || `${logo.nombre}-${i}`}
                    href={getEmpresaPath(logo)}
                    data-route={getEmpresaPath(logo)}
                    data-logo-index={i}
                    onClick={(e) => {
                      e.preventDefault();
                      handleItemMenuClick(logo);
                    }}
                  >
                    <img
                      src={img}
                      alt={logo.nombre}
                      width={125}
                      height={64}
                      style={{
                        objectFit: "contain",
                        padding: 0,
                        borderRadius: 0,
                        background: "transparent",
                        mixBlendMode: "multiply",
                      }}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Flags;