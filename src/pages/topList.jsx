import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlurText from "../components/BlurText";

import endpoints from '../config/api';

const TopList = () => {
  const { tipo } = useParams(); // ← esto capturará 'universidades' o 'empresas'
  const [selectedTags, setSelectedTags] = useState({});
  const [entidades, setEntidades] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    let url = "";

    if (tipo === "universidades") {
      url = endpoints.universities;
    } else if (tipo === "empresas") {
      url = endpoints.empresas;
    } else {
      return; // tipo no válido
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const habilitados = data.filter(ent => {
          if (tipo === "universidades") return ent.univ_est === "enabled";
          if (tipo === "empresas") return ent.empr_est === "enabled";
          return false;
        });

        // Ordenar por univ_top o empr_top
        const ordenados = habilitados.sort((a, b) => {
          const campoOrden = tipo === "universidades" ? "univ_top" : "empr_top";
          return (a[campoOrden] || Infinity) - (b[campoOrden] || Infinity);
        });

        setEntidades(ordenados);
      });
  }, [tipo]);

  function navigateWithTransition(path, options = {}) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(path, options);
      });
    } else {
      navigate(path, options);
    }
  }

  const handleItemMenuClick = (tagsObject) => {
    setSelectedTags((prevTags) => {
      const updatedTags = { ...prevTags };
      for (const [category, tag] of Object.entries(tagsObject)) {
        if (!updatedTags[category]) {
          updatedTags[category] = [tag];
        } else if (!updatedTags[category].includes(tag)) {
          updatedTags[category].push(tag);
        }
      }
      const queryParams = new URLSearchParams();
      for (const [cat, tags] of Object.entries(updatedTags)) {
        tags.forEach((tag) => queryParams.append(cat, tag));
      }
      navigateWithTransition(`/explora/filter?${queryParams.toString()}`, {
        replace: true,
        state: { selectedTags: updatedTags },
      });
      return updatedTags;
    });
  };

  const getTitulo = () => {
    if (tipo === "universidades") return "Universidades";
    if (tipo === "empresas") return "Empresas";
    return "Top Entidades";
  };

  const tipoSingularCapitalizado = tipo === "universidades" ? "Universidad" : "Empresa";

  const destacados = entidades.slice(0, 4);
  const resto = entidades.slice(4);

  return (
    <section className="relative overflow-hidden bg-[#F8F7F4] px-4 py-16 md:py-24">
      {/* Glow backgrounds */}
      <div className="pointer-events-none absolute left-[-180px] top-10 h-[420px] w-[420px] rounded-full bg-[#5CC781]/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-180px] top-40 h-[420px] w-[420px] rounded-full bg-[#034694]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="mb-5 inline-flex rounded-full border border-black/10 bg-white px-5 py-2 font-['Montserrat'] text-[12px] font-bold uppercase tracking-[0.14em] text-[#1941cf] shadow-sm">
            Rankings top.education
          </span>

          <h1 className="font-['Montserrat'] text-[2.5rem] font-bold leading-[1em] tracking-[-0.06em] text-[#111111] md:text-[5rem]">
            Lo más{" "}
            <span className="font-['Playfair_Display','Lora','Georgia','serif'] font-te-it">
              top
            </span>{" "}
            de
          </h1>

          <div className="mt-2 flex justify-center">
            <BlurText
              text={getTitulo()}
              delay={120}
              animateBy="words"
              direction="top"
              className="font-['Playfair_Display','Lora','Georgia','serif'] text-[3rem] font-te-it leading-[1em] tracking-[-0.05em] text-[#1941cf] md:text-[5.5rem]"
            />
          </div>
        </div>

        {/* Cards destacadas */}
        {destacados.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {destacados.map((ent, index) => {
              const themes = [
                {
                  bg: "#5CC781",
                  glow: "rgba(92,199,129,0.22)",
                },
                {
                  bg: "#D33B3E",
                  glow: "rgba(211,59,62,0.22)",
                },
                {
                  bg: "#034694",
                  glow: "rgba(3,70,148,0.22)",
                },
              ];

              const theme = themes[index % themes.length];

              return (
                <button
                  key={ent.id}
                  type="button"
                  onClick={() =>
                    handleItemMenuClick({
                      [tipoSingularCapitalizado]: ent.nombre,
                    })
                  }
                  className="
                    group
                    relative
                    min-h-[240px]
                    overflow-hidden
                    rounded-[28px]
                    p-8
                    text-left
                    transition-all
                    duration-500
                    hover:-translate-y-2
                  "
                  style={{
                    background: `
                      linear-gradient(
                        135deg,
                        rgba(0,0,0,0.42) 0%,
                        rgba(0,0,0,0.12) 32%,
                        transparent 100%
                      ),
                      ${theme.bg}
                    `,
                    boxShadow: `0 30px 80px ${theme.glow}`,
                  }}
                >
                  {/* overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_80%,rgba(255,255,255,0.12),transparent_26%)]" />

                  {/* stars */}
                  <div className="relative z-10 mb-6 flex gap-1 text-white/90">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-[15px]">
                        ★
                      </span>
                    ))}
                  </div>

                  {/* title */}
                  <div className="relative z-10">
                    <span className="block font-['Montserrat'] text-[1rem] font-bold uppercase tracking-[-0.03em] text-white">
                      Top 50
                    </span>

                    <h2 className="mt-1 max-w-[70%] font-['Playfair_Display','Lora','Georgia','serif'] text-[2.7rem] font-te-it leading-[0.95em] tracking-[-0.05em] text-white md:text-[3.4rem]">
                      {ent.nombre}
                    </h2>

                    <p className="mt-5 font-['Montserrat'] text-[1rem] font-medium text-white/85">
                      por top.education
                    </p>
                  </div>

                  {/* image */}
                  {(ent.univ_img || ent.empr_img) && (
                    <img
                      src={ent.univ_img || ent.empr_img}
                      alt={ent.nombre}
                      className="
                        absolute
                        bottom-0
                        right-0
                        h-[72%]
                        w-auto
                        object-contain
                        opacity-80
                        transition-all
                        duration-500
                        group-hover:scale-105
                        group-hover:translate-y-[-4px]
                      "
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Listado restante */}
        {resto.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {resto.map((ent) => (
              <button
                key={ent.id}
                type="button"
                onClick={() =>
                  handleItemMenuClick({
                    [tipoSingularCapitalizado]: ent.nombre,
                  })
                }
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-[24px]
                  border
                  border-black/10
                  bg-white
                  p-4
                  text-left
                  shadow-[0_10px_40px_rgba(0,0,0,0.04)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-black/15
                  hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)]
                "
              >
                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-[#F5F3EE]">
                  <img
                    src={ent.univ_ico || ent.empr_ico}
                    className="h-[58px] w-[58px] object-contain transition-transform duration-300 group-hover:scale-105"
                    alt={ent.nombre}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 font-['Montserrat'] text-[1rem] font-bold leading-[1.2em] tracking-[-0.03em] text-[#111111]">
                    {ent.nombre}
                  </h3>

                  <div className="mt-3 inline-flex rounded-full bg-[#F3F1EC] px-3 py-1 font-['Montserrat'] text-[11px] font-bold uppercase tracking-[0.04em] text-[#1941cf]">
                    {ent.total_certificaciones} certificaciones
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopList;
