import { useRef, useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import HeroSlider from "../components/HeroSlider";
import endpoints from "../config/api";
import { ArrowRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCreative, Autoplay } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

const FALLBACK_COURSE_IMAGE = "/assets/img/default-course.jpg";

function normalizeAssetUrl(url) {
  if (!url) return null;

  const value = String(url).trim();

  if (!value) return null;

  if (value.startsWith("/assets/")) return value;
  if (value.startsWith("assets/")) return `/${value}`;

  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const parsed = new URL(value);

      if (parsed.pathname.startsWith("/assets/")) {
        return parsed.pathname;
      }

      return value;
    } catch {
      return value;
    }
  }

  return value;
}

export default function TopOriginals() {
  const { slug } = useParams();
  const scrollRef = useRef(null);

  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSlider, setShowSlider] = useState(false);
  const [error, setError] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOriginal = async () => {
      try {
        setLoading(true);
        setError(null);
        setShowSlider(false);

        const res = await axios.get(
          endpoints.original_detail(slug),
          {
            signal: controller.signal,
          }
        );

        console.log(
          "ORIGINAL DETAIL RESPONSE:",
          res.data
        );

        console.log(
          "CERTIFICATIONS:",
          res.data?.certifications
        );

        console.log(
          "FIRST CERTIFICATION DETAIL:",
          res.data?.certifications?.[0]
            ?.certification_detail
        );

        setOriginal(res.data);

        setOriginal(res.data);
      } catch (error) {
        if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") return;
        console.error("Error al cargar autor:", error);
        setError("No se pudo cargar este original.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchOriginal();

    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (loading || error || !original) return;

    const timer = setTimeout(() => {
      setShowSlider(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [loading, error, original]);
  function EntityIdentity({ icon, name }) {
    const [imageFailed, setImageFailed] = useState(false);

    if (!name && (!icon || imageFailed)) {
      return null;
    }

    return (
      <div className="flex min-w-0 max-w-[210px] items-center gap-2">
        {icon && !imageFailed ? (
          <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-black/10 bg-white p-1">
            <img
              src={icon}
              alt={name || "Entidad"}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="max-h-7 max-w-7 object-contain"
            />
          </span>
        ) : (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/10 bg-[#F5F3EE] font-['Montserrat'] text-xs font-bold text-neutral-600">
            {name?.trim()?.charAt(0)?.toUpperCase() || "E"}
          </span>
        )}

        {name && (
          <span
            title={name}
            className="line-clamp-2 min-w-0 font-['Montserrat'] text-[11px] font-semibold leading-[1.2em] text-neutral-600"
          >
            {name}
          </span>
        )}
      </div>
    );
  }
  const heroMotion = useMemo(() => {
    const maxScroll = 400;
    const clampedScroll = Math.min(scrollY, maxScroll);

    return {
      scale: 1 + clampedScroll / (maxScroll * 2),
      opacity: Math.max(1 - clampedScroll / maxScroll, 0.12),
    };
  }, [scrollY]);

  const certifications = original?.certifications || [];

  const getCertificationUrl = (item) => {
    const certSlug = item?.certification_slug;
    const platformSlug =
      item?.platform_slug ||
      item?.certification_detail?.plataforma_certificacion?.slug;

    if (!certSlug) return "/explora";

    if (platformSlug) {
      return `/certificacion/${platformSlug}/${certSlug}`;
    }

    return `/certificacion/${certSlug}`;
  };

  const getSkillUrl = (item) => {
    const skill =
      item?.certification_detail?.primary_skill ||
      item?.certification_detail?.skills?.[0];

    if (skill?.slug) {
      return `/explora?Tema=${skill.slug}&page=1&page_size=16`;
    }

    if (skill?.id) {
      return `/explora?tema_id=${skill.id}&page=1&page_size=16`;
    }

    return "/explora";
  };

  const handleImageError = (event, fallback = FALLBACK_COURSE_IMAGE) => {
    if (event.currentTarget.dataset.fallbackApplied === "1") return;

    event.currentTarget.dataset.fallbackApplied = "1";
    event.currentTarget.src = fallback;
  };

  if (loading) {
    return (
      <main className="min-h-screen overflow-hidden bg-white text-[#111111]">
        <section className="relative h-[92vh] w-full overflow-hidden bg-white">
          <div className="absolute inset-0 animate-pulse bg-neutral-200" />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_35%,rgba(255,255,255,0.72)_72%,#FFFFFF_100%)]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-8 text-center md:px-20 md:pb-10">
            <div className="mb-4 h-9 w-[230px] animate-pulse rounded-full bg-white/80 shadow-sm" />

            <div className="h-14 w-full max-w-[720px] animate-pulse rounded-full bg-neutral-200 md:h-20" />
            <div className="mt-3 h-14 w-full max-w-[520px] animate-pulse rounded-full bg-neutral-100 md:h-20" />
            <div className="mt-3 h-14 w-full max-w-[620px] animate-pulse rounded-full bg-neutral-100 md:h-20" />
          </div>
        </section>

        <section className="relative bg-white px-6 pb-8 md:px-20 md:pb-12">
          <div className="mx-auto max-w-[920px]">
            <div className="mx-auto h-4 max-w-[760px] animate-pulse rounded-full bg-neutral-200" />
            <div className="mx-auto mt-3 h-4 max-w-[820px] animate-pulse rounded-full bg-neutral-100" />
            <div className="mx-auto mt-3 h-4 max-w-[700px] animate-pulse rounded-full bg-neutral-100" />
          </div>
        </section>

        <section className="relative overflow-hidden bg-white px-4 py-16 md:py-20">
          <div className="relative z-10 mx-auto max-w-[1200px]">
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="h-4 w-[150px] animate-pulse rounded-full bg-neutral-200" />
                <div className="mt-5 h-9 w-[520px] max-w-full animate-pulse rounded-full bg-neutral-100" />
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-100" />
                <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-100" />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[34px] border border-black/10 bg-[#F8F7F4] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.08)] md:p-10 lg:p-14">
              <div className="grid min-h-[560px] grid-cols-1 gap-8 md:grid-cols-[1.05fr_.95fr]">
                <div className="flex flex-col justify-center">
                  <div className="mb-6 flex gap-3">
                    <div className="h-9 w-[90px] animate-pulse rounded-full bg-neutral-200" />
                    <div className="h-9 w-[110px] animate-pulse rounded-full bg-white" />
                  </div>

                  <div className="h-12 w-full max-w-[520px] animate-pulse rounded-full bg-neutral-200" />
                  <div className="mt-3 h-12 w-full max-w-[430px] animate-pulse rounded-full bg-neutral-100" />

                  <div className="mt-8 space-y-3">
                    <div className="h-4 w-full max-w-[540px] animate-pulse rounded-full bg-neutral-200" />
                    <div className="h-4 w-full max-w-[500px] animate-pulse rounded-full bg-neutral-100" />
                    <div className="h-4 w-full max-w-[460px] animate-pulse rounded-full bg-neutral-100" />
                  </div>

                  <div className="mt-8 flex gap-3">
                    <div className="h-12 w-[150px] animate-pulse rounded-full bg-[#2563EB]/20" />
                    <div className="h-12 w-[150px] animate-pulse rounded-full bg-white" />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-full max-w-[420px] overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
                    <div className="h-[260px] animate-pulse bg-neutral-200" />
                    <div className="p-6">
                      <div className="h-6 w-full animate-pulse rounded-full bg-neutral-200" />
                      <div className="mt-3 h-6 w-[70%] animate-pulse rounded-full bg-neutral-100" />

                      <div className="mt-6 flex items-center justify-between">
                        <div className="h-9 w-[90px] animate-pulse rounded-full bg-neutral-100" />
                        <div className="h-10 w-10 animate-pulse rounded-full bg-[#0066D9]/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 animate-pulse rounded-full ${
                    index === 0 ? "bg-[#2563EB]/40" : "bg-neutral-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white px-4 py-32 text-center">
        <p className="font-['Montserrat'] text-red-500">{error}</p>
      </main>
    );
  }

  if (!original) {
    return (
      <main className="min-h-screen bg-white px-4 py-32 text-center">
        <p className="font-['Montserrat'] text-neutral-600">
          No se encontró el autor.
        </p>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{original.name} | Top.education</title>
        <meta
          name="description"
          content="Descubre contenido original de Top.education y certificaciones recomendadas para crecer profesionalmente."
        />
        <meta property="og:title" content={`${original.name} | Top.education`} />
        <meta
          property="og:description"
          content="Aprende con rutas inspiradas en grandes referentes globales."
        />
        <meta property="og:type" content="website" />
        {original.image && <meta property="og:image" content={original.image} />}
      </Helmet>

      <main className="overflow-hidden bg-white text-[#111111]">
        <section className="relative h-[92vh] w-full overflow-hidden bg-white">
          {original.image ? (
            <img
              src={original.image}
              alt={original.name}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-[400ms] ease-out"
              style={{
                transform: `scale(${heroMotion.scale})`,
                opacity: heroMotion.opacity,
              }}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          ) : (
            <div className="absolute inset-0 bg-[#F6F4EF]" />
          )}

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_35%,rgba(255,255,255,0.72)_72%,#FFFFFF_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(25,65,207,0.10),transparent_45%)]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-8 text-center md:px-20 md:pb-10">
            <span className="mb-4 rounded-full border border-black/10 bg-white/70 px-5 py-2 font-['Montserrat'] text-[12px] font-bold uppercase tracking-[0.22em] text-[#1941CF] shadow-[0_16px_45px_rgba(0,0,0,0.08)] backdrop-blur-xl">
              Top.Education Originals
            </span>

            <h1 className="max-w-[980px] font-te text-[2.5rem] font-semibold leading-[1.1em] text-[#111111] md:text-[4rem]">
              ¿Qué habría aprendido <br />
              <span className="font-te-it text-[#1941CF]">{original.name}</span>{" "}
              <br />
              en top.education?
            </h1>
          </div>
        </section>

        {original.biog && (
          <section className="relative bg-white px-6 pb-8 md:px-20 md:pb-12">
            <div className="pointer-events-none absolute left-[-140px] top-0 h-[300px] w-[300px] rounded-full bg-[#1941cf]/5 blur-[100px]" />

            <div className="mx-auto max-w-[920px]">
              <div
                className="blog-content text-center font-['Montserrat'] text-[1.05rem] leading-[1.5em] text-neutral-600 md:text-[1.1rem]"
                dangerouslySetInnerHTML={{ __html: original.biog }}
              />
            </div>
          </section>
        )}

        <section className="relative overflow-hidden bg-white px-4 py-16 md:py-20">
          <div className="pointer-events-none absolute left-[-160px] top-20 h-[360px] w-[360px] rounded-full bg-[#1941cf]/6 blur-[120px]" />
          <div className="pointer-events-none absolute right-[-160px] bottom-20 h-[360px] w-[360px] rounded-full bg-[#5CC781]/8 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-[1200px]">
            <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="font-['Montserrat'] text-[12px] font-bold uppercase tracking-[0.28em] text-[#1941CF]">
                  Ruta inspirada
                </span>

                <h2 className="max-w-[780px] !font-['Montserrat'] text-[2.5rem] font-bold leading-[1.5em] text-[#111111] md:text-[2rem]">
                  Lo que pudo aprender{" "}
                  <span className="font-te text-[2.5rem] text-[#1941CF]">
                    {original.name}
                  </span>
                </h2>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <button
                  type="button"
                  className="originals-prev grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white text-[#111111] shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:text-white"
                  aria-label="Anterior"
                >
                  <FaChevronLeft />
                </button>

                <button
                  type="button"
                  className="originals-next grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white text-[#111111] shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:text-white"
                  aria-label="Siguiente"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            <Swiper
              modules={[
                Navigation,
                Pagination,
                EffectCreative,
                Autoplay,
              ]}
              navigation={{
                nextEl: ".originals-next",
                prevEl: ".originals-prev",
              }}
              pagination={{
                clickable: true,
                el: ".originals-pagination",
              }}
              autoplay={{
                delay: 4000, // 4 segundos
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              effect="creative"
              creativeEffect={{
                prev: {
                  translate: ["-8%", 0, -1],
                  opacity: 0.45,
                  scale: 0.92,
                },
                next: {
                  translate: ["8%", 0, -1],
                  opacity: 0.45,
                  scale: 0.92,
                },
              }}
              grabCursor
              speed={650}
              slidesPerView={1}
              loop={true}
              className="!overflow-visible"
            >
              {certifications.map((item, index) => {
                const detail = item?.certification_detail || {};
                const skill = detail.primary_skill || detail.skills?.[0];

                const skillName =
                  skill?.translate ||
                  skill?.nombre ||
                  detail?.tema_certificacion?.nombre ||
                  "Certificación";

                const platformIcon = normalizeAssetUrl(
                  detail?.plataforma_certificacion?.plat_ico ||
                    detail?.plataforma_certificacion?.plat_img
                );

                const university = detail?.universidad_certificacion || null;
                const company = detail?.empresa_certificacion || null;

                const entity = university || company;

                const entityName =
                  entity?.nombre ||
                  entity?.name ||
                  entity?.univ_nombre ||
                  entity?.empr_nombre ||
                  "";

                const entityIcon = normalizeAssetUrl(
                  university?.univ_ico ||
                    university?.univ_img ||
                    company?.empr_ico ||
                    company?.empr_img
                );
                const certificationImage =
                  normalizeAssetUrl(item?.certification_image_url) ||
                  FALLBACK_COURSE_IMAGE;

                return (
                  <SwiperSlide key={item?.certification_slug || index} className="!overflow-visible">
                    <article className="relative overflow-hidden rounded-[34px] border border-black/10 bg-[#F8F7F4] ">
                      {item.fondo && (
                        <img
                          src={normalizeAssetUrl(item.fondo)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                          className="invert pointer-events-none absolute left-[1%] top-[0%] h-[75%] max-h-[320px] w-auto object-contain opacity-[0.3]"
                        />
                      )}

                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(25,65,207,0.10),transparent_38%)]" />

                      <div className="relative z-10 grid min-h-[560px] grid-cols-1 gap-8 p-6 md:grid-cols-[1.05fr_.95fr] md:p-10 lg:p-14">
                        <div className="flex flex-col justify-center">
                          <div className="mb-6 flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-[#1941CF] px-4 py-2 font-['Montserrat'] text-[12px] font-bold text-white">
                              Lección {index + 1}
                            </span>

                            {skillName && (
                              <span className="rounded-full bg-white px-4 py-2 font-['Montserrat'] text-[12px] font-bold text-[#111111] shadow-sm">
                                {skillName}
                              </span>
                            )}
                          </div>

                          <h3 className="max-w-[620px] !font-['Montserrat'] text-[2erem] font-semibold leading-[1.02em] text-[#111111] md:text-[2.5rem]">
                            {item.title}
                          </h3>

                          {item.hist && (
                            <p className="mt-6 max-w-[560px] font-['Montserrat'] text-[1rem] leading-[1.7em] text-neutral-600 md:text-[1.08rem]">
                              {item.hist}
                            </p>
                          )}

                          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                              to={getSkillUrl(item)}
                              className="inline-flex items-center justify-center rounded-full bg-[#1941CF] px-7 py-4 font-['Montserrat'] text-sm font-bold text-white shadow-[0_18px_45px_rgba(25,65,207,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1941CF]"
                            >
                              Explorar tema
                              <ArrowRight
                                size={18}
                                strokeWidth={2}
                                className="translate-y-[1px]"
                              />
                            </Link>

                            <Link
                              to={getCertificationUrl(item)}
                              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-7 py-4 font-['Montserrat'] text-sm font-bold text-[#111111] transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:text-white"
                            >
                              Ver certificación
                            </Link>
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <Link
                            to={getCertificationUrl(item)}
                            className="group w-full max-w-[420px]"
                          >
                            <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.10)] transition-all duration-300 group-hover:-translate-y-2">
                              <div className="relative h-[260px] overflow-hidden bg-neutral-100">
                                <img
                                  src={certificationImage}
                                  alt={item.certification_title || "Certificación"}
                                  loading={index === 0 ? "eager" : "lazy"}
                                  decoding="async"
                                  onError={handleImageError}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute left-2 top-2 flex min-h-8 items-center">
                                      {platformIcon ? (
                                        <img
                                          src={platformIcon}
                                          alt={
                                            detail?.plataforma_certificacion?.nombre ||
                                            "Plataforma"
                                          }
                                          loading="lazy"
                                          decoding="async"
                                          onError={(event) => {
                                            event.currentTarget.style.display = "none";
                                          }}
                                          className="h-7 max-w-[105px] object-contain"
                                        />
                                      ) : (
                                        <span className="font-['Montserrat'] text-xs font-bold text-neutral-400">
                                          {detail?.plataforma_certificacion?.nombre ||
                                            "top.education"}
                                        </span>
                                      )}
                                    </div>

                                <span className="absolute right-4 top-4 rounded-full bg-[#1941CF] px-4 py-1.5 font-['Montserrat'] text-[12px] font-bold text-white">
                                  Certificación
                                </span>
                              </div>

                              <div className="p-6">
                                <h4 className="!font-['Montserrat'] text-[1.25rem] font-semibold leading-[1.15em] tracking-[-0.03em] text-[#111111]">
                                  {item.certification_title || "Ver certificación"}
                                </h4>

                                <div className="mt-6 flex items-end justify-between gap-4 border-t border-black/10 pt-4">
                                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                                    <EntityIdentity
                                      icon={entityIcon}
                                      name={entityName}
                                    />
                                  </div>

                                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0066D9] font-['Montserrat'] text-lg font-black text-white">
                                    <ArrowRight
                                      size={20}
                                      strokeWidth={2}
                                      className="translate-y-[1px]"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </article>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className="originals-pagination mt-5 flex justify-center gap-2" />

            <div className="mt-5 flex items-center justify-center gap-3 md:hidden">
              <button
                type="button"
                className="originals-prev grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white text-[#111111] shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
                aria-label="Anterior"
              >
                <FaChevronLeft />
              </button>

              <button
                type="button"
                className="originals-next grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white text-[#111111] shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
                aria-label="Siguiente"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </section>

        {showSlider && (
          <section className="relative bg-white px-4 pb-16 md:pb-20">
            <div className="mx-auto max-w-[1200px]">
              <HeroSlider />
            </div>
          </section>
        )}
      </main>
    </>
  );
}