import { NavLink, useLocation,useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { FaChevronRight } from "react-icons/fa";

const MenuTop = ({toggleMenu}) => {
  const location = useLocation();
  const [showSubmenu, setShowSubmenu] = useState(false);
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    /*{ name: 'Inicio', path: '/',classItem:'item-inicio' },*/
    { name: 'Explora', path: '/explora', isDropdown: true,classItem: 'item-explora' },
    { name: 'Recursos', path: '/recursos',classItem: 'item-recursos' },
    { name: 'Para equipos', path: '/para-equipos',classItem: 'item-equipos' },
    { name: 'Empieza ahora', path: '/empieza-ahora',classItem: 'item-empezar' },
  ];

  const exploraSubmenu = {
    Plataforma: [
      { img: '/assets/platforms/icons/icon-edx.png', text:'EdX', type:'Plataforma',tag:'EdX' },
      { img: '/assets/platforms/icons/icon-coursera.png', text:'Coursera', type:'Plataforma',tag:'Coursera'},
      { img: '/assets/platforms/icons/icon-masterclass.png', text:'Masterclass', type:'Plataforma',tag:'MasterClass'},
    ],
    Temas: [
      { img: '/assets/category/topic/ico-Aprendizaje-de-un-idioma.png', text: 'Aprendizaje de idioma', type:'Tema',tag:'Aprendizaje de idioma' },
      { img: '/assets/category/topic/ico-Artes-y-humanidades.png', text: 'Arte y humanidades', type:'Tema',tag:'Arte y humanidades' },
      { img: '/assets/category/topic/ico-Ciencia-de-datos.png', text: 'Ciencias de datos', type:'Tema',tag:'Ciencias de datos' },
      { img: '/assets/category/topic/ico-Ciencias-de-la-computacion.png', text: 'Ciencias de la computación', type:'Tema',tag:'Ciencias de la computación' },
      { img: '/assets/category/topic/ico-Ciencias-sociales.png', text: 'Ciencias Sociales', type:'Tema',tag:'Ciencias Sociales' },
      { img: '/assets/category/topic/ico-Ciencias-fisicas-e-ingenieria.png', text: 'Ciencia física e ingeniería', type:'Tema',tag:'Ciencia física e ingeniería' },
      { img: '/assets/category/topic/ico-Desarrollo-personal.png', text: 'Desarrollo personal', type:'Tema',tag:'Desarrollo personal' },
      { img: '/assets/category/topic/ico-Matematicas-y-logica.png', text: 'Matemáticas y lógica', type:'Tema',tag:'Matemáticas y lógica' },
      { img: '/assets/category/topic/ico-Negocios.png', text: 'Negocios', type:'Tema',tag:'Negocios' },
      { img: '/assets/category/topic/ico-Salud.png', text: 'Salud', type:'Tema',tag:'Salud' },
      { img: '/assets/category/topic/ico-Tecnologia-de-la-informacion.png', text: 'Tecnología de la información', type:'Tema',tag:'Tecnología de la información' }
    ],
    Habilidades: [
      { img: '/assets/category/ability/ico-Bienestar.png', text: 'Bienestar', type:'Habilidad',tag:'Bienestar' },
      { img: '/assets/category/ability/ico-Comunicacion.png', text: 'Comunicación', type:'Habilidad',tag:'Comunicación' },
      { img: '/assets/category/ability/ico-Creatividad.png', text: 'Creatividad', type:'Habilidad',tag:'Creatividad' },
      { img: '/assets/category/ability/ico-Crecimiento-personal.png', text: 'Crecimiento personal', type:'Habilidad',tag:'Crecimiento personal' },
      { img: '/assets/category/ability/ico-Diversidad-equidad-e-inclusion.png', text: 'Diversidad e inclusión', type:'Habilidad',tag:'Diversidad e inclusión' },
      { img: '/assets/category/ability/ico-Estrategia.png', text: 'Estrategia', type:'Habilidad',tag:'Estrategia' },
      { img: '/assets/category/ability/ico-Liderazgo.png', text: 'Liderazgo', type:'Habilidad',tag:'Liderazgo' },
      { img: '/assets/category/ability/ico-Personas-y-cultura.png', text: 'Personas y cultura', type:'Habilidad',tag:'Personas y cultura' },
      { img: '/assets/category/ability/ico-Productividad.png', text: 'Productividad', type:'Habilidad',tag:'Productividad' },
      { img: '/assets/category/ability/ico-Trabajo-en-equipo.png', text: 'Trabajo en equipo', type:'Habilidad',tag:'Trabajo en equipo' }
    ],
    Universidades: [
        { img: '/assets/category/TE-University of Michigan.webp', text: 'University of Michigan', type:'Universidad',tag:'University of Michigan' },
        { img: '/assets/category/TE-Berklee college of music.webp', text: 'Berklee College of Music', type:'Universidad',tag:'Berklee College of Music' },
        { img: '/assets/category/TE-PEKING.webp', text: 'UPeking University', type:'Universidad',tag:'UPeking University' },
        { img: '/assets/category/TE-Columbia University.webp', text: 'Columbia University', type:'Universidad',tag:'Columbia University' },
        { img: '/assets/category/TE-Harvard University.webp', text: 'Harvard University', type:'Universidad',tag:'Harvard University' },
        { img: '/assets/category/TE-Yale University.webp', text: 'Yale University', type:'Universidad',tag:'Yale University' },
        { img: '/assets/category/TE-Stanford University.webp', text: 'Stanford University', type:'Universidad',tag:'Stanford University' },
        { img: '/assets/category/TE-University of Toronto.webp', text: 'University of Toronto', type:'Universidad',tag:'University of Toronto' },
        { img: '/assets/category/TE-CHICAGO.webp', text: 'The University of Chicago', type:'Universidad',tag:'The University of Chicago' },
        { img: '/assets/category/TE-University of Pennsylvania.webp', text: 'University of Pennsylvania', type:'Universidad',tag:'University of Pennsylvania' },
        { img: '/assets/category/TE-Universidad Nacional de Colombia.webp', text: 'Universidad Nacional de Colombia', type:'Universidad',tag:'Universidad Nacional de Colombia' },
        { img: '/assets/category/TE-Tecnológico de Monterrey.webp', text: 'Tecnológico de Monterrey', type:'Universidad',tag:'Tecnológico de Monterrey' },
        { img: '/assets/category/TE-Universidad de los Andes.webp', text: 'Universidad de los Andes', type:'Universidad',tag:'Universidad de los Andes' },
        { img: '/assets/category/TE-Pontificia Universidad Católica del Perú.webp', text: 'Universidad Católica del Perú', type:'Universidad',tag:'Pontificia Universidad Católica del Perú' },
        { img: '/assets/category/TE-Universidad Anáhuac.webp', text: 'Universidad Anáhuac', type:'Universidad',tag:'Universidad Anáhuac' },
        { img: '/assets/category/TE-Pontificia Universidad Católica de Chile.webp', text: 'Universidad Católica de Chile', type:'Universidad',tag:'Pontificia Universidad Católica de Chile' },
        { img: '/assets/category/TE-SAE Institute México.webp', text: 'SAE Institute México', type:'Universidad',tag:'SAE Institute México' },
        { img: '/assets/category/TE-Universidad de Palermo.webp', text: 'Universidad de Palermo', type:'Universidad',tag:'Universidad de Palermo' },
        { img: '/assets/category/TE-Universidad Austral.webp', text: 'Universidad Austral', type:'Universidad',tag:'Universidad Austral' },
      ]
  };
    const handleItemMenuClick = (category, tag) => {
       console.log(category, tag);

      const categoryParam = category; // asegura que esté en minúsculas
      const tagParam = encodeURIComponent(tag); // codifica y pone en minúscula

      const query = `${categoryParam}=${tagParam}&page=1&page_size=15`;
      navigate(`/explora/filter?${query}`);
    };

  return (
    <div className="menu">
      {menuItems.map((item) =>
        item.isDropdown ? (
            <div
            key={item.name}
            to={item.path}
            className={`menu-item dropdown ${item.classItem} ${isActive(item.path) ? 'active' : ''}`}
            onClick={(e) => isActive(item.path) && e.preventDefault()}
            onMouseEnter={() => setShowSubmenu(true)}
            onMouseLeave={() => setShowSubmenu(false)}
          >
            <span>{item.name}</span>
            {showSubmenu && (
              <div className="submenu">
                {Object.entries(exploraSubmenu).map(([section, items]) => (
                  <div key={section} className={`submenu-section section-${section}`}>
                    <h4 className='section-tit'>{section==="Plataforma"?"Aliados":section}</h4>
                    <ul className="submenu-items">
                      {items.map((sub, idx) => (
                        <li key={idx} className="submenu-item">
                            <a onClick={() => handleItemMenuClick(sub.type, sub.tag)} >
                                <img className='item-ico' src={sub.img} alt={sub.text || ''} />
                                {sub.text && <span>{sub.text}</span>}
                            </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <NavLink className='absolute right-10 bottom-5 flex gap-2 items-center py-1 px-3 rounded-lg btn-col-2' to="/explora">Ver más certificaciones <FaChevronRight /></NavLink>
              </div>
            )}
          </div>
        ) : (
          <NavLink
            key={item.name}
            to={item.path}
            className={`menu-item ${item.classItem} ${isActive(item.path) ? 'active' : ''}`}
            onClick={(e) => isActive(item.path) && e.preventDefault()}
          >
            {item.name}
          </NavLink>
        )
      )}
    </div>
  );
};

export default MenuTop;
