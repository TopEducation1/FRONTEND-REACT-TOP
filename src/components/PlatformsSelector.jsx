import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const platformStyles = [
  {
    bg: "bg-[#00383A]",
    text: "text-white",
    muted: "text-white/65",
  },
  {
    bg: "bg-[#075BDD]",
    text: "text-white",
    muted: "text-white/70",
  },
  {
    bg: "bg-[#1A1A1A]",
    text: "text-white",
    muted: "text-white/55",
  },
];

const PlatformsSelector = ({ platforms = [] }) => {
  const navigate = useNavigate();

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(path));
    } else {
      navigate(path);
    }
  }

  const handleItemMenuClick = (tagsObject) => {
    const queryParams = new URLSearchParams();

    for (const [cat, tag] of Object.entries(tagsObject || {})) {
      if (tag) queryParams.append(cat, tag);
    }

    navigateWithTransition(`/explora/filter?${queryParams.toString()}`);
  };

  const customCounts = {
    EdX: 2700,
    Coursera: 21200,
    MasterClass: 380,
  };

  return (
    <section className="relative w-full h-full min-h-[100vh] overflow-hidden bg-[#0F090B] py-20 lg:py-24 flex items-center">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,rgba(87,80,255,0.12),transparent_28%),radial-gradient(circle_at_85%_40%,rgba(92,199,129,0.10),transparent_30%)]" />

      <div className="relative z-10 mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,60%)_minmax(580px,40%)] gap-14 lg:gap-10 items-center">
        <div className="w-full">
          <h2 className="text-[#F6F4EF] !font-[Montserrat] text-[2.4rem] md:text-[2rem] lg:text-[2.5rem] leading-[1.2] font-light tracking-[-0.04em]">
            Forma equipos que
            <span
              className="block text-[#5CC781] font-light text-[2.8rem] md:text-[3rem] lg:text-[4.8rem] font-te-it"
            >
              aprenden
              <span className="not-italic text-[#F6F4EF]">
                {" "}
                y crecen
              </span>
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-[#D6D0D2]/85 text-[1.1rem] md:text-[1.25rem] leading-[1.2em]">
            Potencia las habilidades de tu equipo con certificaciones clave y
            seguimiento en tiempo real.
          </p>

          <Link
            to="/para-equipos"
            className="inline-flex gap-3 mt-5 items-center justify-center rounded-full bg-[#2563EB] hover:bg-[#463FE8] text-white font-bold px-8 py-4 shadow-[0_18px_45px_rgba(87,80,255,0.35)] transition-all duration-300"
          >
            Conoce top.education para equipos
            <ArrowRight
              size={20}
              strokeWidth={2}
              className="translate-y-[1px]"
            />
          </Link>
        </div>

        <div className="relative w-full">
          <div className="flex flex-col gap-5">
            {platforms.slice(0, 3).map((platform, index) => {
              const style = platformStyles[index] || platformStyles[2];

              return (
                <motion.button
                  key={platform.id || platform.name || index}
                  type="button"
                  initial={{ opacity: 0, x: 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                    delay: index * 0.08,
                  }}
                  onClick={() =>
                    handleItemMenuClick({
                      [platform.type || "Plataforma"]: platform.name,
                    })
                  }
                  className={`
                    group w-full min-h-[104px] rounded-[22px]
                    ${style.bg}
                    px-7 py-5 flex items-center justify-between
                    shadow-[0_18px_60px_rgba(0,0,0,0.22)]
                    hover:scale-[1.015] transition-all duration-300
                  `}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {platform.img ? (
                        <img
                          src={platform.img}
                          alt={platform.name}
                          className="w-[82%] h-[82%] object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="!font-['Montserrat'] text-white font-bold">
                          {platform.name?.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="text-left">
                      <h3 className={`!font-['Montserrat'] font-bold text-[1.15rem] ${style.text}`}>
                        {platform.name}
                      </h3>

                      <p className={`text-sm ${style.muted}`}>+
                        {(
                          customCounts[platform.name] ??
                          platform.count ??
                          platform.total
                        )?.toLocaleString("es-CO") || "Próximamente"}{" "}
                        Certificaciones
                      </p>
                    </div>
                  </div>

                  <span className="text-white/55 text-2xl transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight
                      size={20}
                      strokeWidth={2}
                      className="translate-y-[1px]"
                    />
                  </span>
                </motion.button>
              );
            })}
          </div>

          <p className="mt-7 text-center text-[#A8A0A4] text-sm">
            Y más plataformas en camino
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlatformsSelector;