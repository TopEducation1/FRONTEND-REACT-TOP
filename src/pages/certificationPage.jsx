import React, { useEffect, useState } from "react";
import { getLanguageLabel } from "../utils/languageMapper";
import { getLevelLabel } from "../utils/levelMapper";
import { useParams, useNavigate } from "react-router-dom";
import getCertificationById from "../services/getCertificationById";
import RightPop from "../components/RightPop";
import YouTubePlayer from "../components/YoutubePlayer";
import CertificationSlider from "../components/CertificationSlider";
import { Helmet } from "react-helmet";

const CertificationPageSkeleton = () => {
  return (
    <main className="bg-white px-4 py-10 md:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <div className="rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <div className="flex gap-3">
              <div className="h-9 w-[130px] animate-pulse rounded-full bg-[#2563EB]/20" />
              <div className="h-9 w-[150px] animate-pulse rounded-full bg-[#5CC781]/20" />
            </div>

            <div className="mt-7 h-12 w-[70%] animate-pulse rounded-full bg-neutral-200" />

            <div className="mt-5 space-y-3">
              <div className="h-5 w-full animate-pulse rounded-full bg-neutral-100" />
              <div className="h-5 w-[78%] animate-pulse rounded-full bg-neutral-100" />
            </div>

            <div className="mt-7 grid grid-cols-3 gap-6 border-y border-black/10 py-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <div className="h-4 w-[90px] animate-pulse rounded-full bg-neutral-200" />
                  <div className="mt-3 h-5 w-[120px] animate-pulse rounded-full bg-neutral-100" />
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <div className="h-12 w-[130px] animate-pulse rounded-full bg-neutral-900/20" />
              <div className="h-12 w-[140px] animate-pulse rounded-full bg-neutral-100" />
            </div>

            <div className="mt-8">
              <div className="h-7 w-[320px] animate-pulse rounded-full bg-neutral-200" />

              <div className="mt-6 space-y-4">
                <div className="h-4 w-full animate-pulse rounded-full bg-neutral-100" />
                <div className="h-4 w-[96%] animate-pulse rounded-full bg-neutral-100" />
                <div className="h-4 w-[90%] animate-pulse rounded-full bg-neutral-100" />
                <div className="h-4 w-[72%] animate-pulse rounded-full bg-neutral-100" />
              </div>
            </div>

            <div className="mt-8">
              <div className="h-7 w-[280px] animate-pulse rounded-full bg-neutral-200" />

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="h-10 w-[140px] animate-pulse rounded-full bg-neutral-100" />
                <div className="h-10 w-[120px] animate-pulse rounded-full bg-neutral-100" />
                <div className="h-10 w-[160px] animate-pulse rounded-full bg-neutral-100" />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <div className="h-7 w-[320px] animate-pulse rounded-full bg-neutral-200" />

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[18px] border border-black/10 bg-white"
                >
                  <div className="h-[150px] animate-pulse bg-neutral-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-[90px] animate-pulse rounded-full bg-neutral-200" />
                    <div className="h-5 w-[85%] animate-pulse rounded-full bg-neutral-200" />
                    <div className="h-5 w-[65%] animate-pulse rounded-full bg-neutral-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
              <div className="h-[260px] animate-pulse rounded-[24px] bg-neutral-200" />
              <div className="px-6">
                <div className="mt-6 h-12  w-full animate-pulse rounded-full bg-neutral-900/20" />

                <div className="mt-7 space-y-5">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="border-b border-black/10 pb-4">
                      <div className="h-4 w-[120px] animate-pulse rounded-full bg-neutral-200" />
                      <div className="mt-3 h-7 w-[70%] animate-pulse rounded-full bg-neutral-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-[280px] animate-pulse rounded-[30px] border border-black/10 bg-neutral-100" />
          </div>
        </aside>
      </div>
    </main>
  );
};

const CertificationPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tab1");
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [positionPopUp, setPositionPopUp] = useState(false);
  const [visibleContainerPopUp, setVisibleContainerPopUp] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [hiddenImages, setHiddenImages] = useState({});

  const MAX_CHARS = 600;

  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [slug]);

  useEffect(() => {
    const handleResize = () => {
      setPositionPopUp(window.innerWidth < 1200);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const loadCertification = async () => {
      try {
        setLoading(true);
        const data = await getCertificationById(slug);
        setCertification(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadCertification();
    }
  }, [slug]);

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(path);
      });
    } else {
      navigate(path);
    }
  }

  const handleClickButtonPopUp = () => {
    setVisibleContainerPopUp(false);
  };

  const hideImage = (key) => {
    setHiddenImages((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const isValidValue = (value) => {
    if (!value) return false;

    const clean = String(value).trim().toLowerCase();

    return (
      clean !== "" &&
      clean !== "none" &&
      clean !== "null" &&
      clean !== "undefined" &&
      clean !== "x" &&
      clean !== "uncategorized"
    );
  };

  const getImageUrl = (url) => {
    if (!isValidValue(url)) return null;
    return String(url).trim();
  };

  const shouldShowImage = (key, url) => {
    return Boolean(getImageUrl(url)) && !hiddenImages[key];
  };

  const handleItemMenuClick = (category, value) => {
    if (!category || !value) return;

    const query = `${category}=${encodeURIComponent(value)}&page=1&page_size=15`;
    navigateWithTransition(`/explora?${query}`);
  };

  if (loading) {
    return <CertificationPageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="font-['Montserrat'] text-2xl font-bold text-black">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!certification) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="font-['Montserrat'] text-2xl font-bold text-black">
          No se encontró la certificación
        </div>
      </div>
    );
  }

  const level = isValidValue(certification?.nivel_certificacion)
    ? getLevelLabel(certification.nivel_certificacion)
    : null;

  const isCoursera =
    certification?.plataforma_certificacion?.nombre
      ?.toString()
      .trim()
      .toLowerCase() === "coursera";

  const isMasterClass =
    certification?.plataforma_certificacion?.nombre
      ?.toString()
      .trim()
      .toLowerCase() === "masterclass";

  const isSpecialization = [
    "especialización",
    "especializacion",
    "specialization",
  ].includes(certification?.tipo_certificacion?.toString().trim().toLowerCase());

  const videoUrl = certification?.video_certificacion?.url;
  const hasValidVideo = isValidValue(videoUrl);

  const contenidoObj = certification?.contenido_certificacion;

  const contenidoArr = Array.isArray(contenidoObj?.contenido_certificacion)
    ? contenidoObj.contenido_certificacion
        .map((item) => String(item || "").trim())
        .filter(isValidValue)
    : [];

  const cantidad = isValidValue(contenidoObj?.cantidad_modulos)
    ? contenidoObj.cantidad_modulos
    : "";

  const getSkillLabel = (skill) => {
    if (!skill) return "";

    if (typeof skill === "string") {
      return isValidValue(skill) ? skill : "";
    }

    return skill.translate || skill.nombre || skill.name || skill.slug || "";
  };

  const getSkillCategoryKey = (skill) => {
    const raw = (skill?.skill_type || "").toString().trim().toLowerCase();

    if (["tema", "category", "principal"].includes(raw)) return "Tema";
    if (["habilidad", "skill", "subskill", "secondary"].includes(raw)) {
      return "Habilidad";
    }

    return "Habilidad";
  };

  const getSkillSlug = (skill) => {
    if (!skill || typeof skill === "string") return "";
    return skill.slug || "";
  };

  const allSkills = (() => {
    const relationSkills = Array.isArray(certification?.skills)
      ? certification.skills
          .filter(Boolean)
          .map((skill) => ({
            id: skill.id,
            nombre: skill.nombre,
            translate: skill.translate,
            slug: skill.slug,
            skill_type: skill.skill_type,
            skill_col: skill.skill_col,
          }))
          .filter((skill) => isValidValue(getSkillLabel(skill)))
      : [];

    if (relationSkills.length > 0) return relationSkills;

    const raw = certification?.habilidades_certificacion;

    const toText = (item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        return String(item.nombre || item.name || "");
      }
      return "";
    };

    const baseList = Array.isArray(raw) ? raw.map(toText) : [toText(raw)];

    return baseList
      .flatMap((text) => String(text).split(","))
      .map((item) => item.trim())
      .filter(isValidValue)
      .map((name, index) => ({
        id: `legacy-${index}`,
        nombre: name,
        translate: "",
        slug: "",
        skill_type: "habilidad",
        skill_col: "",
      }));
  })();

  const validSkills = Array.isArray(allSkills)
    ? allSkills.filter((skill) => isValidValue(getSkillLabel(skill)))
    : [];

  const hasSkills = validSkills.length > 0;

  const aprendizajes = Array.isArray(certification?.aprendizaje_certificacion)
    ? certification.aprendizaje_certificacion
        .map((item) => {
          if (typeof item === "string") return item;
          return item?.nombre || item?.name || "";
        })
        .map((item) => String(item || "").trim())
        .filter((item) => isValidValue(item) && !item.startsWith("x"))
    : [];

  const instructorsDetailed = certification?.instructores_detalle_certificacion;
  const instructorsLegacy = certification?.instructores_certificacion;

  const instructoresList = (() => {
    if (Array.isArray(instructorsDetailed) && instructorsDetailed.length > 0) {
      return instructorsDetailed
        .map((item) => {
          const nombre = (item?.nombre || item?.name || "").toString().trim();
          const imagen = getImageUrl(item?.imagen || item?.image);

          if (!isValidValue(nombre)) return null;

          return {
            nombre,
            imagen,
            source: "relation",
          };
        })
        .filter(Boolean);
    }

    if (!instructorsLegacy) return [];

    if (Array.isArray(instructorsLegacy)) {
      return instructorsLegacy
        .map((item) => {
          const nombre = (item?.name || item?.nombre || item || "")
            .toString()
            .trim();

          if (!isValidValue(nombre)) return null;

          return {
            nombre,
            imagen: "",
            source: "legacy",
          };
        })
        .filter(Boolean);
    }

    if (typeof instructorsLegacy === "string") {
      return instructorsLegacy
        .trim()
        .replace(/\s*(?:&| and | y )\s*/gi, ",")
        .split(",")
        .map((item) => item.trim())
        .filter(isValidValue)
        .map((nombre) => ({
          nombre,
          imagen: "",
          source: "legacy",
        }));
    }

    return [];
  })();

  const specializationCourses = Array.isArray(certification?.specialization_courses)
    ? certification.specialization_courses
    : [];

  const hasSpecializationCourses = specializationCourses.length > 0;

  const getCourseImage = (course) => {
    return (
      getImageUrl(course?.imagen_final) ||
      getImageUrl(course?.universidad_certificacion?.univ_img) ||
      getImageUrl(course?.empresa_certificacion?.empr_img) ||
      getImageUrl(course?.plataforma_certificacion?.plat_img) ||
      "/assets/content/default-course.webp"
    );
  };

  const getCoursePath = (course) => {
    const platform = course?.plataforma_certificacion?.nombre
      ?.toString()
      ?.trim()
      ?.toLowerCase();

    if (platform && course?.slug) {
      return `/certificacion/${platform}/${course.slug}`;
    }

    if (course?.slug) {
      return `/certificacion/${course.slug}`;
    }

    return null;
  };

  const certificationImage =
    getImageUrl(certification.imagen_final) ||
    getImageUrl(certification.universidad_certificacion?.univ_img) ||
    getImageUrl(certification.empresa_certificacion?.empr_img);

  const institutionImage =
    getImageUrl(certification.universidad_certificacion?.univ_img) ||
    getImageUrl(certification.empresa_certificacion?.empr_img);

  const institutionType = getImageUrl(certification.universidad_certificacion?.univ_img)
    ? "Universidad"
    : getImageUrl(certification.empresa_certificacion?.empr_img)
    ? "Empresa"
    : "";

  const institutionName =
    institutionType === "Universidad"
      ? certification.universidad_certificacion?.nombre
      : certification.empresa_certificacion?.nombre;

  const platformImage =
    getImageUrl(certification.plataforma_certificacion?.plat_img);

  const certificationTypeLabel = isValidValue(certification.tipo_certificacion)
    ? certification.tipo_certificacion === "Curso"
      ? "Certificación"
      : certification.tipo_certificacion
    : null;

  const getDescription = () => {
    return (
      certification.universidad_certificacion?.descripcion_institucion ||
      certification.empresa_certificacion?.descripcion_institucion ||
      ""
    );
  };

  const truncateText = (text, max) => {
    if (!text) return "";
    return text.length > max ? `${text.substring(0, max)}...` : text;
  };

  const sectionCard =
    "rounded-[28px] border border-black/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.05)]";

  const sectionTitle =
    "!font-['Montserrat'] text-[1.35rem] font-bold leading-[1.25em] tracking-[-0.02em] text-[#111111]";

  const sectionSubtitle =
    "font-['Montserrat'] text-[1rem] font-medium leading-[1.25em] text-neutral-600";

  const smallLabel =
    "font-['Montserrat'] text-[12px] font-bold uppercase tracking-[0.08em] text-neutral-500";

  const bodyText =
    "font-['Montserrat'] text-[15px] leading-[1.8em] text-neutral-700";
  const getSkillColorClass = (skill) => {
    const map = {
      "tag-verde": "bg-[#5CC781] text-white hover:bg-[#4BB66F]",
      "tag-azul": "bg-[#034694] text-white hover:bg-[#023A78]",
      "tag-rojo": "bg-[#D33B3E] text-white hover:bg-[#B92F32]",
    };

    return map[skill?.skill_col] || "bg-neutral-100 text-neutral-700 hover:bg-black hover:text-white";
  };
    return (
    <>
      <Helmet>
        <title>{certification.nombre} | top.education</title>

        <meta
          name="description"
          content={certification.metadescripcion_certificacion || certification.nombre}
        />
        <meta
          name="keywords"
          content={certification.palabra_clave_certificacion || ""}
        />
        <meta name="author" content="Top Education" />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content={certification.nombre} />
        <meta
          property="og:description"
          content={certification.metadescripcion_certificacion || certification.nombre}
        />
        <meta property="og:type" content="course" />
        <meta
          property="og:url"
          content={`https://top.education/certificacion/${certification.plataforma_certificacion?.nombre?.toLowerCase()}/${certification.slug}`}
        />
        <meta property="og:site_name" content="Top Education" />
        <meta property="og:image" content={certification.imagen_destacada || certificationImage || ""} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={certification.nombre} />
        <meta
          name="twitter:description"
          content={certification.metadescripcion_certificacion || certification.nombre}
        />
        <meta name="twitter:image" content={certification.imagen_destacada || certificationImage || ""} />
        <meta name="twitter:site" content="@TopEducation" />

        <link
          rel="canonical"
          href={`https://top.education/certificacion/${certification.plataforma_certificacion?.nombre?.toLowerCase()}/${certification.slug}`}
        />
      </Helmet>

      <div className="bg-white">
        <div className="relative overflow-hidden bg-white px-2 md:px-4 py-10 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 mx-auto max-w-[1200px] gap-5 lg:grid-cols-12">
            <div className="order-2 space-y-6 lg:order-1 lg:col-span-8">
              <div className={`${sectionCard} p-5 lg:p-8`}>
                <div className="mb-5 flex flex-wrap gap-2">
                  {certificationTypeLabel && (
                    <span className="rounded-full bg-[#1941cf] px-4 py-1.5 font-['Montserrat'] text-[12px] font-bold uppercase tracking-[0.04em] text-white">
                      {certificationTypeLabel}
                    </span>
                  )}

                  {hasSkills && validSkills[0] && (
                    <span className={`rounded-full px-4 py-1.5 font-['Montserrat'] text-[12px] font-bold uppercase tracking-[0.04em] text-white ${validSkills[0].skill_col}`}>
                      {getSkillLabel(validSkills[0])}
                    </span>
                  )}
                </div>

                <h1 className="font-['Montserrat'] text-[2rem] font-bold leading-[1.08em] tracking-[-0.04em] text-[#111111] md:text-[2.7rem]">
                  {certification.nombre}
                </h1>

                {isValidValue(certification.metadescripcion_certificacion) && (
                  <p className={`${sectionSubtitle} mt-5 max-w-[780px]`}>
                    {certification.metadescripcion_certificacion}
                  </p>
                )}

                <div className="mt-4 grid grid-cols-1 gap-4 border-y border-black/10 py-3 sm:grid-cols-3">
                  {isValidValue(certification.lenguaje_certificacion) && (
                    <div>
                      <h6 className={smallLabel}>Idioma</h6>
                      <p className="font-['Montserrat'] text-[15px] font-medium text-neutral-800">
                        {getLanguageLabel(certification.lenguaje_certificacion)}
                      </p>
                    </div>
                  )}

                  {level && (
                    <div>
                      <h6 className={smallLabel}>Nivel</h6>
                      <p className="font-['Montserrat'] text-[15px] font-medium text-neutral-800">
                        {level}
                      </p>
                    </div>
                  )}

                  {isValidValue(certification.tiempo_certificacion) && (
                    <div>
                      <h6 className={smallLabel}>Cronograma</h6>
                      <p className="font-['Montserrat'] text-[15px] font-medium text-neutral-800">
                        {certification.tiempo_certificacion}
                      </p>
                    </div>
                  )}
                </div>

                {isMasterClass && hasValidVideo && (
                  <div className="mt-8 overflow-hidden rounded-[24px]">
                    <YouTubePlayer url={videoUrl} />
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("tab1")}
                    className={`rounded-full px-5 py-2.5 font-['Montserrat'] text-sm font-bold transition-all duration-300 ${
                      activeTab === "tab1"
                        ? "bg-[#111111] text-white"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    Descripción
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("tab2")}
                    className={`rounded-full px-5 py-2.5 font-['Montserrat'] text-sm font-bold transition-all duration-300 ${
                      activeTab === "tab2"
                        ? "bg-[#111111] text-white"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    Instructor/es
                  </button>
                </div>

                <div className="mt-4">
                  {activeTab === "tab1" && (
                    <div className="space-y-3">
                      {aprendizajes.length > 0 && (
                        <div>
                          <h2 className={sectionTitle}>¿Qué aprenderás?</h2>

                          <ul className={`${bodyText} mt-5 list-disc space-y-3 pl-5`}>
                            {aprendizajes.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {(isCoursera || isMasterClass) &&
                        (cantidad || contenidoArr.length > 0) && (
                          <div>
                            <h2 className={sectionTitle}>Contenido de la certificación</h2>

                            <div className="mt-5 space-y-3">
                              {cantidad && <p className={bodyText}>{cantidad}</p>}

                              {contenidoArr.length > 0 && (
                                <ul className={`${bodyText} list-disc space-y-2 pl-5`}>
                                  {contenidoArr.map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        )}

                      {hasSkills && (
                        <div>
                          <h2 className={sectionTitle}>Habilidades que obtendrás</h2>

                          <div className="mt-5 flex flex-wrap gap-2">
                            {validSkills.map((skill, index) => {
                              const label = getSkillLabel(skill);
                              const slugValue = getSkillSlug(skill);
                              const categoryKey = getSkillCategoryKey(skill);

                              return (
                                <button
                                  key={skill.id || index}
                                  type="button"
                                  onClick={() => {
                                    if (slugValue) {
                                      handleItemMenuClick(categoryKey, slugValue);
                                    }
                                  }}
                                  className="rounded-full bg-neutral-100 px-4 py-2 font-['Montserrat'] text-sm font-medium text-neutral-700 transition hover:bg-neutral-900 hover:text-white"
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {isSpecialization && hasSpecializationCourses && (
                        <div>
                          <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                              <h2 className={sectionTitle}>
                                Certificaciones incluidas en esta especialización
                              </h2>

                              {certification?.specialization_detail?.specialization_name && (
                                <p className="mt-1 font-['Montserrat'] text-sm text-neutral-500">
                                  {certification.specialization_detail.specialization_name}
                                </p>
                              )}
                            </div>

                            <span className="shrink-0 rounded-full bg-black px-3 py-1 font-['Montserrat'] text-xs font-bold text-white">
                              {specializationCourses.length} cursos
                            </span>
                          </div>

                          <div className="flex flex-col gap-3">
                            {specializationCourses.map((course, index) => {
                              const path = getCoursePath(course);

                              return (
                                <button
                                  key={course.id || `${course.slug}-${index}`}
                                  type="button"
                                  onClick={() => path && navigateWithTransition(path)}
                                  className="group flex w-full items-center gap-4 rounded-[22px] border border-black/10 bg-white p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)]"
                                >
                                  <div className="relative h-[70px] w-[92px] shrink-0 overflow-hidden rounded-[16px] bg-neutral-100">
                                    <img
                                      src={getCourseImage(course)}
                                      alt={course.nombre}
                                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      loading="lazy"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />

                                    <span className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-0.5 font-['Montserrat'] text-[10px] text-white">
                                      {index + 1}
                                    </span>
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-['Montserrat'] text-[15px] font-bold leading-tight text-black transition group-hover:text-[#1941cf]">
                                      {course.nombre}
                                    </h3>

                                    {isValidValue(course.metadescripcion_certificacion) && (
                                      <p className="mt-1 line-clamp-2 font-['Montserrat'] text-[12px] leading-snug text-neutral-500">
                                        {course.metadescripcion_certificacion}
                                      </p>
                                    )}
                                  </div>

                                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neutral-100 text-black transition group-hover:bg-black group-hover:text-white">
                                    ›
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "tab2" && (
                    <div>
                      {instructoresList.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {instructoresList.map((instructor, index) => (
                            <div
                              key={`${instructor.nombre}-${index}`}
                              className="flex items-center gap-4 rounded-[22px] border border-black/10 bg-white px-2 py-1"
                            >
                              {shouldShowImage(`instructor-${index}`, instructor.imagen) ? (
                                <img
                                  src={instructor.imagen}
                                  alt={instructor.nombre}
                                  className="h-[50px] w-[50px] rounded-full object-cover"
                                  onError={() => hideImage(`instructor-${index}`)}
                                />
                              ) : (
                                <div className="grid h-[50px] w-[50px] place-items-center rounded-full bg-neutral-100 font-['Montserrat'] text-lg font-bold text-neutral-500">
                                  {instructor.nombre.charAt(0)}
                                </div>
                              )}

                              <h3 className="!font-['Montserrat'] text-[14px] font-bold text-black">
                                {instructor.nombre}
                              </h3>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={bodyText}>No hay instructores registrados.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className={`${sectionCard} p-5 lg:p-8`}>
                <h2 className={sectionTitle}>Clases recomendadas para ti</h2>

                <div className="mt-0">
                  <CertificationSlider certification={certification} />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-4">
              <div className={`${sectionCard} overflow-hidden`}>
                {shouldShowImage("certification-main", certificationImage) && (
                  <div className="relative">
                    <img
                      src={certificationImage}
                      className="h-[260px] w-full rounded-2xl object-cover"
                      alt={certification.nombre}
                      onError={() => hideImage("certification-main")}
                    />

                    {certificationTypeLabel && (
                      <span className="absolute right-3 top-3 rounded-full bg-[#1941cf] px-3 py-1 font-['Montserrat'] text-[11px] font-bold text-white">
                        {certificationTypeLabel}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <ul className="mt-3 space-y-2">
                    {platformImage && shouldShowImage("platform", platformImage) && (
                      <li className="border-b border-black/10 pb-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className={smallLabel}>Plataforma</span>

                          <button
                            type="button"
                            onClick={() =>
                              handleItemMenuClick(
                                "Plataforma",
                                certification.plataforma_certificacion?.nombre
                              )
                            }
                            className="transition hover:opacity-70"
                          >
                            <img
                              className="max-h-[34px] max-w-[120px] object-contain"
                              src={platformImage}
                              alt={certification.plataforma_certificacion?.nombre || "Plataforma"}
                              onError={() => hideImage("platform")}
                            />
                          </button>
                        </div>
                      </li>
                    )}

                    {institutionImage && shouldShowImage("institution", institutionImage) && (
                      <li className="border-b border-black/10 pb-1">
                        <div className="mb-1 flex items-center justify-between gap-4">
                          <span className={smallLabel}>{institutionType}</span>

                          <button
                            type="button"
                            onClick={() =>
                              institutionType === "Universidad"
                                ? handleItemMenuClick("Universidad", institutionName)
                                : handleItemMenuClick("Empresa", institutionName)
                            }
                            className="transition hover:opacity-70"
                          >
                            <img
                              className="max-h-[42px] max-w-[150px] object-contain"
                              src={institutionImage}
                              alt={institutionName || "Institución"}
                              onError={() => hideImage("institution")}
                            />
                          </button>
                        </div>

                        {isValidValue(getDescription()) && (
                          <div className="font-['Montserrat'] text-[11px] leading-[1.6em] text-neutral-600">
                            <p>
                              {showFullDescription
                                ? getDescription()
                                : truncateText(getDescription(), MAX_CHARS)}
                            </p>

                            {/*getDescription().length > MAX_CHARS && (
                              <button
                                type="button"
                                onClick={() =>
                                  setShowFullDescription(!showFullDescription)
                                }
                                className="mt-2 font-bold text-neutral-900 hover:underline"
                              >
                                {showFullDescription ? "Leer menos" : "Leer más"}
                              </button>
                            )*/}
                          </div>
                        )}
                      </li>
                    )}

                    {hasSkills && (
                      <li className="border-b border-black/10 pb-3">
                        <span className={smallLabel}>
                          {isMasterClass ? "Habilidades" : "Temas"}
                        </span>

                        <div className="mt-1 flex flex-wrap gap-1">
                          {validSkills.map((skill, index) => {
                            const label = getSkillLabel(skill);
                            const slugValue = getSkillSlug(skill);
                            const categoryKey = getSkillCategoryKey(skill);

                            return (
                              <button
                                key={skill.id || index}
                                type="button"
                                onClick={() => {
                                  if (slugValue) {
                                    handleItemMenuClick(categoryKey, slugValue);
                                  }
                                }}
                                className={`rounded-full px-2 py-1 font-['Montserrat'] text-[10px] font-bold transition ${getSkillColorClass(skill)}`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </li>
                    )}

                    {isValidValue(certification.lenguaje_certificacion) && (
                      <li>
                        <div className="mb-1 flex items-center justify-between">
                          <span className={smallLabel}>Idioma</span>

                          <p className="mt-1 font-['Montserrat'] text-[15px] font-medium text-neutral-800">
                            {getLanguageLabel(certification.lenguaje_certificacion)}
                          </p>
                        </div>
                      </li>
                    )}
                  </ul>

                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const rawUrl = certification.url_certificacion_original;
                        const url = new URL(rawUrl);
                        url.searchParams.delete("connection");
                        window.open(url.toString().replace(/\?$/, ""), "_blank");
                      } catch (e) {
                        window.open(certification.url_certificacion_original, "_blank");
                      }
                    }}
                    className="w-full mt-2 rounded-full bg-[#111111] px-5 py-2.5 font-['Montserrat'] text-sm font-bold text-white transition-all duration-300 hover:bg-black hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                  >
                    Ver en la página oficial
                  </button>
                </div>

                
              </div>
              {visibleContainerPopUp &&
                  (positionPopUp ? (
                    <div className="sticky top-24 !mt-5 !rounded-lg">
                      <button onClick={handleClickButtonPopUp} id="close-pop">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M18 6l-12 12" />
                          <path d="M6 6l12 12" />
                        </svg>
                      </button>

                      <RightPop />
                    </div>
                  ) : (
                    <div className="sticky top-24 mt-5">
                      <RightPop />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificationPage;