import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import endpoints from "../config/api";

const IndexCategories = ({ onTagSelect, selectedTags }) => {
  const [openSection, setOpenSection] = useState(null); // 👈 solo una sección abierta
  const [temas, setTemas] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [universidadesPorRegion, setUniversidadesPorRegion] = useState({});
  const indexRef = useRef(null);

  useEffect(() => {
    fetch(endpoints.topics)
      .then((res) => res.json())
      .then((data) => {
        setTemas(
          data.filter((t) => t.tem_type === "Tema" && t.tem_est === "enabled")
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

  // ahora recibe también el índice de la sección para poder cerrarla al hacer click
  const renderItems = (category, items, sectionIndex) => {
    return items.map((item) => (
      <div key={item.id} className="item-category">
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            onTagSelect(category, item.nombre);
            setOpenSection(null); // 🔥 cerrar el submenu al seleccionar
          }}
          style={{
            pointerEvents: isSectionDisabled(category) ? "none" : "auto",
            opacity: isSectionDisabled(category) ? 0.5 : 1,
          }}
        >
          <img
            className="sect-ico"
            src={
              item.empr_ico ||
              item.univ_ico ||
              item.tem_img ||
              item.plat_ico ||
              `/assets/category/${item.nombre}.png`
            }
            alt={item.nombre}
          />
          {item.nombre}
        </Link>
      </div>
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
            <div key={region} className="submenu">
              <h3>{region}</h3>
              <div className={`unfold-list list-${region}`}>
                {universidades.map((uni) => (
                  <div key={uni.id} className="subitem">
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onTagSelect("Universidad", uni.nombre);
                        setOpenSection(null); // 🔥 cerrar al elegir una universidad
                      }}
                      style={{
                        pointerEvents: isSectionDisabled("Universidad")
                          ? "none"
                          : "auto",
                        opacity: isSectionDisabled("Universidad") ? 0.5 : 1,
                      }}
                    >
                      <img
                        className="sect-ico"
                        src={uni.img || uni.univ_img}
                        alt={uni.nombre}
                      />
                      {uni.nombre}
                    </Link>
                  </div>
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
    <div ref={indexRef} className="cont-menu-categ">
      <div className="category-wrapper">
        <h2>Biblioteca</h2>

        {sections.map((section, index) => {
          const isOpen = openSection === index;

          return (
            <div
              key={index}
              className={`category-item item-${section.title} ${
                isOpen ? "open" : ""
              }`}
              // 👇 el hover abre / cierra la sección
              onMouseEnter={() =>
                isSectionDisabled(section.title) ? null : setOpenSection(index)
              }
              onMouseLeave={() => {
                if (openSection === index) setOpenSection(null);
              }}
            >
              <button
                type="button"
                className="unfold-category-button"
                disabled={isSectionDisabled(section.title)}
                style={{
                  opacity: isSectionDisabled(section.title) ? 0.5 : 1,
                  cursor: isSectionDisabled(section.title)
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={isOpen ? "rotate" : ""}
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 6l6 6l-6 6" />
                </svg>
                <span>
                  {section.title === "Plataforma" ? "Aliados" : section.title}
                </span>
              </button>

              {/* Solo renderizamos el submenu cuando está "hovered" */}
              {isOpen && (
                <div className="unfold-list subprimery" data-lenis-prevent>
                  {section.renderContent(index)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndexCategories;
