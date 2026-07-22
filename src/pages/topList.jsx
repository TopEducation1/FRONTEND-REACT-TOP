import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlurText from "../components/BlurText";
import Seo from "../components/Seo";

import endpoints from "../config/api";

const TopList = () => {
  const { tipo } = useParams();
  const navigate = useNavigate();

  const [selectedTags, setSelectedTags] = useState({});
  const [entidades, setEntidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isUniversidades = tipo === "universidades";
  const isEmpresas = tipo === "empresas";
  const tipoValido = isUniversidades || isEmpresas;

  useEffect(() => {
    if (!tipoValido) {
      navigate("/lo-mas-top", { replace: true });
    }
  }, [tipoValido, navigate]);

  useEffect(() => {
    if (!tipoValido) return undefined;

    const controller = new AbortController();

    const fetchEntidades = async () => {
      try {
        setLoading(true);
        setError(null);
        setEntidades([]);

        const url = isUniversidades
          ? endpoints.universities
          : endpoints.empresas;

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();
        const listado = Array.isArray(data) ? data : [];

        const habilitados = listado.filter((entidad) =>
          isUniversidades
            ? entidad.univ_est === "enabled"
            : entidad.empr_est === "enabled"
        );

        const campoOrden = isUniversidades ? "univ_top" : "empr_top";

        const ordenados = [...habilitados].sort((a, b) => {
          const posicionA = Number(a?.[campoOrden]);
          const posicionB = Number(b?.[campoOrden]);

          const valorA =
            Number.isFinite(posicionA) && posicionA > 0
              ? posicionA
              : Number.POSITIVE_INFINITY;

          const valorB =
            Number.isFinite(posicionB) && posicionB > 0
              ? posicionB
              : Number.POSITIVE_INFINITY;

          return valorA - valorB;
        });

        setEntidades(ordenados);
      } catch (fetchError) {
        if (fetchError?.name === "AbortError") return;

        console.error("Error cargando entidades:", fetchError);
        setError("No se pudo cargar el listado en este momento.");
        setEntidades([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchEntidades();

    return () => controller.abort();
  }, [tipoValido, isUniversidades]);

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
        if (!category || !tag) continue;

        if (!updatedTags[category]) {
          updatedTags[category] = [tag];
        } else if (!updatedTags[category].includes(tag)) {
          updatedTags[category] = [...updatedTags[category], tag];
        }
      }

      const queryParams = new URLSearchParams();

      for (const [category, tags] of Object.entries(updatedTags)) {
        tags.forEach((tag) => queryParams.append(category, tag));
      }

      queryParams.set("page", "1");
      queryParams.set("page_size", "16");

      navigateWithTransition(`/explora/filter?${queryParams.toString()}`, {
        replace: true,
        state: { selectedTags: updatedTags },
      });

      return updatedTags;
    });
  };

  const getTitulo = () => {
    if (isUniversidades) return "Universidades";
    if (isEmpresas) return "Empresas";
    return "Top Entidades";
  };

  const seoTitle = isUniversidades
    ? "Mejores universidades y certificaciones"
    : isEmpresas
      ? "Mejores empresas y certificaciones"
      : "Rankings de universidades y empresas";

  const seoDescription = isUniversidades
    ? "Explora las universidades destacadas en Top Education y descubre las certificaciones, cursos y oportunidades de aprendizaje disponibles en cada institución."
    : isEmpresas
      ? "Explora las empresas destacadas en Top Education y descubre sus certificaciones, programas y oportunidades de formación profesional."
      : "Explora los rankings de universidades y empresas destacados por Top Education.";

  const canonicalPath = tipoValido
    ? `/lo-mas-top/${tipo}`
    : "/lo-mas-top";

  const tipoSingularCapitalizado = isUniversidades
    ? "Universidad"
    : isEmpresas
      ? "Empresa"
      : "";

  const destacados = entidades.slice(0, 4);
  const resto = entidades.slice(4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isUniversidades
      ? "Universidades destacadas en Top Education"
      : "Empresas destacadas en Top Education",
    description: seoDescription,
    numberOfItems: entidades.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: entidades.slice(0, 50).map((entidad, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entidad.nombre,
    })),
  };

  if (!tipoValido) {
    return null;
  }

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        canonicalPath={canonicalPath}
        jsonLd={jsonLd}
      />

      <section className="relative min-h-screen overflow-hidden bg-[#F8F7F4] px-4 py-16 md:py-24">
        <div className="pointer-events-none absolute left-[-180px] top-10 h-[420px] w-[420px] rounded-full bg-[#5CC781]/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-180px] top-40 h-[420px] w-[420px] rounded-full bg-[#034694]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[1280px]">
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

          {loading && (
            <>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`featured-skeleton-${index}`}
                    className="min-h-[240px] animate-pulse rounded-[28px] bg-neutral-200"
                  />
                ))}
              </div>

              <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={`list-skeleton-${index}`}
                    className="flex animate-pulse items-center gap-4 rounded-[24px] border border-black/10 bg-white p-4"
                  >
                    <div className="h-[72px] w-[72px] shrink-0 rounded-[18px] bg-neutral-200" />

                    <div className="flex-1">
                      <div className="h-4 w-[70%] rounded-full bg-neutral-200" />
                      <div className="mt-3 h-5 w-[120px] rounded-full bg-neutral-100" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && error && (
            <div
              role="alert"
              className="mx-auto max-w-[620px] rounded-[24px] border border-red-100 bg-red-50 px-6 py-5 text-center font-['Montserrat'] text-sm font-semibold text-red-600"
            >
              {error}
            </div>
          )}

          {!loading && !error && entidades.length === 0 && (
            <div className="mx-auto max-w-[620px] rounded-[24px] border border-black/10 bg-white px-6 py-10 text-center font-['Montserrat'] text-neutral-500 shadow-[0_18px_60px_rgba(0,0,0,0.05)]">
              No hay {getTitulo().toLowerCase()} disponibles en este momento.
            </div>
          )}

          {!loading && !error && destacados.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {destacados.map((entidad, index) => {
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
                const image = entidad.univ_img || entidad.empr_img;

                return (
                  <button
                    key={entidad.id}
                    type="button"
                    aria-label={`Explorar certificaciones de ${entidad.nombre}`}
                    onClick={() =>
                      handleItemMenuClick({
                        [tipoSingularCapitalizado]: entidad.nombre,
                      })
                    }
                    className="group relative min-h-[240px] overflow-hidden rounded-[28px] p-8 text-left transition-all duration-500 hover:-translate-y-2"
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
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_80%,rgba(255,255,255,0.12),transparent_26%)]" />

                    <div
                      className="relative z-10 mb-6 flex gap-1 text-white/90"
                      aria-hidden="true"
                    >
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <span key={starIndex} className="text-[15px]">
                          ★
                        </span>
                      ))}
                    </div>

                    <div className="relative z-10">
                      <span className="block font-['Montserrat'] text-[1rem] font-bold uppercase tracking-[-0.03em] text-white">
                        Top 50
                      </span>

                      <h2 className="mt-1 max-w-[70%] font-['Playfair_Display','Lora','Georgia','serif'] text-[2.7rem] font-te-it leading-[0.95em] tracking-[-0.05em] text-white md:text-[3.4rem]">
                        {entidad.nombre}
                      </h2>

                      <p className="mt-5 font-['Montserrat'] text-[1rem] font-medium text-white/85">
                        por top.education
                      </p>
                    </div>

                    {image && (
                      <img
                        src={image}
                        alt={entidad.nombre}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="absolute bottom-0 right-0 h-[72%] w-auto object-contain opacity-80 transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {!loading && !error && resto.length > 0 && (
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {resto.map((entidad) => {
                const icon = entidad.univ_ico || entidad.empr_ico;

                return (
                  <button
                    key={entidad.id}
                    type="button"
                    aria-label={`Explorar certificaciones de ${entidad.nombre}`}
                    onClick={() =>
                      handleItemMenuClick({
                        [tipoSingularCapitalizado]: entidad.nombre,
                      })
                    }
                    className="group flex items-center gap-4 rounded-[24px] border border-black/10 bg-white p-4 text-left shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-black/15 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
                  >
                    <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-[#F5F3EE]">
                      {icon ? (
                        <img
                          src={icon}
                          alt={entidad.nombre}
                          loading="lazy"
                          decoding="async"
                          className="h-[58px] w-[58px] object-contain transition-transform duration-300 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="font-['Montserrat'] text-xl font-bold text-neutral-400">
                          {entidad.nombre?.trim()?.charAt(0)?.toUpperCase() || "#"}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 font-['Montserrat'] text-[1rem] font-bold leading-[1.2em] tracking-[-0.03em] text-[#111111]">
                        {entidad.nombre}
                      </h3>

                      <div className="mt-3 inline-flex rounded-full bg-[#F3F1EC] px-3 py-1 font-['Montserrat'] text-[11px] font-bold uppercase tracking-[0.04em] text-[#1941cf]">
                        {entidad.total_certificaciones || 0} certificaciones
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default TopList;