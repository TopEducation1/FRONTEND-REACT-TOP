import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import endpoints from "../config/api";

const IndexCategories = ({ onTagSelect, selectedTags }) => {
  const [openSection, setOpenSection] = useState(null);
  const [openChildMenu, setOpenChildMenu] = useState(null);
  const [temas, setTemas] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [universidadesPorRegion, setUniversidadesPorRegion] = useState({});
  const indexRef = useRef(null);

  const normalizeSkillType = (value) => {
    const v = (value || "").toString().trim().toLowerCase();

    if (["tema", "category", "principal"].includes(v)) return "tema";
    if (["habilidad", "skill", "subskill", "secondary"].includes(v)) return "habilidad";

    return "";
  };

  const isSkillActive = (item) => {
    return item?.estado === true || item?.estado === 1 || item?.estado === "1";
  };

  const getSkillLabel = (item) => {
    return item?.translate && item.translate.trim() !== ""
      ? item.translate
      : item?.nombre || "";
  };

  const getParentId = (item) => {
    if (!item?.parent) return null;
    if (typeof item.parent === "object") return item.parent.id || null;
    return item.parent;
  };

  const isLanguageSelected = (code) => {
    return Array.isArray(selectedTags?.idioma) && selectedTags.idioma.includes(code);
  };

  useEffect(() => {
    fetch(endpoints.skills)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        const activeSkills = safeData.filter((item) => isSkillActive(item));

        setTemas(
          activeSkills.filter(
            (item) => normalizeSkillType(item.skill_type) === "tema"
          )
        );

        setHabilidades(
          activeSkills.filter(
            (item) => normalizeSkillType(item.skill_type) === "habilidad"
          )
        );
      })
      .catch((err) => {
        console.error("Error cargando skills:", err);
        setTemas([]);
        setHabilidades([]);
      });

    fetch(endpoints.empresas)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];
        setEmpresas(
          safeData.filter(
            (item) => item.empr_est === "enabled" || item.estado === true
          )
        );
      })
      .catch((err) => {
        console.error("Error cargando empresas:", err);
        setEmpresas([]);
      });

    fetch(endpoints.platforms)
      .then((res) => res.json())
      .then((data) => setPlataformas(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error cargando plataformas:", err);
        setPlataformas([]);
      });

    fetch(endpoints.universities_region)
      .then((res) => res.json())
      .then((data) => setUniversidadesPorRegion(data || {}))
      .catch((err) => {
        console.error("Error cargando universidades por región:", err);
        setUniversidadesPorRegion({});
      });

    fetch(endpoints.certification_languages)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];
        setIdiomas(safeData);
      })
      .catch((err) => {
        console.error("Error cargando idiomas:", err);
        setIdiomas([]);
      });
  }, []);

  const isSectionDisabled = (sectionTitle) => {
    if (!selectedTags || !selectedTags.plataforma) return false;

    if (selectedTags.plataforma.includes("MasterClass")) {
      return sectionTitle === "temas";
    }

    if (
      selectedTags.plataforma.includes("Coursera") ||
      selectedTags.plataforma.includes("EdX")
    ) {
      return sectionTitle === "habilidades";
    }

    return false;
  };

  const buildSkillTree = (items) => {
    const parentItems = items
      .filter((item) => !getParentId(item))
      .sort((a, b) => getSkillLabel(a).localeCompare(getSkillLabel(b)));

    return parentItems.map((parent) => ({
      ...parent,
      children: items
        .filter((item) => String(getParentId(item)) === String(parent.id))
        .sort((a, b) => getSkillLabel(a).localeCompare(getSkillLabel(b))),
    }));
  };

  const temasTree = useMemo(() => buildSkillTree(temas), [temas]);
  const habilidadesTree = useMemo(() => buildSkillTree(habilidades), [habilidades]);

  const handleSkillSelect = (category, item) => {
    onTagSelect(category, {
      id: item.id,
      nombre: item.nombre,
      translate: item.translate,
      slug: item.slug,
      skill_type: item.skill_type,
      parent: item.parent ?? null,
    });

    setOpenSection(null);
    setOpenChildMenu(null);
  };

  const handleLanguageToggle = (code) => {
    onTagSelect("idioma", code);
  };

  const renderSkillTree = (category, treeItems) => {
    return treeItems.map((parent) => {
      const hasChildren = Array.isArray(parent.children) && parent.children.length > 0;
      const disabled = isSectionDisabled(category);
      const isHovered =
        openChildMenu &&
        openChildMenu.category === category &&
        openChildMenu.parentId === parent.id;

      return (
        <div
          key={parent.id}
          className="item-category relative"
          onMouseEnter={() => {
            if (hasChildren && !disabled) {
              setOpenChildMenu({
                category,
                parentId: parent.id,
              });
            }
          }}
          onMouseLeave={() => {
            if (hasChildren) {
              setOpenChildMenu(null);
            }
          }}
        >
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              handleSkillSelect(category, parent);
            }}
            style={{
              pointerEvents: disabled ? "none" : "auto",
              opacity: disabled ? 0.5 : 1,
            }}
            className="flex items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              <img
                className="sect-ico"
                src={
                  parent.skill_ico ||
                  parent.skill_img ||
                  `/assets/category/${parent.nombre}.png`
                }
                alt={parent.nombre}
              />
              {getSkillLabel(parent)}
            </span>

            {hasChildren && (
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
                className="opacity-70"
              >
                <path d="M9 6l6 6l-6 6" />
              </svg>
            )}
          </Link>

          {hasChildren && isHovered && (
            <div
              className="absolute left-full top-0 z-50 min-w-[280px] rounded-2xl border border-neutral-300 shadow-2xl overflow-hidden"
              data-lenis-prevent
            >
              <div className="subsub-item p-3">
                <div className="mb-1 border-b border-neutral-400 pb-1 text-sm font-semibold text-black">
                  {getSkillLabel(parent)}
                </div>

                <div className="flex flex-col gap-1">
                  {parent.children.map((child) => (
                    <div key={child.id} className="item-category">
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSkillSelect(category, child);
                        }}
                        style={{
                          pointerEvents: disabled ? "none" : "auto",
                          opacity: disabled ? 0.5 : 1,
                        }}
                        className="flex items-center !text-black"
                      >
                        {getSkillLabel(child)}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  const renderItems = (category, items) => {
    return items.map((item) => (
      <div key={item.id} className="item-category">
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            onTagSelect(category, item.nombre);
            setOpenSection(null);
          }}
          style={{
            pointerEvents: isSectionDisabled(category) ? "none" : "auto",
            opacity: isSectionDisabled(category) ? 0.5 : 1,
          }}
        >
          <img
            className="sect-ico"
            src={
              item.skill_ico ||
              item.empr_ico ||
              item.univ_ico ||
              item.plat_ico ||
              `/assets/category/${item.nombre}.png`
            }
            alt={item.nombre}
          />
          {item?.translate && item.translate.trim() !== ""
            ? item.translate
            : item.nombre}
        </Link>
      </div>
    ));
  };

  const renderLanguages = () => {
    return (
      <div className="language-checklist mb-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black">Idioma</h3>
        </div>

        <div
          data-lenis-prevent
          className="flex flex-col gap-0 overflow-y-auto max-h-[250px] pb-6 mb-10"
        >
          {idiomas.map((lang) => {
            const checked = isLanguageSelected(lang.code);

            return (
              <label
                key={lang.code}
                className="flex items-center justify-between gap-3 cursor-pointer rounded-lg px-2 py-1 hover:bg-neutral-100"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleLanguageToggle(lang.code)}
                    className="h-4 w-4 rounded-xl accent-black"
                  />
                  <span className="text-sm text-black">{lang.label}</span>
                </div>

                <span className="text-xs text-neutral-500">{lang.count}</span>
              </label>
            );
          })}
          {/* Indicador scroll */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-full flex justify-center pb-1 bg-gradient-to-t from-[#F6F4EF] via-[#F6F4EF]/80 to-transparent">
            <div className="flex flex-col items-center animate-bounce text-neutral-400">
              {/*<span className="text-xs">scroll</span>*/}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const sections = [
    {
      title: "Tema",
      key: "temas",
      renderContent: () => renderSkillTree("temas", temasTree),
    },
    {
      title: "Habilidad",
      key: "habilidades",
      renderContent: () => renderSkillTree("habilidades", habilidadesTree),
    },
    {
      title: "Universidad",
      key: "universidades",
      renderContent: () =>
        Object.entries(universidadesPorRegion).map(([region, universidades]) => (
          <div key={region} className="submenu" >
            <h3 className="!text-black">{region}</h3>
            <div className={`unfold-list list-${region}`}>
              {universidades.map((uni) => (
                <div key={uni.id} className="subitem">
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onTagSelect("universidades", uni.nombre);
                      setOpenSection(null);
                    }}
                    className="!text-black"
                    style={{
                      pointerEvents: isSectionDisabled("universidades")
                        ? "none"
                        : "auto",
                      opacity: isSectionDisabled("universidades") ? 0.5 : 1,
                    }}
                  >
                    {uni?.univ_img && 
                    uni.univ_img !== "None" && 
                    uni.univ_img.trim() !== "" && (
                      <img
                        className="sect-ico"
                        src={uni.univ_ico || uni.univ_img}
                        alt={uni.nombre}
                      />
                    )}
                    {uni.nombre}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )),
    },
    {
      title: "Empresa",
      key: "empresas",
      renderContent: () => (
        <div className="submenu">
          <div className="unfold-list grid grid-cols-1 md:grid-cols-3 gap-0 overflow-y-auto max-h-[65vh]" data-lenis-prevent>
            {empresas.map((empr) => (
              <div key={empr.id} className="subitem">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onTagSelect("empresas", empr.nombre);
                    setOpenSection(null);
                  }}
                  style={{
                    pointerEvents: isSectionDisabled("empresas") ? "none" : "auto",
                    opacity: isSectionDisabled("empresas") ? 0.5 : 1,
                  }}
                >
                  {empr?.empr_ico && 
                    empr.empr_ico !== "None" && 
                    empr.empr_ico.trim() !== "" && (
                      <img
                        className="sect-ico"
                        src={empr.empr_ico}
                        alt={empr.nombre}
                      />
                    )}
                  {empr.nombre}
                </Link>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Plataforma",
      key: "plataforma",
      renderContent: () => renderItems("plataforma", plataformas),
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
              key={section.key}
              className={`category-item item-${section.key} ${isOpen ? "open" : ""}`}
              onMouseEnter={() =>
                isSectionDisabled(section.key) ? null : setOpenSection(index)
              }
              onMouseLeave={() => {
                if (openSection === index) {
                  setOpenSection(null);
                  setOpenChildMenu(null);
                }
              }}
            >
              <button
                type="button"
                className="unfold-category-button"
                disabled={isSectionDisabled(section.key)}
                style={{
                  opacity: isSectionDisabled(section.key) ? 0.5 : 1,
                  cursor: isSectionDisabled(section.key)
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

              {isOpen && (
                <div className="unfold-list subprimery relative" data-lenis-prevent>
                  {section.renderContent()}
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-4 border-t border-neutral-200 pt-4">
          {renderLanguages()}
        </div>
      </div>
    </div>
  );
};

export default IndexCategories;