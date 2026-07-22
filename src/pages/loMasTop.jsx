import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import HorizontalScroll from "../components/HorizontalScroll";
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

      <section className="h-full w-screen flex-shrink-0 bg-gradient-to-t from-transparent to-[#1c1c1c]">
        <HorizontalScroll>
          <div className="flex w-[100vw] items-center justify-center px-5">
            <div className="m-auto flex max-w-[100vw] flex-wrap lg:max-w-[1080px]">
              <h1 className="relative z-10 block w-full text-center font-[Lora] text-[4rem] font-normal leading-[1.5em] text-[#F6F4EF] sm:text-[5rem] md:text-[5rem] lg:w-[30%] lg:text-left lg:text-[5rem] xl:text-[6rem]">
                Lo más <br />
                <span className="font-te-it text-[8rem] lg:text-[10rem]">
                  Top!
                </span>
              </h1>

              <div className="w-full lg:w-[70%] lg:pl-10">
                <h2 className="relative !font-['Montserrat'] font-semibold z-10 mt-2 text-center font-[Lora] text-[1.7rem] leading-[1em] text-[#F6F4EF] lg:text-left lg:text-[2.125rem]">
                  Encuentra tu próxima certificación
                </h2>

                <p className="relative z-10 mt-2 text-center text-[1.125rem] text-[#a8a8a8] lg:text-left">
                  Descubre oportunidades de formación diseñadas para el futuro.
                  Prepárate y da el siguiente paso en tu carrera profesional.
                </p>

                <SearchLMT />
              </div>
            </div>
          </div>

          <div className="w-[100vw] px-10">
            <div className="m-auto flex max-w-[100vw] flex-wrap justify-center pt-90 lg:pt-70">
              <div>
                <h3 className="mb-[-10px] text-center font-te text-[3rem] leading-[1.2em] text-[#0F090B] md:text-[4rem]">
                  <span className="text-[4rem] text-[#034694] md:text-[5rem]">
                    Rankings
                  </span>
                  <br />
                  de lo más <span className="font-te-it">Top!</span>
                </h3>

                <p className="relative z-10 m-auto my-4 max-w-[80%] text-center text-[1.125rem] leading-[1.1em] text-[#3a3540]/90">
                  Más de 250,000 reseñas escritas por usuarios te ayudan a
                  elegir los mejores cursos.
                </p>
              </div>
            </div>
          </div>
        </HorizontalScroll>
      </section>

      <section className="relative z-10 mt-[-70%] h-full w-screen flex-shrink-0 p-5 lg:mt-[-20%] lg:p-10">
        <div className="container m-auto">
          {rankingsLoading ? (
            <RankingsPreviewSkeleton />
          ) : (
            <div className="grid grid-cols-1 gap-5 pt-10 text-sm md:grid-cols-3 lg:pt-20">
              <div className="rounded-2xl border border-[rgba(15,9,11,0.07)] bg-white p-6 shadow-sm">
                <h4 className="mb-5 font-[Montserrat] text-base font-semibold text-[#0F090B]">
                  {rankingName1}
                </h4>

                <div className="flex flex-wrap gap-1">
                  {renderItems(universidades, "Universidad")}
                </div>

                <Link
                  className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] transition-colors hover:text-[#1941CF]"
                  to={`/lo-mas-top/ranking/${rankingName1Slug}`}
                >
                  Ver el top de universidades →
                </Link>
              </div>

              <div className="rounded-2xl border border-[rgba(15,9,11,0.07)] bg-white p-6 shadow-sm">
                <h4 className="mb-5 font-[Montserrat] text-base font-semibold text-[#0F090B]">
                  {rankingName3}
                </h4>

                <div className="flex flex-wrap gap-1">
                  {renderItems(universidadesLatam, "Universidad")}
                </div>

                <Link
                  className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] transition-colors hover:text-[#1941CF]"
                  to={`/lo-mas-top/ranking/${rankingName3Slug}`}
                >
                  Ver el top de universidades →
                </Link>
              </div>

              <div className="rounded-2xl border border-[rgba(15,9,11,0.07)] bg-white p-6 shadow-sm">
                <h4 className="mb-5 font-[Montserrat] text-base font-semibold text-[#0F090B]">
                  {rankingName2}
                </h4>

                <div className="flex flex-wrap gap-1">
                  {renderItems(empresas, "Empresa")}
                </div>

                <Link
                  className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] transition-colors hover:text-[#1941CF]"
                  to={`/lo-mas-top/ranking/${rankingName2Slug}`}
                >
                  Ver el top de empresas →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <RankingsGrid />
    </>
  );
}