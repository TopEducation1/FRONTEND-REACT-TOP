import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import endpoints from "../config/api";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function RankingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [ranking, setRanking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await axios.get(
          endpoints.ranking_detail(encodeURIComponent(slug))
        );
        setRanking(res.data);
      } catch (err) {
        console.error("Error al cargar ranking:", err);
        setError("No se pudo cargar el ranking.");
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [slug]);

  function navigateWithTransition(path, options = {}) {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(path, options));
    } else {
      navigate(path, options);
    }
  }

  const handleItemMenuClick = (filters = []) => {
    const queryParams = new URLSearchParams();

    filters.forEach((filter) => {
      if (!filter?.key || !filter?.value) return;
      queryParams.append(filter.key, filter.value);
    });

    queryParams.append("idioma", "es");
    //queryParams.append("idioma", "en");
    queryParams.set("page", "1");
    queryParams.set("page_size", "16");

    navigateWithTransition(`/explora/filter?${queryParams.toString()}`, {
      replace: true,
    });
  };

  const getEntityFilter = (entry) => {
    if (entry.universidad?.id) {
      return { key: "universidad_id", value: entry.universidad.id };
    }

    if (entry.empresa?.id) {
      return { key: "empresa_id", value: entry.empresa.id };
    }

    return null;
  };

  const getSkillFilter = (skill) => {
    if (skill?.skill_id) {
      return {
        key: "tema_id",
        value: skill.skill_id,
      };
    }

    return null;
  };

  const isValidImage = (value) => {
    if (!value) return false;
    const clean = String(value).trim().toLowerCase();

    return (
      clean !== "" &&
      clean !== "none" &&
      clean !== "null" &&
      clean !== "undefined"
    );
  };

  const getEntityName = (entry) =>
    entry.universidad?.nombre || entry.empresa?.nombre || "";

  const getEntityIcon = (entry) =>
    entry.universidad?.univ_ico || entry.empresa?.empr_ico || "";

  const getEntityInitial = (entry) => (entry.universidad ? "U" : "E");

  const getRankingImage = () =>
    ranking?.image ||
    ranking?.imagen ||
    ranking?.imagen_ranking ||
    ranking?.ranking_img ||
    ranking?.portada ||
    "";

  const getSkillName = (skill) =>
    skill?.skill_translate || skill?.skill_nombre || skill?.skill_slug || "";

  const getSkillImage = (skill) => skill?.skill_ico || skill?.skill_img || "";

  const themeByIndex = (index) => {
    const themes = [
      { color: "#5CC781", glow: "rgba(92,199,129,0.20)" },
      { color: "#D33B3E", glow: "rgba(211,59,62,0.20)" },
      { color: "#034694", glow: "rgba(3,70,148,0.20)" },
    ];

    return themes[index % themes.length];
  };

  const getRankingTheme = () => {
    const name = String(ranking?.nombre || "").toLowerCase();

    if (name.includes("empresa")) {
      return { color: "#D33B3E", glow: "rgba(211,59,62,0.24)" };
    }

    if (name.includes("latam") || name.includes("latino")) {
      return { color: "#5CC781", glow: "rgba(92,199,129,0.24)" };
    }

    return { color: "#034694", glow: "rgba(3,70,148,0.24)" };
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-[#F8F7F4] pb-20">
        {/* HERO SKELETON */}
        <div className="mx-auto mb-14">
          <div className="relative h-[360px] animate-pulse overflow-hidden rounded-[0px_0px_32px_32px] bg-[#BDBDBD] md:h-[420px]">
            <div className="absolute left-1/2 top-[120px] h-8 w-[240px] -translate-x-1/2 rounded-full bg-white/70" />
            <div className="absolute left-1/2 top-[175px] h-14 w-[520px] max-w-[70%] -translate-x-1/2 rounded-full bg-white/60" />
            <div className="absolute left-1/2 top-[250px] h-5 w-[620px] max-w-[75%] -translate-x-1/2 rounded-full bg-white/40" />
            <div className="absolute left-1/2 top-[280px] h-5 w-[460px] max-w-[60%] -translate-x-1/2 rounded-full bg-white/30" />

          </div>
        </div>

        {/* LIST SKELETON */}
        <div className="relative z-10 mx-auto max-w-[1200px] px-4">
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.05)]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr]">
                  <div className="relative min-h-[180px] animate-pulse bg-[#6B6560] p-5">
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="h-3 w-3 rounded-full bg-white/50" />
                      ))}
                    </div>

                    <div className="mb-5 flex gap-3">
                      <div className="h-8 w-[90px] rounded-full bg-white/80" />
                      <div className="h-8 w-[140px] rounded-full bg-white/30" />
                    </div>

                    <div className="h-6 w-[70%] rounded-full bg-white/60" />
                    <div className="mt-3 h-6 w-[52%] rounded-full bg-white/40" />
                    <div className="mt-5 h-4 w-[40%] rounded-full bg-white/35" />

                    <div className="absolute right-5 top-3 h-[75px] w-[75px] rounded-[24px] bg-white/70" />
                  </div>

                  <div className="animate-pulse p-5">
                    <div className="mb-2 h-7 w-[220px] rounded-full bg-neutral-200" />
                    <div className="mb-5 h-4 w-[420px] max-w-[90%] rounded-full bg-neutral-100" />

                    <div className="flex gap-4 overflow-hidden">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex min-h-[86px] min-w-[260px] items-center gap-3 rounded-[22px] border border-black/10 bg-white p-3 shadow-[0_10px_35px_rgba(0,0,0,0.04)]"
                        >
                          <div className="h-[62px] w-[62px] rounded-[18px] bg-neutral-200" />

                          <div className="flex-1">
                            <div className="h-4 w-[80%] rounded-full bg-neutral-200" />
                            <div className="mt-3 h-6 w-[120px] rounded-full bg-neutral-100" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="rounded-[24px] bg-red-50 px-6 py-5 text-center font-['Montserrat'] text-sm font-semibold text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!ranking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <p className="font-['Montserrat'] text-neutral-600">
          No se encontró el ranking.
        </p>
      </div>
    );
  }

  const rankingTheme = getRankingTheme();
  const rankingImage = getRankingImage();

  return (
    <section className="relative overflow-hidden bg-[#F8F7F4] pb-20">
      <div className="pointer-events-none absolute left-[-180px] top-10 h-[420px] w-[420px] rounded-full bg-[#F8F7F4]/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-180px] top-40 h-[420px] w-[420px] rounded-full bg-[#F8F7F4]/10 blur-[120px]" />

      <div className="mx-auto mb-14">
        <div
          className="relative overflow-hidden rounded-[0px_0px_32px_32px] px-8 pt-25 pb-12 text-center shadow-[0_30px_90px_rgba(0,0,0,0.14)] md:px-14 md:pt-30 md:pb-16"
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(0,0,0,0.46) 0%,
                rgba(0,0,0,0.18) 36%,
                transparent 100%
              ),
              ${rankingTheme.color}
            `,
            boxShadow: `0 30px 90px ${rankingTheme.glow}`,
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_76%,rgba(255,255,255,0.14),transparent_28%)]" />

          <div className="relative z-10 mx-auto max-w-[780px]">
            <span className="mb-5 inline-flex rounded-full border border-white/20 bg-[#F5F3EE] px-5 py-1 font-['Montserrat'] text-[12px] font-bold uppercase text-[#0F090B] shadow-sm">
              Ranking top.education
            </span>

            <h1 className="!font-te text-[3rem] font-bold leading-[0.95em] text-white md:text-[3.5rem]">
              {ranking.nombre}
            </h1>

            {ranking.descripcion && (
              <p className="mx-auto mt-2 max-w-[760px] font-['Montserrat'] text-[1rem] leading-[1.5em] text-white/85 md:text-[1rem]">
                {ranking.descripcion}
              </p>
            )}
          </div>

          {isValidImage(rankingImage) && (
            <img
              src={rankingImage}
              alt={ranking.nombre}
              className="absolute bottom-0 right-0 z-0 h-[90%] w-auto object-contain opacity-40 transition-transform duration-500 md:opacity-70"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px]">
        {ranking.entradas?.length > 0 ? (
          <ul className="space-y-5">
            {ranking.entradas.map((entry, index) => {
              const entityName = getEntityName(entry);
              const entityIcon = getEntityIcon(entry);
              const hasIcon = isValidImage(entityIcon);
              const theme = themeByIndex(index);

              return (
                <li
                  key={entry.id}
                  className="overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.05)]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr]">
                    <button
                      type="button"
                      onClick={() => handleItemMenuClick([getEntityFilter(entry)])}
                      className="group relative min-h-[120px] overflow-hidden p-5 text-left lg:min-h-[180px]"
                      style={{
                        background: `
                          linear-gradient(
                            135deg,
                            rgba(0,0,0,0.42) 0%,
                            rgba(0,0,0,0.14) 35%,
                            transparent 100%
                          ),
                          #6B6560
                        `,
                        boxShadow: `0 30px 80px ${theme.glow}`,
                      }}
                    >
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_82%,rgba(255,255,255,0.14),transparent_26%)]" />

                      <div className="relative z-10">
                        <div className="mb-2 flex gap-1 text-white/85">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="text-[14px]">
                              ★
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-4 py-1.5 font-['Montserrat'] text-[12px] font-extrabold text-[#111111]">
                            Rank {entry.posicion}
                          </span>

                          <span className="rounded-full bg-white/15 px-4 py-1.5 font-['Montserrat'] text-[12px] font-bold text-white">
                            {entry.total_certificaciones} certificaciones
                          </span>
                        </div>

                        <h2 className="mt-3 max-w-[280px] !font-[Montserrat] text-[1.25rem] font-bold leading-[1.1em] text-white md:text-[1.2rem]">
                          {entityName}
                        </h2>

                        <p className="mt-2 font-['Montserrat'] text-[14px] font-medium text-white/80">
                          por top.education
                        </p>
                      </div>

                      {hasIcon ? (
                        <img
                          src={entityIcon}
                          alt={entityName}
                          className="absolute top-3 right-5 h-[75px] w-[75px] rounded-[24px] bg-white/90 p-3 object-contain transition-all duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="absolute top-2 right-5 grid h-[75px] w-[75px] place-items-center rounded-full border-2 border-white/30 bg-white/10 font-['Montserrat'] text-3xl font-bold text-white">
                          {getEntityInitial(entry)}
                        </div>
                      )}
                    </button>

                    <div className="relative flex min-w-0 flex-col justify-center p-3 md:p-5">
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="!font-['Montserrat'] text-[1.2rem] font-bold tracking-[-0.03em] text-[#111111]">
                            Temas destacados
                          </h3>

                          <p className="font-['Montserrat'] text-sm text-neutral-500">
                            Explora certificaciones relacionadas con {entityName}.
                          </p>
                        </div>

                        <div className="hidden items-center gap-2 md:flex">
                          <button
                            className={`boton-prev-${entry.id} grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition hover:bg-black hover:text-white`}
                            aria-label="Anterior"
                          >
                            <FaAngleLeft />
                          </button>

                          <button
                            className={`boton-next-${entry.id} grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition hover:bg-black hover:text-white`}
                            aria-label="Siguiente"
                          >
                            <FaAngleRight />
                          </button>
                        </div>
                      </div>

                      <Swiper
                        modules={[Navigation]}
                        navigation={{
                          nextEl: `.boton-next-${entry.id}`,
                          prevEl: `.boton-prev-${entry.id}`,
                        }}
                        spaceBetween={14}
                        slidesPerView={1.15}
                        grabCursor
                        breakpoints={{
                          640: { slidesPerView: 1.6 },
                          768: { slidesPerView: 2.1 },
                          1024: { slidesPerView: 2.2 },
                          1280: { slidesPerView: 2.5 },
                        }}
                        className="w-full !overflow-visible [clip-path:inset(-30px_0_-30px_0)]"
                      >
                        {entry.temas_certificaciones?.map((skill) => {
                          const skillName = getSkillName(skill);
                          const skillImg = getSkillImage(skill);
                          const hasSkillImg = isValidImage(skillImg);

                          return (
                            <SwiperSlide key={skill.skill_id} className="py-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleItemMenuClick([
                                    getSkillFilter(skill),
                                    getEntityFilter(entry),
                                  ])
                                }
                                className="group flex min-h-[80px] w-full items-center gap-3 rounded-[22px] border border-black/10 bg-white p-2 text-left shadow-[0_10px_35px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
                              >
                                <div className="grid h-[62px] w-[62px] shrink-0 place-items-center overflow-hidden rounded-[18px] bg-[#F5F3EE]">
                                  {hasSkillImg ? (
                                    <img
                                      src={skillImg}
                                      alt={skillName}
                                      className="h-[46px] w-[46px] object-contain transition-transform duration-300 group-hover:scale-105"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <span className="font-['Montserrat'] text-lg font-bold text-neutral-400">
                                      #
                                    </span>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <span className="line-clamp-2 font-['Montserrat'] text-[14px] font-bold leading-[1.25em] tracking-[-0.02em] text-[#111111]">
                                    {skillName}
                                  </span>

                                  <span className="mt-1 inline-flex rounded-full bg-[#F3F1EC] px-3 py-1 font-['Montserrat'] text-[11px] font-bold text-[#0F090B]">
                                    {skill.total_certificaciones} certificaciones
                                  </span>
                                </div>
                              </button>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>

                      <div className="mt-5 flex items-center justify-center gap-2 md:hidden">
                        <button
                          className={`boton-prev-${entry.id} grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-[0_10px_30px_rgba(0,0,0,0.06)]`}
                          aria-label="Anterior"
                        >
                          <FaAngleLeft />
                        </button>

                        <button
                          className={`boton-next-${entry.id} grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-[0_10px_30px_rgba(0,0,0,0.06)]`}
                          aria-label="Siguiente"
                        >
                          <FaAngleRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-[24px] bg-white px-6 py-10 text-center font-['Montserrat'] text-neutral-500 shadow-[0_18px_60px_rgba(0,0,0,0.05)]">
            No hay entradas en este ranking.
          </div>
        )}
      </div>
    </section>
  );
}