import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";

const MenuTop = ({ toggleMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSubmenu, setShowSubmenu] = useState(false);

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

  const menuItems = [
    { name: "Explora", path: "/explora", isDropdown: true, classItem: "item-explora" },
    { name: "Lo más Top", path: "/lo-mas-top", classItem: "item-mastop" },
    { name: "Recursos", path: "/recursos", classItem: "item-recursos" },
    { name: "Para equipos", path: "/para-equipos", classItem: "item-equipos" },
    { name: "Empieza ahora", path: "/empieza-ahora", classItem: "item-empezar" },
  ];

  const exploraSubmenu = {
    Plataforma: [
      { img: "/assets/platforms/icons/icon-edx.png", text: "EdX", type: "Plataforma", tag: "EdX" },
      { img: "/assets/platforms/icons/icon-coursera.png", text: "Coursera", type: "Plataforma", tag: "Coursera" },
      { img: "/assets/platforms/icons/icon-masterclass.png", text: "MasterClass", type: "Plataforma", tag: "MasterClass" },
    ],

    Temas: [
      { img: "/assets/category/topic/ico-Aprendizaje-de-un-idioma.png", text: "Aprendizaje de idiomas", type: "Tema", tag: "language-learning" },
      { img: "/assets/category/topic/ico-Artes-y-humanidades.png", text: "Arte y humanidades", type: "Tema", tag: "arts-and-humanities" },
      { img: "/assets/category/topic/ico-Ciencia-de-datos.png", text: "Ciencias de datos", type: "Tema", tag: "data-science" },
      { img: "/assets/category/topic/ico-Ciencias-de-la-computacion.png", text: "Ciencias de la Computación", type: "Tema", tag: "computer-science" },
      { img: "/assets/category/topic/ico-Ciencias-fisicas-e-ingenieria.png", text: "Ciencias físicas e ingeniería", type: "Tema", tag: "physical-science-and-engineering" },
      { img: "/assets/category/topic/ico-Ciencias-sociales.png", text: "Ciencias Sociales", type: "Tema", tag: "social-sciences" },
      { img: "/assets/category/topic/ico-Desarrollo-personal.png", text: "Desarrollo personal", type: "Tema", tag: "personal-development" },
      { img: "/assets/category/topic/ico-Matematicas-y-logica.png", text: "Matemáticas y lógica", type: "Tema", tag: "math-and-logic" },
      { img: "/assets/category/topic/ico-Negocios.png", text: "Negocios", type: "Tema", tag: "business" },
      { img: "/assets/category/topic/ico-Salud.png", text: "Salud", type: "Tema", tag: "health" },
      { img: "/assets/category/topic/ico-Tecnologia-de-la-informacion.png", text: "Tecnología de la información", type: "Tema", tag: "information-technology" },
    ],

    Universidades: [
      // Norteamérica
      { img: "/assets/universities/icons/ico-Harvard.webp", text: "Harvard University", type: "Universidad", tag: "Harvard University" },
      { img: "/assets/universities/icons/ico-Stanford-University.webp", text: "Stanford University", type: "Universidad", tag: "Stanford University" },
      { img: "/assets/universities/icons/ico-Massachusetts-Institute.webp", text: "Massachusetts Institute of Technology", type: "Universidad", tag: "Massachusetts Institute of Technology" },
      { img: "/assets/universities/icons/ico-Yale-University.webp", text: "Yale University", type: "Universidad", tag: "Yale University" },
      { img: "/assets/universities/icons/ico-Columbia-University.webp", text: "Columbia University", type: "Universidad", tag: "Columbia University" },
      { img: "/assets/universities/icons/ico-University-of-Michigan.webp", text: "University of Michigan", type: "Universidad", tag: "University of Michigan" },
      { img: "/assets/universities/icons/ico-University-of-Illinois-Urbana-Champaign.webp", text: "University of Illinois Urbana-Champaign", type: "Universidad", tag: "University of Illinois Urbana-Champaign" },
      { img: "/assets/universities/icons/ico-University-of-Pennsylvania.webp", text: "University of Pennsylvania", type: "Universidad", tag: "University of Pennsylvania" },
      { img: "/assets/universities/icons/ico-The-University-of-Chicago.webp", text: "The University of Chicago", type: "Universidad", tag: "The University of Chicago" },

      // Latinoamérica
      { img: "/assets/universities/icons/ico-Universidad-de-los-Andes.webp", text: "Universidad de los Andes", type: "Universidad", tag: "Universidad de los Andes" },
      { img: "/assets/universities/icons/ico-Universidad-nacional-de-colombia.webp", text: "Universidad Nacional de Colombia", type: "Universidad", tag: "Universidad Nacional de Colombia" },
      { img: "/assets/universities/icons/ico-Tecnologico-de-Monterrey.webp", text: "Tecnológico de Monterrey", type: "Universidad", tag: "Tecnológico de Monterrey" },
      { img: "/assets/universities/icons/ico-Pontificia-Universidad-Catolica-de-Chile.webp", text: "Pontificia Universidad Católica de Chile", type: "Universidad", tag: "Pontificia Universidad Catolica de Chile" },
      { img: "/assets/universities/icons/ico-Pontificia-Universidad-Catolica-del-Peru.webp", text: "Pontificia Universidad Católica del Perú", type: "Universidad", tag: "Pontificia Universidad Catolica de Peru" },
      { img: "/assets/universities/icons/ico-Universidad-del-Rosario.webp", text: "Universidad del Rosario", type: "Universidad", tag: "Universidad del Rosario" },

      // Europa
      { img: "/assets/universities/icons/ico-IE-Business-school.webp", text: "IE Business School", type: "Universidad", tag: "IE Business School" },
      { img: "/assets/universities/icons/ico-Universidad-Tecnologica-de-Delft.webp", text: "Universidad Tecnológica de Delft", type: "Universidad", tag: "Universidad Tecnológica de Delft" },
      { img: "/assets/universities/icons/ico-Imperial-College-de-Londres.webp", text: "Imperial College de Londres", type: "Universidad", tag: "Imperial College de Londres" },

      // Asia / Oriente
      { img: "/assets/universities/icons/ico-Peking-University.webp", text: "Peking University", type: "Universidad", tag: "Peking University" },
      { img: "/assets/universities/icons/ico-National_University_of_Singapore.webp", text: "National University of Singapore", type: "Universidad", tag: "National University of Singapore" },
      { img: "/assets/universities/icons/ico-Waseda.webp", text: "Universidad de Waseda", type: "Universidad", tag: "Universidad de Waseda" },
      { img: "/assets/universities/icons/ico-u-tel-aviv.webp", text: "Universidad de Tel Aviv", type: "Universidad", tag: "Universidad de Tel Aviv" },
    ],

    Empresas: [
      { img: "/assets/companies/icons/ico-Google-Cloud.png", text: "Google Cloud", type: "Empresa", tag: "Google Cloud" },
      { img: "/assets/companies/icons/ico-IBM.png", text: "IBM", type: "Empresa", tag: "IBM" },
      { img: "/assets/companies/icons/ico-Microsoft.png", text: "Microsoft", type: "Empresa", tag: "Microsoft" },
      { img: "/assets/companies/icons/ico-meta.png", text: "Meta", type: "Empresa", tag: "Meta" },
      { img: "/assets/companies/icons/ico-DeepLearning-AI.png", text: "DeepLearning.AI", type: "Empresa", tag: "DeepLearning.AI" },
      { img: "/assets/companies/icons/ico-hubspot-academy.png", text: "HubSpot Academy", type: "Empresa", tag: "HubSpot Academy" },
      { img: "/assets/companies/icons/ico-Salesforce.png", text: "Salesforce", type: "Empresa", tag: "Salesforce" },
      { img: "/assets/companies/icons/ico-HP.png", text: "HP", type: "Empresa", tag: "HP" },
      { img: "/assets/companies/icons/ico-oracle.png", text: "Oracle", type: "Empresa", tag: "Oracle" },
      { img: "/assets/companies/icons/ico-UBITS.png", text: "UBITS", type: "Empresa", tag: "UBITS" },
    ],
  };

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
                navigateWithTransition("/explora?idioma=es&idioma=en&page=1&page_size=16");
                closeMenuIfMobile();
                return;
              }

              if (!isActive(item.path)) {
                navigateWithTransition("/explora?idioma=es&idioma=en&page=1&page_size=16");
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