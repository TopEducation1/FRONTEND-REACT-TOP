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
    {
      img: "/assets/platforms/icons/icon-edx.png",
      text: "EdX",
      type: "Plataforma",
      tag: "1",
    },
    {
      img: "/assets/platforms/icons/icon-coursera.png",
      text: "Coursera",
      type: "Plataforma",
      tag: "2",
    },
    {
      img: "/assets/platforms/icons/icon-masterclass.png",
      text: "MasterClass",
      type: "Plataforma",
      tag: "3",
    },
  ],

  Temas: [
    {
      id: "41",
      img: "/assets/category/topic/ico-Aprendizaje-de-un-idioma.png",
      text: "Aprendizaje de idiomas",
      type: "Tema",
    },
    {
      id: "28",
      img: "/assets/category/topic/ico-Artes-y-humanidades.png",
      text: "Arte y humanidades",
      type: "Tema",
    },
    {
      id: "1",
      img: "/assets/category/topic/ico-Ciencia-de-datos.png",
      text: "Ciencias de datos",
      type: "Tema",
    },
    {
      id: "3",
      img: "/assets/category/topic/ico-Ciencias-de-la-computacion.png",
      text: "Ciencias de la Computación",
      type: "Tema",
    },
    {
      id: "20",
      img: "/assets/category/topic/ico-Ciencias-fisicas-e-ingenieria.png",
      text: "Ciencias físicas e ingeniería",
      type: "Tema",
    },
    {
      id: "23",
      img: "/assets/category/topic/ico-Ciencias-sociales.png",
      text: "Ciencias Sociales",
      type: "Tema",
    },
    {
      id: "13",
      img: "/assets/category/topic/ico-Desarrollo-personal.png",
      text: "Desarrollo personal",
      type: "Tema",
    },
    {
      id: "45",
      img: "/assets/category/topic/ico-Matematicas-y-logica.png",
      text: "Matemáticas y lógica",
      type: "Tema",
    },
    {
      id: "5",
      img: "/assets/category/topic/ico-Negocios.png",
      text: "Negocios",
      type: "Tema",
    },
    {
      id: "11230",
      img: "/assets/category/topic/ico-Salud.png",
      text: "Biología y Ciencias de la Vida",
      type: "Tema",
    },
    {
      id: "9",
      img: "/assets/category/topic/ico-Tecnologia-de-la-informacion.png",
      text: "Tecnología de la información",
      type: "Tema",
    },
  ],

  Universidades: [
    {
      id: "9",
      img: "/assets/universities/icons/ico-Harvard.webp",
      text: "Harvard University",
      type: "Universidad",
    },
    {
      id: "128",
      img: "/assets/universities/icons/ico-Stanford-University.webp",
      text: "Stanford University",
      type: "Universidad",
    },
    {
      id: "131",
      img: "/assets/universities/icons/ico-Massachusetts-Institute.webp",
      text: "Massachusetts Institute of Technology",
      type: "Universidad",
    },
    {
      id: "10",
      img: "/assets/universities/icons/ico-Yale-University.webp",
      text: "Yale University",
      type: "Universidad",
    },
    {
      id: "129",
      img: "/assets/universities/icons/ico-Columbia-University.webp",
      text: "Columbia University",
      type: "Universidad",
    },
    {
      id: "7",
      img: "/assets/universities/icons/ico-University-of-Michigan.webp",
      text: "University of Michigan",
      type: "Universidad",
    },
    {
      id: "38",
      img: "/assets/universities/icons/ico-University-of-Illinois-Urbana-Champaign.webp",
      text: "University of Illinois Urbana-Champaign",
      type: "Universidad",
    },
    {
      id: "54",
      img: "/assets/universities/icons/ico-University-of-Pennsylvania.webp",
      text: "University of Pennsylvania",
      type: "Universidad",
    },
    {
      id: "132",
      img: "/assets/universities/icons/ico-The-University-of-Chicago.webp",
      text: "The University of Chicago",
      type: "Universidad",
    },
    {
      id: "25",
      img: "/assets/universities/icons/ico-Universidad-de-los-Andes.webp",
      text: "Universidad de los Andes",
      type: "Universidad",
    },
    {
      id: "5",
      img: "/assets/universities/icons/ico-Universidad-nacional-de-colombia.webp",
      text: "Universidad Nacional de Colombia",
      type: "Universidad",
    },
    {
      id: "37",
      img: "/assets/universities/icons/ico-Tecnologico-de-Monterrey.webp",
      text: "Tecnológico de Monterrey",
      type: "Universidad",
    },
    {
      id: "20",
      img: "/assets/universities/icons/ico-Pontificia-Universidad-Catolica-de-Chile.webp",
      text: "Pontificia Universidad Católica de Chile",
      type: "Universidad",
    },
    {
      id: "389",
      img: "/assets/universities/icons/ico-Pontificia-Universidad-Catolica-del-Peru.webp",
      text: "Pontificia Universidad Católica del Perú",
      type: "Universidad",
    },
    {
      id: "137",
      img: "/assets/universities/icons/ico-Universidad-del-Rosario.webp",
      text: "Universidad del Rosario",
      type: "Universidad",
    },
    {
      id: "2",
      img: "/assets/universities/icons/ico-IE-Business-school.webp",
      text: "IE Business School",
      type: "Universidad",
    },
    {
      id: "144",
      img: "/assets/universities/icons/ico-Universidad-Tecnologica-de-Delft.webp",
      text: "Universidad Tecnológica de Delft",
      type: "Universidad",
    },
    {
      id: "165",
      img: "/assets/universities/icons/ico-Imperial-College-de-Londres.webp",
      text: "Imperial College de Londres",
      type: "Universidad",
    },
    {
      id: "134",
      img: "/assets/universities/icons/ico-Peking-University.webp",
      text: "Peking University",
      type: "Universidad",
    },
    {
      id: "155",
      img: "/assets/universities/icons/ico-National_University_of_Singapore.webp",
      text: "National University of Singapore",
      type: "Universidad",
    },
    {
      id: "307",
      img: "/assets/universities/icons/ico-Waseda.webp",
      text: "Universidad de Waseda",
      type: "Universidad",
    },
    {
      id: "315",
      img: "/assets/universities/icons/ico-u-tel-aviv.webp",
      text: "Universidad de Tel Aviv",
      type: "Universidad",
    },
  ],

  Empresas: [
    {
      id: "21",
      img: "/assets/companies/icons/ico-Google-Cloud.png",
      text: "Google Cloud",
      type: "Empresa",
    },
    {
      id: "26",
      img: "/assets/companies/icons/ico-IBM.png",
      text: "IBM",
      type: "Empresa",
    },
    {
      id: "13",
      img: "/assets/companies/icons/ico-Microsoft.png",
      text: "Microsoft",
      type: "Empresa",
    },
    {
      id: "52",
      img: "/assets/companies/icons/ico-meta.png",
      text: "Meta",
      type: "Empresa",
    },
    {
      id: "2",
      img: "/assets/companies/icons/ico-DeepLearning-AI.png",
      text: "DeepLearning.AI",
      type: "Empresa",
    },
    {
      id: "5",
      img: "/assets/companies/icons/ico-hubspot-academy.png",
      text: "HubSpot Academy",
      type: "Empresa",
    },
    {
      id: "8",
      img: "/assets/companies/icons/ico-Salesforce.png",
      text: "Salesforce",
      type: "Empresa",
    },
    {
      id: "36",
      img: "/assets/companies/icons/ico-HP.png",
      text: "HP",
      type: "Empresa",
    },
    {
      id: "119",
      img: "/assets/companies/icons/ico-oracle.png",
      text: "Oracle",
      type: "Empresa",
    },
    {
      id: "4",
      img: "/assets/companies/icons/ico-UBITS.png",
      text: "UBITS",
      type: "Empresa",
    },
  ],
};

  const getQueryKey = (category) => {
    const map = {
      Tema: "tema_id",
      Universidad: "universidad_id",
      Empresa: "empresa_id",
      Plataforma: "plataforma_id",
    };

    return map[category] || category;
  };

  const handleItemMenuClick = (category, item) => {
    const queryKey = getQueryKey(category);

    const isPlatform = category === "Plataforma";

    const queryValue = isPlatform
      ? item?.tag || item?.text || ""
      : item?.id ?? "";

    if (
      queryValue === "" ||
      queryValue === null ||
      queryValue === undefined
    ) {
      console.warn(
        `No se encontró valor para el filtro ${category}:`,
        item
      );
      return;
    }

    const params = new URLSearchParams();

    // Mostrar certificaciones tanto en español como en inglés.
    params.append("idioma", "es");
    params.append("idioma", "en");

    params.append(
      queryKey,
      String(queryValue).trim()
    );

    params.append("page", "1");
    params.append("page_size", "16");

    navigateWithTransition(
      `/explora?${params.toString()}`
    );

    closeMenuIfMobile();
    setShowSubmenu(false);
  };

  const handleGoExplore = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const params = new URLSearchParams();

    params.append("idioma", "es");
    params.append("idioma", "en");
    params.append("page", "1");
    params.append("page_size", "16");

    navigateWithTransition(
      `/explora?${params.toString()}`
    );

    closeMenuIfMobile();
    setShowSubmenu(false);
  };

  const handleMainItemClick = (item) => {
    if (item.isDropdown) {
      const params = new URLSearchParams();

      params.append("idioma", "es");
      params.append("idioma", "en");
      params.append("page", "1");
      params.append("page_size", "16");

      navigateWithTransition(
        `/explora?${params.toString()}`
      );

      closeMenuIfMobile();
      return;
    }

    if (!isActive(item.path)) {
      navigateWithTransition(item.path);
      closeMenuIfMobile();
    }
  };

  return (
    <div className="menu max-md:flex max-md:w-full max-md:flex-col max-md:gap-2 md:flex md:items-center">
      {menuItems.map((item) =>
        item.isDropdown ? (
          <div
            key={item.name}
            className={`
              menu-item dropdown relative ${item.classItem}
              ${isActive(item.path) ? "active" : ""}

              max-md:flex max-md:h-11 max-md:w-full max-md:cursor-pointer
              max-md:items-center max-md:justify-between max-md:rounded-xl
              max-md:px-4 max-md:text-left max-md:text-sm max-md:font-semibold
              max-md:text-[#D7D1CF]
            `}
            onClick={() => handleMainItemClick(item)}
            onMouseEnter={() => window.innerWidth >= 768 && setShowSubmenu(true)}
            onMouseLeave={() => window.innerWidth >= 768 && setShowSubmenu(false)}
          >
            <span>{item.name}</span>

            <FaChevronRight className="hidden max-md:block text-xs opacity-50" />

            <div
              className={`
                submenu ${showSubmenu ? "visible" : ""}
                max-md:hidden
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {Object.entries(exploraSubmenu).map(([section, items]) => (
                <div key={section} className={`submenu-section section-${section}`}>
                  <h4 className="text-sm text-[#F6F4EF]">
                    {section === "Plataforma" ? "Aliados" : section}
                  </h4>

                  <ul className="submenu-items">
                    {items.map((sub, idx) => (
                      <li key={`${section}-${sub.id || sub.tag || sub.text || idx}-${idx}`} className="submenu-item">
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
                className="absolute text-sm right-5 bottom-4 flex gap-2 items-center bg-[#F6F4EF] !text-[#1c1c1c] z-[11] !py-2 !px-5 !rounded-full"
              >
                Ver más certificaciones <FaChevronRight />
              </button>
            </div>
          </div>
        ) : (
          <button
            key={item.name}
            className={`
              menu-item transition duration-300 hover:text-shadow-[0_35px_35px_rgb(255_255_255_/_0.25)]
              ${item.classItem}
              ${isActive(item.path) ? "active" : ""}

              max-md:flex max-md:h-11 max-md:w-full max-md:items-center
              max-md:justify-between max-md:rounded-xl max-md:px-4
              max-md:text-left max-md:text-sm max-md:font-semibold
              max-md:text-[#D7D1CF]

              ${
                item.classItem === "item-empezar"
                  ? "max-md:mt-5 max-md:justify-center max-md:rounded-full max-md:bg-[#78C889] max-md:!text-white"
                  : ""
              }

              ${
                isActive(item.path) && item.classItem !== "item-empezar"
                  ? "max-md:bg-[#241D20] max-md:text-[#F6F4EF]"
                  : ""
              }
            `}
            onClick={() => handleMainItemClick(item)}
          >
            <span>{item.name}</span>

            {item.classItem !== "item-empezar" && (
              <FaChevronRight className="hidden max-md:block text-xs opacity-50" />
            )}
          </button>
        )
      )}
    </div>
  );
};

export default MenuTop;