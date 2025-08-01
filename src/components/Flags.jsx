import { useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import TagCanvas from "tag-canvas";

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
        outlineColour: "#ffffff",
        reverse: true,
        depth: 0.8,
        activeCursor: "pointer" ,
        maxSpeed: 0.05,
        imageScale: 1,
        imageMode: "image",
        fadeIn: 300,
        outlineColour: "#ffff99",
        shuffleTags: true,
        wheelZoom: false,
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
    <section className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="w-full lg:w-1/2 pr-15">
          <h2 className="text-[#F6F4EF] text-[4rem] leading-[1.2em] font-[Lora] text-left">
            Certifícate con los líderes <br />
            <span className="text-[3.8rem] flex mt-[-3px] top-italic leading-[1em] text-[#a8a8a8]">
              de la industria a nivel mundial!
            </span>
          </h2>
        </div>

        <div className="w-full lg:w-1/2 relative">
          <canvas
            ref={canvasRef}
            width="600"
            height="600"
            id="flagsCanvas"
            className="block rounded-full bg-[#F6F4EF] shadow-[0px_0px_50px_25px_#F6F4EF] cursor-pointer"
          ></canvas>

          {/* Contenedor oculto con las imágenes para TagCanvas */}
          <div className="hidden">
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
