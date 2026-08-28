// src/components/.../ResourcesGrid.jsx

import React from "react";

const resources = [
  {
    type: "Guía",
    color: "bg-[#5CC781]",
    title: "Cómo encontrar trabajo con poca experiencia",
    link: "https://info.top.education/como-encontrar-trabajo-con-poca-experiencia",
    image:
      "/assets/content/resources/Guia-Como-encontrar trabajo-con-poca-experiencia.webp",
  },
  {
    type: "eBook",
    color: "bg-[#1941cf]",
    title: "Construye tu marca personal con éxito",
    link: "https://info.top.education/ebook-construye-tu-marca-personal-con-exito",
    image:
      "/assets/content/resources/eBook-Construye-tu-marca-personal-con-exito.webp",
  },
  {
    type: "eBook",
    color: "bg-[#1941cf]",
    title: "Crea tu ruta de aprendizaje virtual personalizada",
    link: "https://info.top.education/ebook-crea-tu-ruta-de-aprendizaje-virtual-personalizada",
    image:
      "/assets/content/resources/eBook-Crea-tu-ruta-de-aprendizaje-virtual-personalizada.webp",
  },
  {
    type: "eBook",
    color: "bg-[#1941cf]",
    title: "Estrategias para aprender online",
    link: "https://info.top.education/estrategias-para-aprender-online",
    image:
      "/assets/content/resources/eBook-Estrategias-para-aprender-online.webp",
  },
  {
    type: "Paper",
    color: "bg-[#034694]",
    title: "Capacitación empresarial del futuro",
    link: "https://info.top.education/capacitacion-empresarial-del-futuro-e-learning",
    image:
      "/assets/content/resources/eBook-Capacitacion-empresarial-del futuro.webp",
  },
  {
    type: "Guía",
    color: "bg-[#5CC781]",
    title: "Cómo elegir tu próxima certificación",
    link: "https://info.top.education/certificaciones",
    image:
      "/assets/content/resources/guia-5-pasos-para-elegir-tu-proxima-certificacion.png",
  },
];

const ResourcesGrid = ({ limit = 4 }) => {
  const visibleResources = resources.slice(0, limit);

  const handleResourceClick = (link) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <ul className="flex flex-col gap-2">
      {visibleResources.map((resource, index) => (
        <li key={`${resource.type}-${index}`}>
          <button
            type="button"
            onClick={() => handleResourceClick(resource.link)}
            className="
              group
              flex
              w-full
              items-center
              gap-3
              rounded-[18px]
              border
              border-black/10
              bg-white
              p-2
              text-left
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-black/15
              hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)]
            "
          >
            <div
              className="
                h-[64px]
                w-[74px]
                shrink-0
                overflow-hidden
                rounded-[14px]
                bg-neutral-100
              "
            >
              <img
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-110
                "
                src={resource.image}
                alt={resource.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    "/assets/Piezas/demo-blog.png";
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <span
                className={`
                  mb-1
                  inline-flex
                  rounded-full
                  px-2.5
                  py-0.5
                  font-['Montserrat']
                  text-[10px]
                  font-bold
                  tracking-[0.04em]
                  text-white
                  ${resource.color}
                `}
              >
                {resource.type}
              </span>

              <h6
                className="
                  line-clamp-2
                  font-['Montserrat']
                  text-[13px]
                  font-bold
                  leading-[1.25em]
                  tracking-[-0.02em]
                  text-[#111111]
                  transition-colors
                  duration-300
                  group-hover:text-[#1941cf]
                "
              >
                {resource.title}
              </h6>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ResourcesGrid;