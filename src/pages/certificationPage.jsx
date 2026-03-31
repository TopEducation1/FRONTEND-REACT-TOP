import React, { useEffect, useState } from "react";
import { getLanguageLabel } from "../utils/languageMapper";
import { getLevelLabel } from "../utils/levelMapper";
import { useParams, useNavigate } from "react-router-dom";
import getCertificationById from "../services/getCertificationById";
import RightPop from "../components/RightPop";
import YouTubePlayer from "../components/YoutubePlayer";
import CertificationSlider from "../components/CertificationSlider";
import { Helmet } from "react-helmet";

const CertificationPage = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("tab1");
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [countSkills, setSkillsCount] = useState(0);
  const [positionPopUp, SetPositionPopUp] = useState(false);
  const [visibleContainerPopUp, setVisibleContainerPopUp] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();

  const MAX_CHARS = 400;

const getDescription = () => {
  return (
    certification.universidad_certificacion?.descripcion_institucion ||
    certification.empresa_certificacion?.descripcion_institucion ||
    ""
  );
};

const truncateText = (text, max) => {
  if (!text) return "";
  return text.length > max ? text.substring(0, max) + "..." : text;
};

  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
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

  useEffect(() => {
    const handleRezise = () => {
      SetPositionPopUp(window.innerWidth < 1200);
    };

    window.addEventListener("resize", handleRezise);
    handleRezise();

    return () => {
      window.removeEventListener("resize", handleRezise);
    };
  }, []);

  const handleClickButtonPopUp = () => {
    setVisibleContainerPopUp(false);
  };

  useEffect(() => {
    const loadCertification = async () => {
      try {
        setLoading(true);
        const data = await getCertificationById(slug);
        setCertification(data);
        console.log("INFORMACIÓN ESPECIFICA DE LA CERTIFICACION");
        console.log(data);
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

  const getImageUrl = (url) => {
    if (!url) return null;
    return url;
  };

  const getSkillLabel = (skill) => {
    if (!skill) return "";
    if (typeof skill === "string") return skill;
    return skill.translate || skill.nombre || skill.slug || "";
  };

  const getSkillCategoryKey = (skill) => {
    const raw = (skill?.skill_type || "").toString().trim().toLowerCase();

    if (["tema", "category", "principal"].includes(raw)) return "Tema";
    if (["habilidad", "skill", "subskill", "secondary"].includes(raw)) return "Habilidad";

    return "Habilidad";
  };

  const getSkillSlug = (skill) => {
    if (!skill) return "";
    if (typeof skill === "string") return "";
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
          .filter((skill) => getSkillLabel(skill))
      : [];

    if (relationSkills.length > 0) return relationSkills;

    const raw = certification?.habilidades_certificacion;

    const toText = (x) => {
      if (typeof x === "string") return x;
      if (x && typeof x === "object") return String(x.nombre ?? x.name ?? "");
      return "";
    };

    const baseList = Array.isArray(raw) ? raw.map(toText) : [toText(raw)];

    return baseList
      .flatMap((t) => String(t).split(","))
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name, index) => ({
        id: `legacy-${index}`,
        nombre: name,
        translate: "",
        slug: "",
        skill_type: "habilidad",
        skill_col: "",
      }));
  })();

  useEffect(() => {
    if (Array.isArray(allSkills)) {
      const rows = Math.ceil(allSkills.length / 4);
      setSkillsCount(rows);
    }
  }, [certification]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen py-4">
        <svg
          className="animate-spin h-6 w-6 text-neutral-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="ml-2 text-neutral-700">Cargando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[100vh] w-full justify-items-center items-center">
        <div className="text-white font-bold text-[40px] m-auto">Error: {error}</div>
      </div>
    );
  }

  if (!certification) {
    return (
      <div className="flex h-[100vh] w-full justify-items-center items-center">
        <div className="text-white font-bold text-[40px] m-auto">
          No se encontró la certificación
        </div>
      </div>
    );
  }

  const handleItemMenuClick = (category, value) => {
    if (!category || !value) return;

    const query = `${category}=${encodeURIComponent(value)}&page=1&page_size=15`;
    navigateWithTransition(`/explora?${query}`);
  };

  const level = getLevelLabel(certification?.nivel_certificacion);
  const isCoursera =
    certification?.plataforma_certificacion?.nombre?.toString().trim().toLowerCase() ===
    "coursera";

  const contenidoObj = certification?.contenido_certificacion;
  const contenidoArr = Array.isArray(contenidoObj?.contenido_certificacion)
    ? contenidoObj.contenido_certificacion
        .map((x) => (x ?? "").toString().trim())
        .filter(Boolean)
    : [];

  const cantidad = (contenidoObj?.cantidad_modulos ?? "").toString().trim();

  const isMasterClass =
    certification?.plataforma_certificacion?.nombre === "MasterClass";

  const videoUrl = certification?.video_certificacion?.url;

  const hasValidVideo =
    videoUrl &&
    typeof videoUrl === "string" &&
    !["null", "none"].includes(videoUrl.trim().toLowerCase());

  const instructorsDetailed = certification?.instructores_detalle_certificacion;
  const instructorsLegacy = certification?.instructores_certificacion;

  const instructoresList = (() => {
    // 1) Prioridad: nueva relación con imagen + nombre
    if (Array.isArray(instructorsDetailed) && instructorsDetailed.length > 0) {
      return instructorsDetailed
        .map((item) => {
          const nombre = (item?.nombre || item?.name || "").toString().trim();
          const imagen = (item?.imagen || item?.image || "").toString().trim();

          if (!nombre) return null;

          return {
            nombre,
            imagen,
            source: "relation",
          };
        })
        .filter(Boolean);
    }

    // 2) Fallback: campo legacy
    if (!instructorsLegacy) return [];

    if (Array.isArray(instructorsLegacy)) {
      return instructorsLegacy
        .map((x) => {
          const nombre = (x?.name ?? x?.nombre ?? x ?? "").toString().trim();
          if (!nombre) return null;

          return {
            nombre,
            imagen: "",
            source: "legacy",
          };
        })
        .filter(Boolean);
    }

    if (typeof instructorsLegacy === "string") {
      const t = instructorsLegacy.trim();
      if (!t || ["none", "null"].includes(t.toLowerCase())) return [];

      return t
        .replace(/\s*(?:&| and | y )\s*/gi, ",")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((nombre) => ({
          nombre,
          imagen: "",
          source: "legacy",
        }));
    }

    return [];
  })();

  return (
    <>
      <Helmet>
        <title>{certification.nombre}</title>
        <meta
          name="description"
          content={certification.metadescripcion_certificacion}
        />
        <meta
          property="og:title"
          content={certification.metadescripcion_certificacion}
        />
        <meta
          name="keywords"
          content={certification.palabra_clave_certificacion}
        />
        <meta name="author" content="Top Education" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:description"
          content={certification.metadescripcion_certificacion}
        />
        <meta property="og:type" content="website" />

        <title>{certification.nombre} | top.education</title>
        <meta
          name="description"
          content={certification.metadescripcion_certificacion}
        />
        <meta
          name="keywords"
          content={certification.palabra_clave_certificacion}
        />
        <meta name="author" content="Top Education" />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content={certification.nombre} />
        <meta
          property="og:description"
          content={certification.metadescripcion_certificacion}
        />
        <meta property="og:type" content="course" />
        <meta
          property="og:url"
          content={`https://top.education/certificacion/${certification.plataforma_certificacion.nombre.toLowerCase()}/${certification.slug}`}
        />
        <meta property="og:site_name" content="Top Education" />
        <meta property="og:image" content={certification.imagen_destacada} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={certification.nombre} />
        <meta
          name="twitter:description"
          content={certification.metadescripcion_certificacion}
        />
        <meta name="twitter:image" content={certification.imagen_destacada} />
        <meta name="twitter:site" content="@TopEducation" />

        <link
          rel="canonical"
          href={`https://top.education/certificacion/${certification.plataforma_certificacion.nombre.toLowerCase()}/${certification.slug}`}
        />
      </Helmet>

      <div className="w-full bg-[#F6F4EF] relative">
        <div className="container  mx-auto py-25 md:py-50px lg:py-60px 2xl:py-100px ">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-start-1 lg:col-span-8 space-y-[35px]  order-2 md:order-1">
              <div className="container-main-info pb-8 border-1 bg-[#F2F0E8] border-[#ECECEC] rounded-[15px] z-1">
                <div className="cert-int px-3 lg:px-7 pt-3 lg:pt-8">
                  <h1 className="text-[2rem] md:text-4xl mb-2 font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-10 md:leading-10 aos-init aos-animate">
                    {certification.nombre}
                  </h1>
                  <p className="text-sm md:text-lg text-contentColor dark:contentColor-dark mb-25px !leading-[1.2em] aos-init aos-animate">
                    {certification.metadescripcion_certificacion}
                  </p>
                  <div className="border-b border-[#E5E5E5] pb-[25px] flex flex-wrap lg:flex-nowrap items-start gap-[10px] lg:gap-[40px] xs:gap-[20px] mt-5 mb-[20px]">
                    <div className="flex w-1/1 lg:w-2/8 items-start gap-[10px] border-l border-[#CDCDCD] first:border-none pl-[10px] first:pl-0">
                      <div>
                        <h6 className="font-bold text-edblue leading-[1.2]">Idioma:</h6>
                        <p className="text-[14px] text-edgray leading-[1.1em]">
                          {getLanguageLabel(certification.lenguaje_certificacion)}
                        </p>
                      </div>
                    </div>

                    {level && (
                      <div className="flex w-1/1 lg:w-3/8 items-start gap-[10px] border-l border-[#CDCDCD] first:border-none pl-[10px] first:pl-0">
                        <div>
                          <h6 className="font-bold text-edblue leading-[1.2]">Nivel:</h6>
                          <p className="text-[14px] text-edgray leading-[1.1em]">
                            {level}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex w-1/1 lg:w-3/8 items-center gap-[10px] border-l border-[#CDCDCD] first:border-none pl-[10px] first:pl-0">
                      <div>
                        <h6 className="font-bold text-edblue leading-[1.2]">Cronograma:</h6>
                        <p className="text-[14px] text-edgray leading-[1.1em]">
                          {certification.tiempo_certificacion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {isMasterClass && hasValidVideo && (
                  <div className="px-8 py-1 w-full cert-video rounded-xl overflow-hidden">
                    <YouTubePlayer url={videoUrl} />
                  </div>
                )}

                <div className="nav-tab-wrapper px-3 lg:px-7  w-full">
                  <ul
                    id="tabs-nav"
                    className="flex flex-wrap course-tab mb-4 w-auto overflow-x-auto"
                  >
                    <li>
                      <a
                        className={`flex text-[1.1rem] px-2 lg:px-4 py-1 lg:py-2 rounded ${
                          activeTab === "tab1" ? "bg-blue-500 text-white" : "bg-gray-300"
                        }`}
                        onClick={() => setActiveTab("tab1")}
                      >
                        Descripción
                      </a>
                    </li>
                    <li>
                      <a
                        className={`flex text-[1.1rem] px-2 lg:px-4 py-1 lg:py-2 rounded ${
                          activeTab === "tab2" ? "bg-blue-500 text-white" : "bg-gray-300"
                        }`}
                        onClick={() => setActiveTab("tab2")}
                      >
                        Instructor/es
                      </a>
                    </li>
                  </ul>

                  <div className="w-full">
                    {activeTab === "tab1" && (
                      <div className="cert-cont w-full">
                        <h2 className="text-[1.7rem] md:text-[1.5rem] font-bold mb-3 text-blackColor dark:text-blackColor-dark mb-15px leading-8 md:leading-8 aos-init aos-animate">
                          ¿Qué aprenderás?
                        </h2>

                        {Array.isArray(certification?.aprendizaje_certificacion) &&
                          certification.aprendizaje_certificacion.length > 0 &&
                          certification.aprendizaje_certificacion[0]?.nombre !== "NONE" &&
                          !certification.aprendizaje_certificacion.some((aprendizaje) =>
                            aprendizaje.nombre?.startsWith("x")
                          ) && (
                            <ul className="ml-10 mt-5 list-disc">
                              {certification.aprendizaje_certificacion
                                .filter(
                                  (aprendizaje) =>
                                    aprendizaje?.nombre &&
                                    aprendizaje.nombre.trim() !== "" &&
                                    !aprendizaje.nombre.startsWith(" ")
                                )
                                .map((aprendizaje, index) => (
                                  <li key={index}>{aprendizaje.nombre}</li>
                                ))}
                            </ul>
                          )}

                        {(isCoursera || isMasterClass) &&
                          (cantidad || contenidoArr.length > 0) && (
                            <div className="space-y-2">
                              {cantidad && cantidad !== "NONE" && (
                                <p className="text-[1rem]">{cantidad}</p>
                              )}

                              {contenidoArr.length > 0 && (
                                <ul className="text-[1rem] list-disc pl-5 space-y-1">
                                  {contenidoArr.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                          <h2 className="text-[1.7rem] md:text-[1.5rem] font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-8 md:leading-8 aos-init aos-animate my-5">
                          Habilidades que obtendrás
                        </h2>

                        
                          <div className="flex flex-wrap gap-2">
                            {certification?.habilidades_certificacion?.flatMap((item, idxItem) => {
                              const habilidades = (item?.nombre || "")
                                .split(",")
                                .map((h) => h.trim())
                                .filter(Boolean);

                              return habilidades.map((habilidad, index) => (
                                <div
                                  key={`${idxItem}-${index}`}
                                  className="bg-black text-white w-auto px-3 py-1 rounded-full"
                                >
                                  {habilidad}
                                </div>
                              ));
                            })}
                          </div>
                      </div>
                    )}

                    {activeTab === "tab2" && (
                      <div id="widgets-learning-masterclass" className="w-full">
                        {instructoresList.length > 0 && (
                          <div>
                            
                            <div className="text-black w-full mt-3">
                              <div className="flex flex-col gap-3">
                                {instructoresList.map((instructor, idx) => (
                                  <div
                                    key={`${instructor.nombre}-${idx}`}
                                    className="flex items-center gap-3"
                                  >
                                    <img
                                      className="w-[42px] h-[42px] rounded-full object-cover border border-neutral-200"
                                      src={
                                        instructor.imagen && instructor.imagen.trim() !== ""
                                          ? instructor.imagen
                                          : "/assets/content/icons/user-te.png"
                                      }
                                      alt={instructor.nombre}
                                    />
                                    <div className="text-[15px] text-black">
                                      {instructor.nombre}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:col-start-1 lg:col-span-12 border-1 bg-[#F2F0E8] border-[#ECECEC] rounded-[15px] px-3 py-3 lg:p-8 z-1 order-3 ">
                <h2 className="text-[1.7rem] md:text-[1.5rem] font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-8 md:leading-8 aos-init aos-animate">
                  Clases recomendadas para ti
                </h2>
                <div>
                  <CertificationSlider />
                </div>
              </div>
            </div>

            <div className="lg:col-start-9 lg:col-span-4 br-15 border-1 bg-[#F2F0E8] border-[#ECECEC] rounded-[15px] z-1 order-1 md:order-2">
              <div className="cert-img relative">
                <img
                  src={getImageUrl(
                    certification.imagen_final ||
                      certification.universidad_certificacion?.univ_img ||
                      certification.empresa_certificacion?.empr_img
                  )}
                  className="rounded-xl overflow-hidden"
                  alt="Logo de la certificación"
                />
                <div className="absolute top-2 right-0 rounded-[25px_0px_0px_25px] text-[16px] font-bold text-black bg-[#F6F4EF] px-3 py-0.5 text-xs">
                  {certification.tipo_certificacion === "Curso"
                    ? "Certificación"
                    : certification.tipo_certificacion}
                </div>
              </div>

              <div className="cert-det p-5 relative">
                <div className="w-full flex justify-center">
                  <button
                    onClick={() =>
                      window.open(certification.url_certificacion_original, "_blank")
                    }
                    className="btn btn-col-1 font-bold mt-[-40px] mb-2 py-2 px-4 rounded-full"
                  >
                    Ver en la página oficial
                  </button>
                </div>

                <ul className="list">
                  <li className="flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                    <div className="flex-1 space-x-3 flex">
                      <div className="text-black font-semibold">Plataforma</div>
                    </div>
                    <div className="flex justify-end items-center">
                      <a
                        className="cursor-pointer"
                        onClick={() =>
                          handleItemMenuClick(
                            "Plataforma",
                            certification.plataforma_certificacion.nombre
                          )
                        }
                      >
                        <img
                          className="max-w-[100px] max-h-[50px]"
                          src={certification.plataforma_certificacion.plat_img}
                          alt=""
                        />
                      </a>
                    </div>
                  </li>

                  {(certification.universidad_certificacion?.univ_img ||
                    certification.empresa_certificacion?.empr_img) && (
                    <li className="flex flex-col space-y-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 last:mb-0 last:border-0">

                        {/* HEADER */}
                        <div className="flex justify-between items-center">
                        <div className="text-black font-semibold">
                            {certification.universidad_certificacion?.univ_img
                            ? "Universidad"
                            : certification.empresa_certificacion?.empr_img
                            ? "Empresa"
                            : ""}
                        </div>

                        {(certification.universidad_certificacion?.univ_img ||
                            certification.empresa_certificacion?.empr_img) && (
                            <div>
                            <a
                                className="cursor-pointer w-auto flex items-center rounded-[5px] max-h-[30px] hover:opacity-80 transition"
                                onClick={() =>
                                certification.universidad_certificacion?.nombre
                                    ? handleItemMenuClick(
                                        "Universidad",
                                        certification.universidad_certificacion.nombre
                                    )
                                    : certification.empresa_certificacion?.nombre
                                    ? handleItemMenuClick(
                                        "Empresa",
                                        certification.empresa_certificacion.nombre
                                    )
                                    : null
                                }
                            >
                                <img
                                className="max-w-[150px] m-2 w-full"
                                src={getImageUrl(
                                    certification.universidad_certificacion?.univ_img ||
                                    certification.empresa_certificacion?.empr_img
                                )}
                                alt="imagen-certificacion"
                                />
                            </a>
                            </div>
                        )}
                        </div>

                        {/* DESCRIPCIÓN */}
                        {(certification.universidad_certificacion?.descripcion_institucion ||
                        certification.empresa_certificacion?.descripcion_institucion) && (
                        <div className="text-[12px] text-neutral-700 leading-[1.1em]">

                            <p>
                            {showFullDescription
                                ? getDescription()
                                : truncateText(getDescription(), MAX_CHARS)}
                            </p>

                            {/* BOTÓN LEER MÁS */}
                            {getDescription().length > MAX_CHARS && (
                            <button
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                className="mt-0 text-neutral-600 font-medium hover:underline transition"
                            >
                                {showFullDescription ? "Leer menos" : "Leer más"}
                            </button>
                            )}
                        </div>
                        )}
                    </li>
                    )}

                  <li className="flex flex-wrap space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                    <div className="flex-1 space-x-3 flex">
                      <div className="text-black font-semibold">
                        {certification.plataforma_certificacion.nombre !== "MasterClass"
                          ? "Temas:"
                          : "Habilidades:"}
                      </div>
                    </div>

                    <div className={`flex-none max-w-[100%] flex ${
                        allSkills.length > 2 && "mt-[-20px]"
                      } flex-wrap justify-end gap-1`}>
                      {Array.isArray(allSkills) && allSkills.length > 0 ? (
                        allSkills.map((skill, index) => {
                          const label = getSkillLabel(skill);
                          const slugValue = getSkillSlug(skill);
                          const categoryKey = getSkillCategoryKey(skill);

                          return (
                            <a
                              key={skill.id || index}
                              className="cursor-pointer"
                              onClick={() => {
                                if (slugValue) {
                                  handleItemMenuClick(categoryKey, slugValue);
                                }
                              }}
                            >
                              <div
                                className={`tag-category ${
                                  skill.skill_col || "tag-verde"
                                } ${
                                  allSkills.length > 1 && index === 0 ? "ml-[50px]" : ""
                                }`}
                              >
                                {label}
                              </div>
                            </a>
                          );
                        })
                      ) : certification.tema_certificacion?.nombre ? (
                        <a
                          className="cursor-pointer"
                          onClick={() =>
                            handleItemMenuClick(
                              certification.tema_certificacion.tem_type || "Tema",
                              certification.tema_certificacion.slug ||
                                certification.tema_certificacion.nombre
                            )
                          }
                        >
                          <div
                            className={`tag-category ${
                              certification.tema_certificacion.tem_col || "tag-verde"
                            } mt-[15px]`}
                          >
                            {certification.tema_certificacion.nombre}
                          </div>
                        </a>
                      ) : null}
                    </div>
                  </li>

                  <li className="flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                    <div className="flex-1 space-x-3 flex">
                      <div className="text-black font-semibold">Idioma:</div>
                    </div>
                    <div className="flex-none">
                      {getLanguageLabel(certification.lenguaje_certificacion)}
                    </div>
                  </li>
                </ul>
              </div>

              {visibleContainerPopUp &&
                (positionPopUp ? (
                  <div className="container-pop-up-responsive !rounded-lg">
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
                        className="icon icon-tabler icons-tabler-outline icon-tabler-x"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6l-12 12" />
                        <path d="M6 6l12 12" />
                      </svg>
                    </button>
                    <RightPop />
                  </div>
                ) : (
                  <RightPop />
                ))}
            </div>

            
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificationPage;