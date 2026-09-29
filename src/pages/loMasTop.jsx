import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import ScrollReveal from "../components/ScrollReveal";
import SearchLMT from "../components/SearchLMT";
import RankingsGrid from "../components/RankingsGrid";
import Seo from "../components/Seo";

import endpoints from "../config/api";

const RankingsPreviewSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-5 pt-10 text-sm md:grid-cols-3 lg:pt-20">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="min-h-[330px] animate-pulse rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
        >
          <div className="mb-8 h-6 w-[75%] rounded-full bg-neutral-200" />

          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, itemIndex) => (
              <div key={itemIndex} className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-neutral-200" />
                <div className="h-[35px] w-[35px] rounded-full bg-neutral-200" />
                <div className="h-4 flex-1 rounded-full bg-neutral-200" />
              </div>
            ))}
          </div>

          <div className="mt-8 h-4 w-[55%] rounded-full bg-neutral-200" />
        </div>
      ))}
    </div>
  );
};

export default function LoMasTop() {
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [universidadesLatam, setUniversidadesLatam] = useState([]);

  const [rankingName1, setRankingName1] = useState("");
  const [rankingName2, setRankingName2] = useState("");
  const [rankingName3, setRankingName3] = useState("");

  const [rankingName1Slug, setRankingName1Slug] = useState("");
  const [rankingName2Slug, setRankingName2Slug] = useState("");
  const [rankingName3Slug, setRankingName3Slug] = useState("");

  const [selectedTags, setSelectedTags] = useState({});
  const [limit, setLimit] = useState(5);
  const [rankingsLoading, setRankingsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const calcLimit = () =>
      window.matchMedia("(max-width: 767px)").matches ? 5 : 5;

    setLimit(calcLimit());

    let tid;
    const onResize = () => {
      clearTimeout(tid);
      tid = setTimeout(() => setLimit(calcLimit()), 150);
    };

    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const toSlug = (str = "") =>
      str
        .toLowerCase()
        .replace(/\s+/g, "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const loadRankings = async () => {
      setRankingsLoading(true);

      try {
        const [universidadesData, empresasData, universidData] =
          await Promise.all([
            fetch(endpoints.ranking_preview("Top-50-de-universidades")).then(
              (res) => res.json()
            ),
            fetch(endpoints.ranking_preview("Top-50-de-empresas")).then((res) =>
              res.json()
            ),
            fetch(endpoints.ranking_preview("Top-50-Universidades-Latam")).then(
              (res) => res.json()
            ),
          ]);

        if (universidadesData?.nombre) {
          setRankingName1(universidadesData.nombre);
          setRankingName1Slug(toSlug(universidadesData.nombre));

          const items =
            universidadesData.entradas_preview || universidadesData.entradas || [];

          setUniversidades(
            items
              .filter((e) => e.universidad || e.entidad_tipo === "universidad")
              .map((e) => ({
                nombre: e.universidad?.nombre || e.nombre,
                univ_ico: e.universidad?.univ_ico || e.icono,
                id: e.universidad?.id || e.entidad_id,
                ...e,
              }))
          );
        }

        if (empresasData?.nombre) {
          setRankingName2(empresasData.nombre);
          setRankingName2Slug(toSlug(empresasData.nombre));

          const items =
            empresasData.entradas_preview || empresasData.entradas || [];

          setEmpresas(
            items
              .filter((e) => e.empresa || e.entidad_tipo === "empresa")
              .map((e) => ({
                nombre: e.empresa?.nombre || e.nombre,
                empr_ico: e.empresa?.empr_ico || e.icono,
                id: e.empresa?.id || e.entidad_id,
                ...e,
              }))
          );
        }

        if (universidData?.nombre) {
          setRankingName3(universidData.nombre);
          setRankingName3Slug(toSlug(universidData.nombre));

          const items =
            universidData.entradas_preview || universidData.entradas || [];

          setUniversidadesLatam(
            items
              .filter((e) => e.universidad || e.entidad_tipo === "universidad")
              .map((e) => ({
                nombre: e.universidad?.nombre || e.nombre,
                univ_ico: e.universidad?.univ_ico || e.icono,
                id: e.universidad?.id || e.entidad_id,
                ...e,
              }))
          );
        }
      } catch (err) {
        console.error("Error cargando rankings:", err);
      } finally {
        setRankingsLoading(false);
      }
    };

    loadRankings();
  }, []);

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

  const renderItems = (items, title) => {
    if (!Array.isArray(items)) {
      return <p>No hay datos disponibles</p>;
    }

    return items
      .filter((item) => item.empr_ico || item.univ_ico)
      .slice(0, limit)
      .map((item, i) => {
        const imgSrc = item.empr_ico || item.univ_ico;

        return (
          <Link
            key={`${title}-${item.id || item.nombre}-${i}`}
            to="#"
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-[rgba(25,65,207,0.04)]"
            onClick={(e) => {
              e.preventDefault();
              handleItemMenuClick({
                [title]: item.nombre,
              });
            }}
          >
            <span className="-ml-2 mr-[-17px] rounded-[25px_0px_0px_25px] bg-white py-1 pl-3 pr-4 font-[Montserrat] text-[14px] font-bold text-[#0F090B]">
              {i + 1}
            </span>

            <img
              className="h-[35px] w-[35px] rounded-full object-contain shadow-sm"
              src={imgSrc}
              alt={item.nombre}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <span className="flex-1 font-[Montserrat] text-sm leading-tight text-[#3a3540] transition-colors group-hover:text-[#0F090B]">
              {item.nombre}
            </span>
          </Link>
        );
      });
  };

  return (
    <>
      <Seo
        title="Rankings de universidades, empresas y certificaciones"
        description="Explora rankings de universidades, empresas y certificaciones para encontrar oportunidades de formación, comparar instituciones y elegir tu próxima ruta de aprendizaje."
        canonicalPath="/lo-mas-top"
      />

      {/* ======================================================= */}
      {/* HERO */}
      {/* ======================================================= */}

      <section
        className="
          relative
          overflow-hidden
          bg-gradient-to-b
          from-[#111111]
          via-[#1c1c1c]
          to-[#252525]
          px-5
          py-20
          md:py-28
          lg:min-h-[720px]
          lg:px-10
          lg:py-32
        "
      >
        {/* Decoración */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[-280px]
            h-[650px]
            w-[650px]
            -translate-x-1/2
            rounded-full
            bg-[#1941cf]/20
            blur-[160px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-300px]
            right-[-180px]
            h-[600px]
            w-[600px]
            rounded-full
            bg-[#5CC781]/10
            blur-[150px]
          "
        />

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[520px]
            max-w-[1180px]
            items-center
          "
        >
          <div
            className="
              grid
              w-full
              grid-cols-1
              items-center
              gap-10
              lg:grid-cols-12
              lg:gap-14
            "
          >
            {/* Título */}

            <ScrollReveal
              className="lg:col-span-3"
              distance={55}
              duration={850}
            >
              <h1
                className="
                  text-center
                  font-[Lora]
                  text-[4rem]
                  font-normal
                  leading-[1.2em]
                  tracking-[-0.05em]
                  text-[#F6F4EF]
                  sm:text-[5rem]
                  lg:text-left
                  lg:text-[6rem]
                  xl:text-[7rem]
                "
              >
                Lo más

                <br />

                <span
                  className="
                    font-te-it
                    text-[6rem]
                    text-white
                    sm:text-[8rem]
                    lg:text-[9rem]
                    xl:text-[10rem]
                  "
                >
                  Top!
                </span>
              </h1>
            </ScrollReveal>


            {/* Search */}

            <ScrollReveal
              className="lg:col-span-9"
              delay={120}
              distance={55}
              duration={850}
            >
              <div className="lg:pl-5">
                <h2
                  className="
                    text-center
                    !font-['Montserrat']
                    text-[1.8rem]
                    font-semibold
                    leading-[1.15em]
                    tracking-[-0.03em]
                    text-[#F6F4EF]
                    md:text-[2.2rem]
                    lg:text-left
                    lg:text-[2.5rem]
                  "
                >
                  Encuentra tu próxima certificación
                </h2>

                <p
                  className="
                    mx-auto
                    mt-4
                    max-w-[650px]
                    text-center
                    font-['Montserrat']
                    text-[1rem]
                    leading-[1.7em]
                    text-[#a8a8a8]
                    md:text-[1.1rem]
                    lg:mx-0
                    lg:text-left
                  "
                >
                  Descubre oportunidades de formación diseñadas
                  para el futuro. Prepárate y da el siguiente paso
                  en tu carrera profesional.
                </p>

                <div className="mt-8">
                  <SearchLMT />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* ======================================================= */}
      {/* INTRO RANKINGS */}
      {/* ======================================================= */}

      <section
        className="
          relative
          overflow-hidden
          bg-white
          px-5
          pb-8
          pt-20
          md:pt-28
          lg:px-10
          lg:pt-32
        "
      >
        <ScrollReveal
          className="mx-auto max-w-[900px]"
          distance={50}
        >
          <div className="text-center">
            <span
              className="
                inline-flex
                rounded-full
                bg-[#1941cf]/10
                px-4
                py-2
                font-['Montserrat']
                text-[11px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#1941cf]
              "
            >
              Descubre los mejores
            </span>

            <h3
              className="
                mt-5
                text-center
                font-te
                text-[3rem]
                leading-[1em]
                tracking-[-0.04em]
                text-[#0F090B]
                md:text-[4rem]
                lg:text-[5rem]
              "
            >
              <span className="text-[#034694]">
                Rankings
              </span>

              <br />

              de lo más{" "}

              <span className="font-te-it">
                Top!
              </span>
            </h3>

            <p
              className="
                mx-auto
                mt-6
                max-w-[680px]
                font-['Montserrat']
                text-[1rem]
                leading-[1.7em]
                text-[#3a3540]/75
                md:text-[1.1rem]
              "
            >
              Más de 250,000 reseñas escritas por usuarios
              te ayudan a elegir los mejores cursos.
            </p>
          </div>
        </ScrollReveal>
      </section>


      {/* ======================================================= */}
      {/* RANKINGS PREVIEW */}
      {/* ======================================================= */}

      <section
        className="
          relative
          bg-white
          px-5
          pb-24
          pt-8
          lg:px-10
          lg:pb-32
          lg:pt-12
        "
      >
        <div className="mx-auto max-w-[1180px]">

          {rankingsLoading ? (

            <RankingsPreviewSkeleton />

          ) : (

            <div
              className="
                grid
                grid-cols-1
                gap-5
                text-sm
                md:grid-cols-3
              "
            >

              {/* ================================================= */}
              {/* UNIVERSIDADES */}
              {/* ================================================= */}

              <ScrollReveal
                delay={0}
                distance={45}
              >
                <div
                  className="
                    h-full
                    rounded-[24px]
                    border
                    border-black/[0.07]
                    bg-white
                    p-6
                    shadow-[0_18px_50px_rgba(0,0,0,0.05)]
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_22px_60px_rgba(0,0,0,0.08)]
                  "
                >
                  <h4
                    className="
                      mb-5
                      font-[Montserrat]
                      text-base
                      font-semibold
                      text-[#0F090B]
                    "
                  >
                    {rankingName1}
                  </h4>

                  <div className="flex flex-wrap gap-1">
                    {renderItems(
                      universidades,
                      "Universidad"
                    )}
                  </div>

                  <Link
                    className="
                      mt-5
                      flex
                      items-center
                      gap-1.5
                      text-xs
                      font-semibold
                      text-[#2563EB]
                      transition-colors
                      hover:text-[#1941CF]
                    "
                    to={`/lo-mas-top/ranking/${rankingName1Slug}`}
                  >
                    Ver el top de universidades →
                  </Link>
                </div>
              </ScrollReveal>


              {/* ================================================= */}
              {/* LATAM */}
              {/* ================================================= */}

              <ScrollReveal
                delay={100}
                distance={45}
              >
                <div
                  className="
                    h-full
                    rounded-[24px]
                    border
                    border-black/[0.07]
                    bg-white
                    p-6
                    shadow-[0_18px_50px_rgba(0,0,0,0.05)]
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_22px_60px_rgba(0,0,0,0.08)]
                  "
                >
                  <h4
                    className="
                      mb-5
                      font-[Montserrat]
                      text-base
                      font-semibold
                      text-[#0F090B]
                    "
                  >
                    {rankingName3}
                  </h4>

                  <div className="flex flex-wrap gap-1">
                    {renderItems(
                      universidadesLatam,
                      "Universidad"
                    )}
                  </div>

                  <Link
                    className="
                      mt-5
                      flex
                      items-center
                      gap-1.5
                      text-xs
                      font-semibold
                      text-[#2563EB]
                      transition-colors
                      hover:text-[#1941CF]
                    "
                    to={`/lo-mas-top/ranking/${rankingName3Slug}`}
                  >
                    Ver el top de universidades →
                  </Link>
                </div>
              </ScrollReveal>


              {/* ================================================= */}
              {/* EMPRESAS */}
              {/* ================================================= */}

              <ScrollReveal
                delay={200}
                distance={45}
              >
                <div
                  className="
                    h-full
                    rounded-[24px]
                    border
                    border-black/[0.07]
                    bg-white
                    p-6
                    shadow-[0_18px_50px_rgba(0,0,0,0.05)]
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_22px_60px_rgba(0,0,0,0.08)]
                  "
                >
                  <h4
                    className="
                      mb-5
                      font-[Montserrat]
                      text-base
                      font-semibold
                      text-[#0F090B]
                    "
                  >
                    {rankingName2}
                  </h4>

                  <div className="flex flex-wrap gap-1">
                    {renderItems(
                      empresas,
                      "Empresa"
                    )}
                  </div>

                  <Link
                    className="
                      mt-5
                      flex
                      items-center
                      gap-1.5
                      text-xs
                      font-semibold
                      text-[#2563EB]
                      transition-colors
                      hover:text-[#1941CF]
                    "
                    to={`/lo-mas-top/ranking/${rankingName2Slug}`}
                  >
                    Ver el top de empresas →
                  </Link>
                </div>
              </ScrollReveal>

            </div>
          )}

        </div>
      </section>


      {/* ======================================================= */}
      {/* GRID COMPLETO */}
      {/* ======================================================= */}

      <ScrollReveal
        distance={55}
        duration={800}
        threshold={0.05}
      >
        <RankingsGrid />
      </ScrollReveal>
    </>
  );
}