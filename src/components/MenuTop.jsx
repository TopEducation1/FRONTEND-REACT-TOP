import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaChevronRight } from "react-icons/fa";

const MenuTop = ({ toggleMenu }) => {
  const location = useLocation();
  const [showSubmenu, setShowSubmenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('toggleMenu prop recibido:', toggleMenu);
  }, [toggleMenu]);

  const isActive = (path) => location.pathname === path;

  const closeMenuIfMobile = () => {
    if (window.innerWidth < 768 && typeof toggleMenu === 'function') {
      toggleMenu();
    }
  };

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(path);
      });
    } else {
      navigate(path);
    }
  }

  const normalizeCategoryKey = (key) => {
    const map = {
      Plataforma: "plataforma",
      Empresas: "empresas",
      Empresa: "empresas",
      Universidad: "universidades",
      Universidades: "universidades",
      Temas: "temas",
      Tema: "temas",
      Habilidades: "habilidades",
      Habilidad: "habilidades",
      plataforma: "plataforma",
      empresas: "empresas",
      universidades: "universidades",
      temas: "temas",
      habilidades: "habilidades",
    };

    return map[key] || String(key).toLowerCase();
  };

  const getQueryKey = (category) => {
    const normalizedCategory = normalizeCategoryKey(category);

    const map = {
      temas: "Tema",
      habilidades: "Habilidad",
      universidades: "Universidad",
      empresas: "Empresa",
      plataforma: "Plataforma",
    };

    return map[normalizedCategory] || category;
  };

  const getMenuTagUrlValue = (category, item) => {
    const normalizedCategory = normalizeCategoryKey(category);

    if (normalizedCategory === "temas" || normalizedCategory === "habilidades") {
      return item.tag || "";
    }

    return item.tag || item.text || "";
  };

  const handleItemMenuClick = (category, item) => {
    const queryKey = getQueryKey(category);
    const queryValue = getMenuTagUrlValue(category, item);

    if (!queryValue) return;

    const params = new URLSearchParams();
    params.append(queryKey, queryValue);
    params.append("page", "1");
    params.append("page_size", "16");

    navigateWithTransition(`/explora?${params.toString()}`);
    closeMenuIfMobile();
  };

  const menuItems = [
    /*{ name: 'Inicio', path: '/',classItem:'item-inicio' },*/
    { name: 'Explora', path: '/explora', isDropdown: true, classItem: 'item-explora' },
    //{ name: 'Originals', path: '/top-originals',classItem: 'item-orginals' },
    { name: 'Lo más Top', path: '/lo-mas-top', classItem: 'item-mastop' },
    { name: 'Recursos', path: '/recursos', classItem: 'item-recursos' },
    { name: 'Para equipos', path: '/para-equipos', classItem: 'item-equipos' },
    { name: 'Empieza ahora', path: '/empieza-ahora', classItem: 'item-empezar' },
  ];

  const exploraSubmenu = {
    Plataforma: [
      { img: '/assets/platforms/icons/icon-edx.png', text:'EdX', type:'Plataforma', tag:'EdX' },
      { img: '/assets/platforms/icons/icon-coursera.png', text:'Coursera', type:'Plataforma', tag:'Coursera' },
      { img: '/assets/platforms/icons/icon-masterclass.png', text:'Masterclass', type:'Plataforma', tag:'MasterClass' },
    ],
    Temas: [
      { img: '/assets/category/topic/ico-Aprendizaje-de-un-idioma.png', text: 'Aprendizaje de idiomas', type:'Tema', tag:'language-learning' },
      { img: '/assets/category/topic/ico-Artes-y-humanidades.png', text: 'Arte y humanidades', type:'Tema', tag:'arts-and-humanities' },
      { img: '/assets/category/topic/ico-Ciencia-de-datos.png', text: 'Ciencias de datos', type:'Tema', tag:'data-science' },
      { img: '/assets/category/topic/ico-Ciencias-de-la-computacion.png', text: 'Ciencias de la computación', type:'Tema', tag:'computer-science' },
      { img: '/assets/category/topic/ico-Ciencias-sociales.png', text: 'Ciencias sociales', type:'Tema', tag:'social-sciences' },
      { img: '/assets/category/topic/ico-Ciencias-fisicas-e-ingenieria.png', text: 'Ciencias físicas e ingeniería', type:'Tema', tag:'physical-science-and-engineering' },
      { img: '/assets/category/topic/ico-Desarrollo-personal.png', text: 'Desarrollo personal', type:'Tema', tag:'personal-development' },
      { img: '/assets/category/topic/ico-Matematicas-y-logica.png', text: 'Matemáticas y lógica', type:'Tema', tag:'math-and-logic' },
      { img: '/assets/category/topic/ico-Negocios.png', text: 'Negocios', type:'Tema', tag:'business' },
      { img: '/assets/category/topic/ico-Salud.png', text: 'Salud', type:'Tema', tag:'health' },
      { img: '/assets/category/topic/ico-Tecnologia-de-la-informacion.png', text: 'Tecnología de la información', type:'Tema', tag:'information-technology' },
    ],
    Habilidades: [
      { img: '/assets/category/ability/ico-Bienestar.png', text: 'Bienestar', type:'Habilidad', tag:'bienestar' },
      { img: '/assets/category/ability/ico-Comunicacion.png', text: 'Comunicación', type:'Habilidad', tag:'comunicacion' },
      { img: '/assets/category/ability/ico-Creatividad.png', text: 'Creatividad', type:'Habilidad', tag:'creatividad' },
      { img: '/assets/category/ability/ico-Crecimiento-personal.png', text: 'Crecimiento personal', type:'Habilidad', tag:'crecimiento-personal' },
      { img: '/assets/category/ability/ico-Diversidad-equidad-e-inclusion.png', text: 'Diversidad e inclusión', type:'Habilidad', tag:'diversidad-equidad-e-inclusion' },
      { img: '/assets/category/ability/ico-Estrategia.png', text: 'Estrategia', type:'Habilidad', tag:'estrategia' },
      { img: '/assets/category/ability/ico-Liderazgo.png', text: 'Liderazgo', type:'Habilidad', tag:'liderazgo' },
      { img: '/assets/category/ability/ico-Personas-y-cultura.png', text: 'Personas y cultura', type:'Habilidad', tag:'personas-y-cultura' },
      { img: '/assets/category/ability/ico-Productividad.png', text: 'Productividad', type:'Habilidad', tag:'productividad' },
      { img: '/assets/category/ability/ico-Trabajo-en-equipo.png', text: 'Trabajo en equipo', type:'Habilidad', tag:'trabajo-en-equipo' }
    ],
    Universidades: [
      { img: '/assets/universities/icons/ico-Universidad-nacional-de-colombia.webp', text: 'Universidad Nacional de Colombia', type:'Universidad', tag:'Universidad Nacional de Colombia' },
      { img: '/assets/universities/icons/ico-University-of-Michigan.webp', text: 'University of Michigan', type:'Universidad', tag:'University of Michigan' },

      { img: '/assets/universities/icons/ico-Tecnologico-de-Monterrey.webp', text: 'Tecnológico de Monterrey', type:'Universidad', tag:'Tecnológico de Monterrey' },
      { img: '/assets/universities/icons/ico-Berklee-College-of-Music.webp', text: 'Berklee College of Music', type:'Universidad', tag:'Berklee College of Music' },

      { img: '/assets/universities/icons/ico-Universidad-de-los-Andes.webp', text: 'Universidad de los Andes', type:'Universidad', tag:'Universidad de los Andes' },
      { img: '/assets/universities/icons/ico-Peking-University.webp', text: 'Peking University', type:'Universidad', tag:'Peking University' },

      { img: '/assets/universities/icons/ico-Pontificia-Universidad-Catolica-del-Peru.webp', text: 'Universidad Católica del Perú', type:'Universidad', tag:'Pontificia Universidad Católica del Perú' },
      { img: '/assets/universities/icons/ico-Columbia-University.webp', text: 'Columbia University', type:'Universidad', tag:'Columbia University' },

      { img: '/assets/universities/icons/ico-Universidades-Anahuac.webp', text: 'Universidad Anáhuac', type:'Universidad', tag:'Universidad Anáhuac' },
      { img: '/assets/universities/icons/ico-Harvard.webp', text: 'Harvard University', type:'Universidad', tag:'Harvard University' },

      { img: '/assets/universities/icons/ico-Pontificia-Universidad-Catolica-de-Chile.webp', text: 'Universidad Católica de Chile', type:'Universidad', tag:'Pontificia Universidad Católica de Chile' },
      { img: '/assets/universities/icons/ico-Yale-University.webp', text: 'Yale University', type:'Universidad', tag:'Yale University' },

      { img: '/assets/universities/icons/ico-SAE-Mexico.webp', text: 'SAE Institute México', type:'Universidad', tag:'SAE Institute México' },
      { img: '/assets/universities/icons/ico-Stanford-University.webp', text: 'Stanford University', type:'Universidad', tag:'Stanford University' },

      { img: '/assets/universities/icons/ico-Universidad-de-Palermo.webp', text: 'Universidad de Palermo', type:'Universidad', tag:'Universidad de Palermo' },
      { img: '/assets/universities/icons/ico-University-of-Toronto.webp', text: 'University of Toronto', type:'Universidad', tag:'University of Toronto' },

      { img: '/assets/universities/icons/ico-Universidad-Austral.webp', text: 'Universidad Austral', type:'Universidad', tag:'Universidad Austral' },
      { img: '/assets/universities/icons/ico-The-University-of-Chicago.webp', text: 'The University of Chicago', type:'Universidad', tag:'The University of Chicago' },

      { img: '/assets/universities/icons/ico-University-of-Pennsylvania.webp', text: 'University of Pennsylvania', type:'Universidad', tag:'University of Pennsylvania' },
    ]
  };

  return (
    <div className="menu">
      {menuItems.map((item) =>
        item.isDropdown ? (
          <div
            key={item.name}
            className={`menu-item dropdown ${item.classItem} ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => {
              if (!isActive(item.path)) {
                navigateWithTransition(item.path);
                closeMenuIfMobile();
              }
            }}
            onMouseEnter={() => setShowSubmenu(true)}
            onMouseLeave={() => setShowSubmenu(false)}
          >
            <span>{item.name}</span>

            <div
              className={`submenu ${showSubmenu ? 'visible' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              {Object.entries(exploraSubmenu).map(([section, items]) => (
                <div key={section} className={`submenu-section section-${section}`}>
                  <h4 className='section-tit text-[#F6F4EF]'>
                    {section === "Plataforma" ? "Aliados" : section}
                  </h4>

                  <ul className="submenu-items">
                    {items.map((sub, idx) => (
                      <li key={idx} className="submenu-item">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleItemMenuClick(sub.type, sub);
                          }}
                        >
                          <img className='item-ico' src={sub.img} alt={sub.text || ''} />
                          {sub.text && <span className='leading-[1.1em]'>{sub.text}</span>}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigateWithTransition("/explora");
                  closeMenuIfMobile();
                }}
                className='absolute right-5 bottom-5 flex gap-2 items-center py-1 px-3 bg-[#F6F4EF] !text-[#1c1c1c] z-[11] !py-2 !px-5 !rounded-full'
              >
                Ver más certificaciones <FaChevronRight />
              </button>
            </div>
          </div>
        ) : (
          <button
            key={item.name}
            className={`menu-item transition duration-300 hover:text-shadow-[0_35px_35px_rgb(255_255_255_/_0.25)] ${item.classItem} ${item.classItem === 'item-empezar' ? '  ' : ''} ${isActive(item.path) ? 'active' : ''}`}
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