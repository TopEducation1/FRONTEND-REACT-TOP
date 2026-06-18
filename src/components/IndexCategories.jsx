import React, { useEffect, useState, useRef, useMemo } from "react";
import endpoints from "../config/api";

const IndexCategories = ({ onTagSelect, selectedTags, disabled = false }) => {
  const [openSection, setOpenSection] = useState(null);
  const [openChildMenu, setOpenChildMenu] = useState(null);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileOpenSection, setMobileOpenSection] = useState(null);
  const [mobileOpenChild, setMobileOpenChild] = useState(null);

  const [skills, setSkills] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [universidadesPorRegion, setUniversidadesPorRegion] = useState({});

  const indexRef = useRef(null);

  const normalizeSkillType = (value) => {
    const v = (value || "").toString().trim().toLowerCase();

    if (["tema", "temas", "category", "principal"].includes(v)) return "tema";
    if (["habilidad", "habilidades", "skill", "subskill", "secondary"].includes(v)) {
      return "habilidad";
    }

    return "";
  };
  
  const isSkillActive = (item) =>
    item?.estado === true || item?.estado === 1 || item?.estado === "1";

  const getSkillLabel = (item) =>
    item?.translate && item.translate.trim() !== ""
      ? item.translate
      : item?.nombre || "";

  const getParentId = (item) => {
    if (item?.parent_id) return item.parent_id;

    if (!item?.parent) return null;

    if (typeof item.parent === "object") {
      return item.parent.id || item.parent_id || null;
    }

    return item.parent;
  };

  const hasValidValue = (value) =>
    value &&
    typeof value === "string" &&
    value.trim() !== "" &&
    value !== "null" &&
    value !== "undefined";

  const hasParentIcon = (item) =>
    hasValidValue(item?.skill_ico) || hasValidValue(item?.skill_img);

  const getPlatformLabel = (item) =>
    item?.nombre ||
    item?.name ||
    item?.plataforma_nombre ||
    item?.title ||
    item?.slug ||
    "";

  const getCompanyLabel = (item) =>
    item?.nombre ||
    item?.name ||
    item?.empr_nombre ||
    item?.title ||
    item?.slug ||
    "";

  const getUniversityLabel = (item) =>
    item?.nombre ||
    item?.name ||
    item?.univ_nombre ||
    item?.title ||
    item?.slug ||
    "";

  const isLanguageSelected = (code) =>
    Array.isArray(selectedTags?.idioma) && selectedTags.idioma.includes(code);

  useEffect(() => {
    fetch(endpoints.filterSkills)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        setSkills(safeData.filter((item) => isSkillActive(item)));
      })
      .catch(() => setSkills([]));

    fetch(endpoints.filterCompanies)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        setEmpresas(safeData);
      })
      .catch(() => setEmpresas([]));

    fetch(endpoints.filterPlatforms)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        setPlataformas(safeData);
      })
      .catch(() => setPlataformas([]));

    fetch(endpoints.filterUniversitiesRegion)
      .then((res) => res.json())
      .then((data) => setUniversidadesPorRegion(data || {}))
      .catch(() => setUniversidadesPorRegion({}));

    fetch(endpoints.certification_languages)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        setIdiomas(safeData);
      })
      .catch(() => setIdiomas([]));
  }, []);

  const hasIcon = (item) => {
    const icon = item?.skill_ico || item?.skill_img;
    return (
      icon &&
      typeof icon === "string" &&
      icon.trim() !== "" &&
      icon !== "NULL" &&
      icon !== "null" &&
      icon !== "undefined"
    );
  };

  const temasItems = useMemo(
    () =>
      skills.filter(
        (item) => normalizeSkillType(item.skill_type) === "tema"
      ),
    [skills]
  );

  const habilidadesItems = useMemo(
    () =>
      skills.filter(
        (item) => normalizeSkillType(item.skill_type) === "habilidad"
      ),
    [skills]
  );

  const buildSkillTree = (items) => {
    const parentItems = items
      .filter((item) => !getParentId(item))
      .filter((item) => hasIcon(item))
      .sort((a, b) => getSkillLabel(a).localeCompare(getSkillLabel(b)));

    return parentItems.map((parent) => ({
      ...parent,
      children: items
        .filter((item) => String(getParentId(item)) === String(parent.id))
        .sort((a, b) => getSkillLabel(a).localeCompare(getSkillLabel(b))),
    }));
  };

  const temasTree = useMemo(() => buildSkillTree(temasItems), [temasItems]);

  const habilidadesTree = useMemo(
    () => buildSkillTree(habilidadesItems),
    [habilidadesItems]
  );

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

  const handleUniversitySelect = (uni, closeMobile = false) => {
    if (disabled) return;

    onTagSelect("universidades", {
      id: uni.id,
      nombre: getUniversityLabel(uni),
      slug: uni.slug || "",
      univ_ico: uni.univ_ico || "",
      univ_img: uni.univ_img || "",
    });

    setOpenSection(null);

    if (closeMobile) closeMobileFilters();
  };

  const handleCompanySelect = (empr, closeMobile = false) => {
    if (disabled) return;

    onTagSelect("empresas", {
      id: empr.id,
      nombre: getCompanyLabel(empr),
      slug: empr.slug || "",
      empr_ico: empr.empr_ico || "",
      empr_img: empr.empr_img || "",
    });

    setOpenSection(null);

    if (closeMobile) closeMobileFilters();
  };

  const handlePlatformSelect = (platform, closeMobile = false) => {
    if (disabled) return;

    onTagSelect("plataforma", {
      id: platform.id,
      nombre: getPlatformLabel(platform),
      slug: platform.slug || "",
      plat_ico: platform.plat_ico || platform.icon || "",
    });

    setOpenSection(null);

    if (closeMobile) closeMobileFilters();
  };

  const handleLanguageToggle = (code) => {
    if (disabled) return;
    onTagSelect("idioma", code);
  };

  const getIconSrc = (item, fallbackName = "") =>
    item?.skill_ico ||
    item?.skill_img ||
    item?.empr_ico ||
    item?.empr_img ||
    item?.univ_ico ||
    item?.univ_img ||
    item?.plat_ico ||
    item?.icon ||
    `/assets/category/${fallbackName || item?.nombre || item?.name}.png`;

  const getInitial = (label = "") => {
    const clean = label.toString().trim();
    return clean ? clean.charAt(0).toUpperCase() : "?";
  };

  const ImageWithInitial = ({ src, label, size = "sm" }) => {
    const [hasError, setHasError] = useState(false);

    const sizeClass =
      size === "md" ? "h-7 w-7 text-[12px]" : "h-5 w-5 text-[10px]";

    const imgSizeClass =
      size === "md" ? "max-h-6 max-w-6" : "max-h-5 max-w-5";

    if (!src || hasError) {
      return (
        <span
          className={`grid ${sizeClass} shrink-0 place-items-center rounded-full bg-[#F5F3EE] font-bold text-[#0F090B] ring-1 ring-black/10`}
          title={label}
        >
          {getInitial(label)}
        </span>
      );
    }

    return (
      <span
        className={`grid ${sizeClass} shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-black/10`}
      >
        <img
          className={`${imgSizeClass} object-contain`}
          src={src}
          alt={label}
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </span>
    );
  };

  const itemBaseClass =
    "group flex w-full items-center gap-3 rounded-xl px-3 py-1 text-left text-[15px] leading-tight text-neutral-700 transition-all duration-200 hover:bg-neutral-100 hover:text-black";

  const smallItemBaseClass =
    "group flex w-full items-center gap-2 rounded-xl px-3 py-1 text-left text-sm leading-tight text-neutral-700 transition-all duration-200 hover:bg-neutral-100 hover:text-black";

  const renderSkillTreeDesktop = (category, treeItems) =>
    treeItems.map((parent) => {
      const hasChildren =
        Array.isArray(parent.children) && parent.children.length > 0;

      const isHovered =
        openChildMenu &&
        openChildMenu.category === category &&
        openChildMenu.parentId === parent.id;

      return (
        <div
          key={parent.id}
          className="relative"
          onMouseEnter={() => {
            if (hasChildren && !disabled) {
              setOpenChildMenu({ category, parentId: parent.id });
            }
          }}
          onMouseLeave={() => hasChildren && setOpenChildMenu(null)}
        >
          <button
            type="button"
            onClick={() => handleSkillSelect(category, parent)}
            disabled={disabled}
            className={`${itemBaseClass} disabled:pointer-events-none disabled:opacity-50`}
          >
            <span className="flex min-w-0 flex-1 items-center gap-3">
              <ImageWithInitial
                src={getIconSrc(parent, parent.nombre)}
                label={getSkillLabel(parent)}
              />

              <span className="line-clamp-2">{getSkillLabel(parent)}</span>
            </span>

            {hasChildren && (
              <span className="text-lg text-neutral-400 transition-transform duration-200 group-hover:translate-x-1">
                ›
              </span>
            )}
          </button>

          {hasChildren && isHovered && (
            <div
              className="absolute left-full top-0 z-[999] ml-0 w-[310px] rounded-[15px] border border-black/10 bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
              data-lenis-prevent
            >
              <div className="mb-2 border-b border-neutral-100 px-3 pb-2 text-sm font-bold text-black">
                {getSkillLabel(parent)}
              </div>

              <div className="max-h-[60vh] overflow-y-auto pr-1">
                {parent.children.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => handleSkillSelect(category, child)}
                    disabled={disabled}
                    className={`${smallItemBaseClass} disabled:pointer-events-none disabled:opacity-50`}
                  >
                    {getSkillLabel(child)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    });

  const renderSkillTreeMobile = (category, treeItems) =>
    treeItems.map((parent) => {
      const hasChildren =
        Array.isArray(parent.children) && parent.children.length > 0;

      const isOpen = mobileOpenChild === `${category}-${parent.id}`;

      return (
        <div key={parent.id} className="border-b border-neutral-100 last:border-b-0">
          <div className="flex items-center gap-1 py-1">
            <button
              type="button"
              className={`${itemBaseClass} flex-1 disabled:pointer-events-none disabled:opacity-50`}
              onClick={() => handleSkillSelect(category, parent, true)}
              disabled={disabled}
            >
              <ImageWithInitial
                src={getIconSrc(parent, parent.nombre)}
                label={getSkillLabel(parent)}
              />

              <span>{getSkillLabel(parent)}</span>
            </button>

            {hasChildren && (
              <button
                type="button"
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-100 text-lg transition-transform duration-300 ${
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
            className={`transition-all duration-300 ease-out ${
              isOpen ? "max-h-[460px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-0 flex flex-col gap-1 pb-3">
              {parent.children.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  className={`${smallItemBaseClass} disabled:pointer-events-none disabled:opacity-50`}
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

  const renderUniversitiesDesktop = () => (
    <div
      className="absolute left-full top-0 z-[999] ml-0 w-[50vw] rounded-[15px] border border-black/10 bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
      data-lenis-prevent
    >
      <div className="max-h-[68vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-1">
          {Object.entries(universidadesPorRegion).map(
            ([region, universidades]) => (
              <div key={region}>
                <h3 className="sticky top-0 z-10 mb-0 rounded-xl bg-white px-3 py-2 text-sm font-bold text-black">
                  {region}
                </h3>

                <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
                  {(universidades || []).map((uni) => (
                    <button
                      key={uni.id}
                      type="button"
                      onClick={() => handleUniversitySelect(uni)}
                      disabled={disabled}
                      className={`${smallItemBaseClass} disabled:pointer-events-none disabled:opacity-50`}
                    >
                      <ImageWithInitial
                        src={uni.univ_ico || uni.univ_img}
                        label={getUniversityLabel(uni)}
                      />
                      <span className="line-clamp-2">
                        {getUniversityLabel(uni)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );

  const renderUniversitiesMobile = () => (
    <div className="flex flex-col gap-4">
      {Object.entries(universidadesPorRegion).map(([region, universidades]) => (
        <div key={region}>
          <h3 className="sticky top-0 z-10 mb-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-black">
            {region}
          </h3>

          <div className="flex flex-col gap-1">
            {(universidades || []).map((uni) => (
              <button
                key={uni.id}
                type="button"
                onClick={() => handleUniversitySelect(uni, true)}
                disabled={disabled}
                className={`${smallItemBaseClass} disabled:pointer-events-none disabled:opacity-50`}
              >
                <ImageWithInitial
                  src={uni.univ_ico || uni.univ_img}
                  label={getUniversityLabel(uni)}
                  size="md"
                />

                <span>{getUniversityLabel(uni)}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCompaniesDesktop = () => (
    <div
      className="absolute left-full top-0 z-[999] ml-0 w-[50vw] rounded-[15px] border border-black/10 bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
      data-lenis-prevent
    >
      <div className="max-h-[68vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
          {empresas.map((empr) => (
            <button
              key={empr.id}
              type="button"
              onClick={() => handleCompanySelect(empr)}
              disabled={disabled}
              className={`${smallItemBaseClass} disabled:pointer-events-none disabled:opacity-50`}
            >
              <ImageWithInitial
                src={empr.empr_ico || empr.empr_img}
                label={getCompanyLabel(empr)}
              />

              <span className="line-clamp-2">{getCompanyLabel(empr)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompaniesMobile = () => (
    <div className="flex flex-col gap-1">
      {empresas.map((empr) => (
        <button
          key={empr.id}
          type="button"
          onClick={() => handleCompanySelect(empr, true)}
          disabled={disabled}
          className={`${smallItemBaseClass} disabled:pointer-events-none disabled:opacity-50`}
        >
          <ImageWithInitial
            src={empr.empr_ico || empr.empr_img}
            label={getCompanyLabel(empr)}
            size="md"
          />

          <span>{getCompanyLabel(empr)}</span>
        </button>
      ))}
    </div>
  );

  const renderPlatforms = (isMobile = false) => (
    <div className="flex flex-col gap-1">
      {plataformas.map((platform) => (
        <button
          key={platform.id}
          type="button"
          onClick={() => handlePlatformSelect(platform, isMobile)}
          disabled={disabled}
          className={`${smallItemBaseClass} disabled:pointer-events-none disabled:opacity-50`}
        >
          <ImageWithInitial
            src={platform.plat_ico || platform.icon}
            label={getPlatformLabel(platform)}
            size="md"
          />

          <span>{getPlatformLabel(platform)}</span>
        </button>
      ))}
    </div>
  );

  const renderLanguages = (isMobile = false) => (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[13px] !font-[Montserrat] font-bold tracking-[0.08em] text-black">
          Idioma
        </h3>
      </div>

      <div
        data-lenis-prevent
        className={`flex flex-col gap-0 overflow-y-auto pr-1 ${
          isMobile ? "max-h-[300px] pb-8" : "max-h-[250px] pb-8"
        }`}
      >
        {idiomas.map((lang) => {
          const checked = isLanguageSelected(lang.code);

          return (
            <label
              key={lang.code}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-1 py-1 transition hover:bg-neutral-100"
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleLanguageToggle(lang.code)}
                  disabled={disabled}
                  className="relative h-[16px] w-[16px] shrink-0 cursor-pointer appearance-none [-webkit-appearance:none] [-moz-appearance:none] rounded-full border-2 border-[#BDBDBD] bg-white outline-none transition-all duration-200 checked:border-[#1941cf] checked:bg-white before:absolute before:left-1/2 before:top-1/2 before:z-2 before:h-[5px] before:w-[5px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-[#ffffff] before:opacity-0 before:transition-opacity before:duration-200 after:absolute after:left-1/2 after:top-1/2 after:z-1 after:h-[15px] after:w-[15px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-[#2563EB] after:opacity-0 after:transition-opacity after:duration-200 checked:before:opacity-100 checked:after:opacity-100"
                />

                <span className="text-[14px] leading-none text-neutral-700">
                  {lang.label}
                </span>
              </span>

              {typeof lang.count !== "undefined" && (
                <span className="text-xs text-neutral-400">{lang.count}</span>
              )}
            </label>
          );
        })}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex h-10 items-end justify-center bg-gradient-to-t from-white via-white/90 to-transparent pb-1">
        <span className="animate-bounce text-xs text-neutral-400">⌄</span>
      </div>
    </div>
  );

  const sections = [
    {
  title: "Tema",
  key: "temas",
  renderDesktop: () => (
    <div className="absolute left-full top-0 z-[999] ml-0 w-[330px] rounded-[15px] border border-black/10 bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
      <div className="max-h-[68vh] pr-1">
        {renderSkillTreeDesktop("temas", temasTree)}
      </div>
    </div>
  ),
  renderMobile: () => renderSkillTreeMobile("temas", temasTree),
},
{
  title: "Habilidad",
  key: "habilidad",
  renderDesktop: () => (
    <div className="absolute left-full top-0 z-[999] ml-0 w-[330px] rounded-[15px] border border-black/10 bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
      <div className="max-h-[68vh] pr-1">
        {renderSkillTreeDesktop("habilidad_id", habilidadesTree)}
      </div>
    </div>
  ),
  renderMobile: () => renderSkillTreeMobile("habilidad_id", habilidadesTree),
},
    {
      title: "Universidad",
      key: "universidades",
      renderDesktop: renderUniversitiesDesktop,
      renderMobile: renderUniversitiesMobile,
    },
    {
      title: "Empresa",
      key: "empresas",
      renderDesktop: renderCompaniesDesktop,
      renderMobile: renderCompaniesMobile,
    },
    {
      title: "Aliados",
      key: "plataforma",
      renderDesktop: () => (
        <div className="absolute left-full top-0 z-[999] ml-0 w-[310px] rounded-[15px] border border-black/10 bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          {renderPlatforms(false)}
        </div>
      ),
      renderMobile: () => renderPlatforms(true),
    },
    {
      title: "Idioma",
      key: "idioma",
      renderDesktop: () => renderLanguages(false),
      renderMobile: () => renderLanguages(true),
    },
  ];

  return (
    <div ref={indexRef} className="relative w-full">
      <div className="mb-1 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((prev) => !prev)}
          disabled={disabled}
          className="flex w-full items-center justify-between gap-4 rounded-[24px] bg-white p-4 text-left shadow-[0_16px_50px_rgba(0,0,0,0.04)] disabled:opacity-50"
        >
          <h2 className="text-2xl !font-[Montserrat] font-bold leading-none text-black">
            Biblioteca
          </h2>

          <span className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
            {mobileFiltersOpen ? "Ocultar filtros" : "Ver filtros"}

            <span
              className={`text-lg transition-transform duration-300 ${
                mobileFiltersOpen ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </span>
        </button>

        <div
          className={`transition-all duration-500 ease-out ${
            mobileFiltersOpen
              ? "mt-3 max-h-[78vh] opacity-100"
              : "max-h-0 overflow-hidden opacity-0"
          }`}
        >
          <div className="rounded-[28px] border border-black/10 bg-white p-3 shadow-[0_16px_50px_rgba(0,0,0,0.06)]">
            <div
              className="max-h-[72vh] overflow-y-auto overscroll-contain p-2"
              data-lenis-prevent
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg !font-[Montserrat] font-semibold text-black">
                  Filtros
                </h3>

                <button
                  type="button"
                  onClick={closeMobileFilters}
                  className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 text-black"
                >
                  ×
                </button>
              </div>

              {sections.map((section) => {
                const isOpen = mobileOpenSection === section.key;

                return (
                  <div
                    key={section.key}
                    className="border-t border-neutral-100 first:border-t-0"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setMobileOpenSection(isOpen ? null : section.key)
                      }
                      className="flex !font-[Montserrat] w-full items-center justify-between py-3 text-left font-semibold text-black"
                    >
                      {section.title}

                      <span
                        className={`text-lg transition-transform duration-300 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      >
                        ›
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        isOpen
                          ? "max-h-[560px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div
                        className={`rounded-[20px] bg-[#F8F7F4] p-2 ${
                          [
                            "temas",
                            "habilidades",
                            "universidades",
                            "empresas",
                            "idioma",
                          ].includes(section.key)
                            ? "max-h-[52vh] overflow-y-auto overscroll-contain"
                            : ""
                        }`}
                        data-lenis-prevent
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

      <div className="hidden lg:block">
        <div className="relative rounded-[24px] pb-2 px-2">
          <h2 className="mb-3 !font-[Montserrat] text-base font-bold text-black">
            Biblioteca
          </h2>

          <div className="relative flex flex-col gap-0">
            {sections
              .filter((section) => section.key !== "idioma")
              .map((section) => {
                const isOpen = openSection === section.key;

                return (
                  <div
                    key={section.key}
                    className="relative"
                    onMouseEnter={() => !disabled && setOpenSection(section.key)}
                    onMouseLeave={() => {
                      if (openSection === section.key) {
                        setOpenSection(null);
                        setOpenChildMenu(null);
                      }
                    }}
                  >
                    <button
                      type="button"
                      disabled={disabled}
                      className="group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-1 text-left !font-[Montserrat] text-[15px] font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-100 active:bg-neutral-100 hover:text-black hover:rounded-[15px] disabled:pointer-events-none disabled:opacity-50"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`text-lg text-neutral-400 transition-transform duration-300 ${
                            isOpen ? "rotate-90 text-black" : ""
                          }`}
                        >
                          ›
                        </span>

                        {section.title}
                      </span>
                    </button>

                    {isOpen && section.renderDesktop()}
                  </div>
                );
              })}
          </div>

          <div className="mt-3 border-t border-neutral-100 pt-4">
            {renderLanguages(false)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexCategories;