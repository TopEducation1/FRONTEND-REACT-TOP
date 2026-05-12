import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import endpoints from "../config/api";

const IndexCategories = ({ onTagSelect, selectedTags, disabled = false }) => {
  const [openSection, setOpenSection] = useState(null);
  const [openChildMenu, setOpenChildMenu] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileOpenSection, setMobileOpenSection] = useState(null);
  const [mobileOpenChild, setMobileOpenChild] = useState(null);

  const [temas, setTemas] = useState([]);
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

  const isSkillActive = (item) =>
    item?.estado === true || item?.estado === 1 || item?.estado === "1";

  const getSkillLabel = (item) =>
    item?.translate && item.translate.trim() !== "" ? item.translate : item?.nombre || "";

  const getParentId = (item) => {
    if (!item?.parent) return null;
    if (typeof item.parent === "object") return item.parent.id || null;
    return item.parent;
  };

  const isLanguageSelected = (code) =>
    Array.isArray(selectedTags?.idioma) && selectedTags.idioma.includes(code);

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
      })
      .catch(() => setTemas([]));

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
      .catch(() => setEmpresas([]));

    fetch(endpoints.platforms)
      .then((res) => res.json())
      .then((data) => setPlataformas(Array.isArray(data) ? data : []))
      .catch(() => setPlataformas([]));

    fetch(endpoints.universities_region)
      .then((res) => res.json())
      .then((data) => setUniversidadesPorRegion(data || {}))
      .catch(() => setUniversidadesPorRegion({}));

    fetch(endpoints.certification_languages)
      .then((res) => res.json())
      .then((data) => setIdiomas(Array.isArray(data) ? data : []))
      .catch(() => setIdiomas([]));
  }, []);

  const isSectionDisabled = () => false;

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

  const closeMobileFilters = () => {
    setMobileFiltersOpen(false);
    setMobileOpenSection(null);
    setMobileOpenChild(null);
  };

  const handleSkillSelect = (category, item, closeMobile = false) => {
    if (disabled) return;

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

    if (closeMobile) closeMobileFilters();
  };

  const handleLanguageToggle = (code) => {
    if (disabled) return;
    onTagSelect("idioma", code);
  };

  const renderSkillTreeDesktop = (category, treeItems) => {
    return treeItems.map((parent) => {
      const hasChildren = Array.isArray(parent.children) && parent.children.length > 0;
      const sectionDisabled = disabled || isSectionDisabled(category);
      const isHovered =
        openChildMenu &&
        openChildMenu.category === category &&
        openChildMenu.parentId === parent.id;

      return (
        <div
          key={parent.id}
          className="item-category relative"
          onMouseEnter={() => {
            if (hasChildren && !sectionDisabled) {
              setOpenChildMenu({ category, parentId: parent.id });
            }
          }}
          onMouseLeave={() => hasChildren && setOpenChildMenu(null)}
        >
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              handleSkillSelect(category, parent);
            }}
            style={{
              pointerEvents: sectionDisabled ? "none" : "auto",
              opacity: sectionDisabled ? 0.5 : 1,
            }}
            className="flex items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              <img
                className="sect-ico"
                src={parent.skill_ico || parent.skill_img || `/assets/category/${parent.nombre}.png`}
                alt={parent.nombre}
              />
              {getSkillLabel(parent)}
            </span>

            {hasChildren && <span className="opacity-70">›</span>}
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

  const renderSkillTreeMobile = (category, treeItems) => {
    return treeItems.map((parent) => {
      const hasChildren = Array.isArray(parent.children) && parent.children.length > 0;
      const isOpen = mobileOpenChild === `${category}-${parent.id}`;

      return (
        <div key={parent.id} className="border-b border-neutral-200 last:border-b-0">
          <div className="flex items-center gap-2 py-2">
            <button
              type="button"
              className="flex flex-1 items-center gap-2 text-left text-sm font-medium text-black"
              onClick={() => handleSkillSelect(category, parent, true)}
              disabled={disabled}
            >
              <img
                className="h-6 w-6 rounded-full object-contain"
                src={parent.skill_ico || parent.skill_img || `/assets/category/${parent.nombre}.png`}
                alt={parent.nombre}
              />
              {getSkillLabel(parent)}
            </button>

            {hasChildren && (
              <button
                type="button"
                className={`grid h-8 w-8 place-items-center rounded-full bg-neutral-100 transition-transform duration-300 ${
                  isOpen ? "rotate-90" : ""
                }`}
                onClick={() =>
                  setMobileOpenChild(isOpen ? null : `${category}-${parent.id}`)
                }
              >
                ›
              </button>
            )}
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-8 flex flex-col gap-1 pb-3">
              {parent.children.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  className="rounded-xl px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                  onClick={() => handleSkillSelect(category, child, true)}
                  disabled={disabled}
                >
                  {getSkillLabel(child)}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    });
  };

  const renderItems = (category, items, isMobile = false) => {
    return items.map((item) => (
      <div key={item.id} className={isMobile ? "" : "item-category"}>
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            if (disabled) return;
            onTagSelect(category, item.nombre);
            setOpenSection(null);
            if (isMobile) closeMobileFilters();
          }}
          style={{
            pointerEvents: disabled || isSectionDisabled(category) ? "none" : "auto",
            opacity: disabled || isSectionDisabled(category) ? 0.5 : 1,
          }}
          className={
            isMobile
              ? "flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-black hover:bg-neutral-100"
              : ""
          }
        >
          <img
            className={isMobile ? "h-7 w-7 rounded-full object-contain" : "sect-ico"}
            src={
              item.skill_ico ||
              item.empr_ico ||
              item.univ_ico ||
              item.plat_ico ||
              `/assets/category/${item.nombre}.png`
            }
            alt={item.nombre}
          />
          {item?.translate && item.translate.trim() !== "" ? item.translate : item.nombre}
        </Link>
      </div>
    ));
  };

  const renderLanguages = (isMobile = false) => {
    return (
      <div className={isMobile ? "language-checklist" : "language-checklist mb-5"}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black">Idioma</h3>
        </div>

        <div
          data-lenis-prevent
          className={`flex flex-col gap-0 overflow-y-auto ${
            isMobile ? "max-h-[300px] pb-3" : "max-h-[250px] pb-6 mb-10"
          }`}
        >
          {idiomas.map((lang) => {
            const checked = isLanguageSelected(lang.code);

            return (
              <label
                key={lang.code}
                className="flex items-center justify-between gap-3 cursor-pointer rounded-lg px-2 py-1 hover:bg-neutral-100"
                style={{
                  opacity: disabled ? 0.5 : 1,
                  pointerEvents: disabled ? "none" : "auto",
                }}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleLanguageToggle(lang.code)}
                    className="h-4 w-4 rounded-xl accent-black"
                    disabled={disabled}
                  />
                  <span className="text-sm text-black">{lang.label}</span>
                </div>

                <span className="text-xs text-neutral-500">{lang.count}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  const sections = [
    {
      title: "Tema",
      key: "temas",
      renderDesktop: () => renderSkillTreeDesktop("temas", temasTree),
      renderMobile: () => renderSkillTreeMobile("temas", temasTree),
    },
    {
      title: "Universidad",
      key: "universidades",
      renderDesktop: () => (
        <div className="submenu overflow-y-auto max-h-[65vh] pr-2" data-lenis-prevent>
          {Object.entries(universidadesPorRegion).map(([region, universidades]) => (
            <div key={region} className="mb-4">
              <h3 className="!text-black sticky top-0 bg-[#F6F4EF] z-10 py-1">{region}</h3>
              <div className={`unfold-list list-${region}`}>
                {universidades.map((uni) => (
                  <div key={uni.id} className="subitem">
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (disabled) return;
                        onTagSelect("universidades", uni.nombre);
                        setOpenSection(null);
                      }}
                      className="!text-black"
                    >
                      {uni?.univ_img && uni.univ_img !== "None" && uni.univ_img.trim() !== "" && (
                        <div className="bg-white rounded-full overflow-hidden flex justify-center items-center h-[30px] w-[30px] mr-1">
                          <img src={uni.univ_ico || uni.univ_img} alt={uni.nombre} />
                        </div>
                      )}
                      {uni.nombre}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
      renderMobile: () => (
        <div className="flex flex-col gap-4">
          {Object.entries(universidadesPorRegion).map(([region, universidades]) => (
            <div key={region}>
              <h3 className="sticky top-0 z-10 bg-[#F6F4EF] px-3 py-2 rounded-xl text-sm font-bold text-black">
                {region}
              </h3>
              <div className="flex flex-col gap-1">
                {universidades.map((uni) => (
                  <button
                    key={uni.id}
                    type="button"
                    onClick={() => {
                      if (disabled) return;
                      onTagSelect("universidades", uni.nombre);
                      closeMobileFilters();
                    }}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-black hover:bg-neutral-100"
                  >
                    {(uni?.univ_ico || uni?.univ_img) && (
                      <div className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-white">
                        <img
                          className="max-h-6 max-w-6 object-contain"
                          src={uni.univ_ico || uni.univ_img}
                          alt={uni.nombre}
                        />
                      </div>
                    )}
                    {uni.nombre}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Empresa",
      key: "empresas",
      renderDesktop: () => (
        <div className="submenu">
          <div
            className="unfold-list grid grid-cols-1 md:grid-cols-3 gap-0 overflow-y-auto max-h-[65vh]"
            data-lenis-prevent
          >
            {empresas.map((empr) => (
              <div key={empr.id} className="subitem">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (disabled) return;
                    onTagSelect("empresas", empr.nombre);
                    setOpenSection(null);
                  }}
                >
                  {empr?.empr_ico && empr.empr_ico !== "None" && empr.empr_ico.trim() !== "" && (
                    <div className="bg-white rounded-full overflow-hidden flex justify-center items-center h-[30px] w-[30px] mr-1">
                      <img src={empr.empr_ico || empr.empr_img} alt={empr.nombre} />
                    </div>
                  )}
                  {empr.nombre}
                </Link>
              </div>
            ))}
          </div>
        </div>
      ),
      renderMobile: () => (
        <div className="flex flex-col gap-1">
          {empresas.map((empr) => (
            <button
              key={empr.id}
              type="button"
              onClick={() => {
                if (disabled) return;
                onTagSelect("empresas", empr.nombre);
                closeMobileFilters();
              }}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-black hover:bg-neutral-100"
            >
              {(empr?.empr_ico || empr?.empr_img) && (
                <div className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-white">
                  <img
                    className="max-h-6 max-w-6 object-contain"
                    src={empr.empr_ico || empr.empr_img}
                    alt={empr.nombre}
                  />
                </div>
              )}
              {empr.nombre}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Aliados",
      key: "plataforma",
      renderDesktop: () => renderItems("plataforma", plataformas),
      renderMobile: () => renderItems("plataforma", plataformas, true),
    },
    {
      title: "Idioma",
      key: "idioma",
      renderDesktop: () => renderLanguages(false),
      renderMobile: () => renderLanguages(true),
    },
  ];

  return (
    <div ref={indexRef} className="cont-menu-categ">
      {/* MOBILE */}
      <div className="lg:hidden mb-1 px-2">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((prev) => !prev)}
          disabled={disabled}
          className="w-full text-left  font-bold flex items-center justify-between  disabled:opacity-50"
        > <h1 className="text-3xl text-black leading-[1em]">Biblioteca</h1>
        <div className="flex justify-between gap-2 items-center  rounded-3xl bg-black px-4 py-2 text-white shadow-sm">
          <span className="text-sm">{mobileFiltersOpen ? "Ocultar filtros" : "Ver filtros"}</span>
          <span
            className={`text-xl transition-transform duration-300 ${
              mobileFiltersOpen ? "rotate-45" : ""
            }`}
          >
            +
          </span>
          </div>
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-out ${
            mobileFiltersOpen ? "max-h-[78vh] opacity-100 mt-3" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className="rounded-3xl border border-[#E3E0D6] bg-[#F6F4EF] overflow-hidden"
            data-lenis-prevent
          >
            <div
              className="max-h-[75vh] overflow-y-auto overscroll-contain p-3"
              data-lenis-prevent
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-black">Filtros</h2>
                <button
                  type="button"
                  onClick={closeMobileFilters}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white text-black"
                >
                  ×
                </button>
              </div>

              {sections.map((section) => {
                const isOpen = mobileOpenSection === section.key;

                return (
                  <div key={section.key} className="border-t border-neutral-200 first:border-t-0">
                    <button
                      type="button"
                      onClick={() =>
                        setMobileOpenSection(isOpen ? null : section.key)
                      }
                      className="flex w-full items-center justify-between py-3 text-left font-bold text-black"
                    >
                      {section.title}
                      <span
                        className={`transition-transform duration-300 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      >
                        ›
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        isOpen ? "max-h-[520px] opacity-100 pb-3" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div
                        className={`rounded-2xl bg-white/60 p-2 ${
                          ["temas", "universidades", "empresas"].includes(section.key)
                            ? "max-h-[52vh] overflow-y-auto overscroll-contain pr-1"
                            : ""
                        }`}
                        data-lenis-prevent
                        onTouchMove={(e) => e.stopPropagation()}
                        onWheel={(e) => e.stopPropagation()}
                      >
                        {section.renderMobile()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="category-wrapper">
          <h2>Biblioteca</h2>

          {sections
            .filter((section) => section.key !== "idioma")
            .map((section, index) => {
              const isOpen = openSection === index;
              const sectionDisabled = disabled || isSectionDisabled(section.key);

              return (
                <div
                  key={section.key}
                  className={`category-item item-${section.key} ${isOpen ? "open" : ""}`}
                  onMouseEnter={() => (sectionDisabled ? null : setOpenSection(index))}
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
                    disabled={sectionDisabled}
                    style={{
                      opacity: sectionDisabled ? 0.5 : 1,
                      cursor: sectionDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    <span className={isOpen ? "rotate transition-transform duration-300" : "transition-transform duration-300"}>
                      ›
                    </span>
                    <span>{section.title}</span>
                  </button>

                  {isOpen && (
                    <div className="unfold-list subprimery relative" data-lenis-prevent>
                      {section.renderDesktop()}
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
    </div>
  );
};

export default IndexCategories;