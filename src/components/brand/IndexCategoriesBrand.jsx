import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import endpoints from "../../config/api";
import SearchBar from "../../components/searchBar";

const IndexCategoriesBrand = ({ onTagSelect, selectedTags }) => {
  const [openSection, setOpenSection] = useState(null);
  const [temas, setTemas] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [universidadesPorRegion, setUniversidadesPorRegion] = useState({});

  useEffect(() => {
    fetch(endpoints.topics)
      .then((res) => res.json())
      .then((data) => {
        setTemas(
          data.filter(
            (t) => t.tem_type === "Tema" && t.tem_est === "enabled"
          )
        );
        setHabilidades(
          data.filter(
            (h) => h.tem_type === "Habilidad" && h.tem_est === "enabled"
          )
        );
      });

    fetch(endpoints.empresas)
      .then((res) => res.json())
      .then((data) => setEmpresas(data.filter((t) => t.empr_est === "enabled")));

    fetch(endpoints.platforms)
      .then((res) => res.json())
      .then((data) => setPlataformas(data));

    fetch(endpoints.universities_region)
      .then((res) => res.json())
      .then((data) => setUniversidadesPorRegion(data));
  }, []);

  const isSectionDisabled = (sectionTitle) => {
    if (!selectedTags || !selectedTags.Plataforma) return false;

    if (selectedTags.Plataforma.includes("MasterClass"))
      return sectionTitle === "Tema";
    if (
      selectedTags.Plataforma.includes("Coursera") ||
      selectedTags.Plataforma.includes("EdX")
    )
      return sectionTitle === "Habilidad";

    return false;
  };

  const renderItems = (category, items, sectionIndex) => {
    return items.map((item) => (
      <button
        key={item.id}
        className="flex items-center gap-2 text-sm text-neutral-900 hover:text-white hover:bg-neutral-800 rounded-lg px-2 py-1 text-left"
        onClick={(e) => {
          e.preventDefault();
          onTagSelect(category, item.nombre);
          setOpenSection(null); // cerrar menú al elegir
        }}
        style={{
          pointerEvents: isSectionDisabled(category) ? "none" : "auto",
          opacity: isSectionDisabled(category) ? 0.5 : 1,
        }}
      >
        <img
          className="w-6 h-6 rounded object-contain"
          src={
            item.empr_ico ||
            item.univ_ico ||
            item.tem_img ||
            item.plat_ico ||
            `/assets/category/${item.nombre}.png`
          }
          alt={item.nombre}
        />
        <span>{item.nombre}</span>
      </button>
    ));
  };

  const sections = [
    {
      title: "Tema",
      renderContent: (index) => renderItems("Tema", temas, index),
    },
    {
      title: "Habilidad",
      renderContent: (index) => renderItems("Habilidad", habilidades, index),
    },
    {
      title: "Universidad",
      renderContent: (index) =>
        Object.entries(universidadesPorRegion).map(
          ([region, universidades]) => (
            <div key={region} className="mb-2">
              <h3 className="text-xs font-semibold text-neutral-700 mb-1">
                {region}
              </h3>
              <div className="flex flex-col gap-1">
                {universidades.map((uni) => (
                  <button
                    key={uni.id}
                    className="flex items-center gap-2 text-sm text-neutral-900 hover:text-white hover:bg-neutral-800 rounded-lg px-2 py-1 text-left"
                    onClick={(e) => {
                      e.preventDefault();
                      onTagSelect("Universidad", uni.nombre);
                      setOpenSection(null);
                    }}
                    style={{
                      pointerEvents: isSectionDisabled("Universidad")
                        ? "none"
                        : "auto",
                      opacity: isSectionDisabled("Universidad") ? 0.5 : 1,
                    }}
                  >
                    <img
                      className="w-6 h-6 rounded bg-neutral-900/40 object-contain"
                      src={uni.img || uni.univ_img}
                      alt={uni.nombre}
                    />
                    <span>{uni.nombre}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        ),
    },
    {
      title: "Empresa",
      renderContent: (index) => renderItems("Empresa", empresas, index),
    },
    {
      title: "Plataforma",
      renderContent: (index) => renderItems("Plataforma", plataformas, index),
    },
  ];

  return (
    <div className="brand-index-categories w-full mb-0">
      {/* barra superior de categorías */}
      <div className="flex flex-wrap gap-3 border-b border-neutral-800 pb-2">
        {sections.map((section, index) => {
          const isOpen = openSection === index;
          const label =
            section.title === "Plataforma" ? "Aliados" : section.title;

          return (
            <div
              key={index}
              className="relative"
              onMouseEnter={() =>
                isSectionDisabled(section.title)
                  ? null
                  : setOpenSection(index)
              }
              onMouseLeave={() => {
                if (openSection === index) setOpenSection(null);
              }}
            >
              <button
                type="button"
                disabled={isSectionDisabled(section.title)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border
                  ${
                    isOpen
                      ? "bg-neutral-100 text-neutral-900 border-neutral-100 !rounded-[15px_15px_0px_0px] !pb-[10px]"
                      : "bg-transparent text-neutral-100 border-neutral-100 hover:border-neutral-400"
                  }`}
                style={{
                  opacity: isSectionDisabled(section.title) ? 0.5 : 1,
                  cursor: isSectionDisabled(section.title)
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                <span>{label}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
                  
              {/* Submenú vertical como dropdown */}
              {isOpen && (
                <div className="absolute left-0 mt-0 w-64 max-h-[80vh] overflow-y-auto bg-white border border-white rounded-[0px_15px_15px_15px] shadow-lg z-40 p-2">
                  <div className="flex flex-col gap-1">
                    {section.renderContent(index)}
                  </div>
                </div>
              )}
            </div>
            
          );
        })}
        <SearchBar />
      </div>
    </div>
  );
};

export default IndexCategoriesBrand;
