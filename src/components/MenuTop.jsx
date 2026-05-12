import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { FaChevronRight } from "react-icons/fa";
import endpoints from "../config/api";

const MenuTop = ({ toggleMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSubmenu, setShowSubmenu] = useState(false);

  const [platforms, setPlatforms] = useState([]);
  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [universities, setUniversities] = useState([]);

  const isActive = (path) => location.pathname === path;

  const closeMenuIfMobile = () => {
    if (window.innerWidth < 768 && typeof toggleMenu === "function") {
      toggleMenu();
    }
  };

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(path));
    } else {
      navigate(path);
    }
  }

  const isValidImage = (value) => {
    if (!value) return false;
    const v = String(value).trim().toLowerCase();
    return v && !["none", "null", "undefined"].includes(v);
  };

  const getImage = (item, keys = []) => {
    for (const key of keys) {
      if (isValidImage(item?.[key])) return item[key];
    }
    return "";
  };

  const normalizeSkillType = (value) => {
    const v = (value || "").toString().trim().toLowerCase();
    if (["tema", "category", "principal"].includes(v)) return "tema";
    return "";
  };

  const getParentId = (item) => {
    if (!item?.parent && !item?.parent_id) return null;
    if (typeof item.parent === "object") return item.parent.id || null;
    return item.parent || item.parent_id || null;
  };

  const getSkillLabel = (item) => {
    return item?.translate && item.translate.trim() !== ""
      ? item.translate
      : item?.nombre || "";
  };

  useEffect(() => {
    fetch(endpoints.platforms)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];

        const fallback = [
          {
            id: "edx",
            nombre: "EdX",
            plat_ico: "/assets/platforms/icons/icon-edx.png",
          },
          {
            id: "coursera",
            nombre: "Coursera",
            plat_ico: "/assets/platforms/icons/icon-coursera.png",
          },
          {
            id: "masterclass",
            nombre: "MasterClass",
            plat_ico: "/assets/platforms/icons/icon-masterclass.png",
          },
        ];

        setPlatforms(safeData.length ? safeData : fallback);
      })
      .catch(() => {
        setPlatforms([
          {
            id: "edx",
            nombre: "EdX",
            plat_ico: "/assets/platforms/icons/icon-edx.png",
          },
          {
            id: "coursera",
            nombre: "Coursera",
            plat_ico: "/assets/platforms/icons/icon-coursera.png",
          },
          {
            id: "masterclass",
            nombre: "MasterClass",
            plat_ico: "/assets/platforms/icons/icon-masterclass.png",
          },
        ]);
      });

    fetch(endpoints.skills)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        const rows = safeData
          .filter((item) => item?.estado === true || item?.estado === 1 || item?.estado === "1")
          .filter((item) => normalizeSkillType(item.skill_type) === "tema")
          .filter((item) => !getParentId(item))
          .filter((item) => item?.slug)
          .sort((a, b) => getSkillLabel(a).localeCompare(getSkillLabel(b)))
          .slice(0, 12);

        setTopics(rows);
      })
      .catch(() => setTopics([]));

    fetch(endpoints.empresas)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];

        const uniqueNames = new Set();

        const rows = safeData
          .filter((item) => item?.empr_est === "enabled" || item?.estado === true)
          .filter((item) => isValidImage(item?.empr_ico) || isValidImage(item?.empr_img))

          // evitar duplicados tipo Google / Google Cloud
          .filter((item) => {
            const normalized = String(item?.nombre || "")
              .trim()
              .toLowerCase();

            if (!normalized) return false;

            // evita repetir marcas similares
            const rootName = normalized.split(" ")[0];

            if (uniqueNames.has(rootName)) return false;

            uniqueNames.add(rootName);
            return true;
          })

          .sort((a, b) => {
            const topA = Number(a?.total_certificaciones || a?.empr_top || 0);
            const topB = Number(b?.total_certificaciones || b?.empr_top || 0);
            return topB - topA;
          })

          // máximo 10
          .slice(0, 10);

        setCompanies(rows);
      })
      .catch(() => setCompanies([]));

    fetch(endpoints.universities)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];

        const rows = safeData
          .filter((item) => item?.univ_est === "enabled" || item?.estado === true)
          .filter((item) => isValidImage(item?.univ_ico) || isValidImage(item?.univ_img))
          .sort((a, b) => {
            const topA = Number(a?.total_certificaciones || a?.univ_top || 0);
            const topB = Number(b?.total_certificaciones || b?.univ_top || 0);
            return topB - topA;
          })
          .slice(0, 18);

        setUniversities(rows);
      })
      .catch(() => setUniversities([]));
  }, []);

  const menuItems = [
    { name: "Explora", path: "/explora", isDropdown: true, classItem: "item-explora" },
    { name: "Lo más Top", path: "/lo-mas-top", classItem: "item-mastop" },
    { name: "Recursos", path: "/recursos", classItem: "item-recursos" },
    { name: "Para equipos", path: "/para-equipos", classItem: "item-equipos" },
    { name: "Empieza ahora", path: "/empieza-ahora", classItem: "item-empezar" },
  ];

  const exploraSubmenu = useMemo(() => {
    return {
      Plataforma: platforms.map((item) => ({
        img:
          getImage(item, ["plat_ico", "plat_img"]) ||
          `/assets/platforms/icons/icon-${String(item.nombre || "").toLowerCase()}.png`,
        text: item.nombre,
        type: "Plataforma",
        tag: item.nombre,
      })),

      Temas: topics.map((item) => ({
        img:
          getImage(item, ["skill_ico", "skill_img"]) ||
          `/assets/category/${item.nombre}.png`,
        text: getSkillLabel(item),
        type: "Tema",
        tag: item.slug,
      })),

      

      Universidades: universities.map((item) => ({
        img: getImage(item, ["univ_ico", "univ_img"]),
        text: item.nombre,
        type: "Universidad",
        tag: item.nombre,
      })),

      Empresas: companies.map((item) => ({
        img: getImage(item, ["empr_ico", "empr_img"]),
        text: item.nombre,
        type: "Empresa",
        tag: item.nombre,
      })),
    };
  }, [platforms, topics, companies, universities]);

  const getQueryKey = (category) => {
    const map = {
      Tema: "Tema",
      Universidad: "Universidad",
      Empresa: "Empresa",
      Plataforma: "Plataforma",
    };

    return map[category] || category;
  };

  const handleItemMenuClick = (category, item) => {
    const queryKey = getQueryKey(category);
    const queryValue = item?.tag || item?.text || "";

    if (!queryValue) return;

    const params = new URLSearchParams();

    params.append("idioma", "es");
    params.append("idioma", "en");
    const normalizedValue =
      category === "Tema"
        ? String(queryValue).trim().toLowerCase()
        : String(queryValue).trim();

    params.append(queryKey, normalizedValue);
    params.append("page", "1");
    params.append("page_size", "16");

    navigateWithTransition(`/explora?${params.toString()}`);
    closeMenuIfMobile();
    setShowSubmenu(false);
  };

  const handleGoExplore = (e) => {
    e.preventDefault();
    e.stopPropagation();

    navigateWithTransition("/explora?idioma=es&idioma=en&page=1&page_size=16");
    closeMenuIfMobile();
    setShowSubmenu(false);
  };

  return (
    <div className="menu">
      {menuItems.map((item) =>
        item.isDropdown ? (
          <div
            key={item.name}
            className={`menu-item dropdown ${item.classItem} ${
              isActive(item.path) ? "active" : ""
            }`}
            onClick={() => {
              if (window.innerWidth < 768) {
                setShowSubmenu((prev) => !prev);
                return;
              }

              if (!isActive(item.path)) {
                navigateWithTransition(item.path);
                closeMenuIfMobile();
              }
            }}
            onMouseEnter={() => window.innerWidth >= 768 && setShowSubmenu(true)}
            onMouseLeave={() => window.innerWidth >= 768 && setShowSubmenu(false)}
          >
            <span>{item.name}</span>

            <div
              className={`submenu ${showSubmenu ? "visible" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              {Object.entries(exploraSubmenu).map(([section, items]) => (
                <div key={section} className={`submenu-section section-${section}`}>
                  <h4 className="section-tit text-[#F6F4EF]">
                    {section === "Plataforma" ? "Aliados" : section}
                  </h4>

                  <ul className="submenu-items">
                    {items.map((sub, idx) => (
                      <li key={`${section}-${sub.tag}-${idx}`} className="submenu-item">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleItemMenuClick(sub.type, sub);
                          }}
                        >
                          {sub.img && (
                            <img
                              className="item-ico"
                              src={sub.img}
                              alt={sub.text || ""}
                              loading="lazy"
                            />
                          )}
                          {sub.text && (
                            <span className="leading-[1.1em]">{sub.text}</span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <button
                onClick={handleGoExplore}
                className="absolute right-5 bottom-5 flex gap-2 items-center bg-[#F6F4EF] !text-[#1c1c1c] z-[11] !py-2 !px-5 !rounded-full"
              >
                Ver más certificaciones <FaChevronRight />
              </button>
            </div>
          </div>
        ) : (
          <button
            key={item.name}
            className={`menu-item transition duration-300 hover:text-shadow-[0_35px_35px_rgb(255_255_255_/_0.25)] ${
              item.classItem
            } ${isActive(item.path) ? "active" : ""}`}
            onClick={() => {
              if (!isActive(item.path)) {
                navigateWithTransition(item.path);
                closeMenuIfMobile();
              }
            }}
          >
            {item.name}
          </button>
        )
      )}
    </div>
  );
};

export default MenuTop;