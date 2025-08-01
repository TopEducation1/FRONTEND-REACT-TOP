import React, { useEffect,useState } from 'react'
import { Helmet } from "react-helmet";
import { useNavigate } from 'react-router-dom';
import AnimatedCounter from "../components/AnimatedCounter";
import BlogsGrid from "../components/BlogsGrid";
import { Link } from 'react-router-dom';

import endpoints from '../config/api';

export default function LoMasTop() {
  const [empresas, setEmpresas] = useState([]);
  const [universidades, setUniversidades] = useState([]); 
  const [selectedTags, setSelectedTags] = useState({});

  
  useEffect(() => {
    fetch(endpoints.empresas)
        .then(res => res.json())
        .then(data => {
          const filtradasYOrdenadas = data
          .filter(t => t.empr_est?.toLowerCase() === "enabled")
          .filter(t => t.empr_top !== null && t.empr_top !== "" && !isNaN(Number(t.empr_top)))
          .sort((a, b) => Number(a.empr_top) - Number(b.empr_top)); // Orden ascendente
          setEmpresas(filtradasYOrdenadas);
        });

    fetch(endpoints.universities)
        .then(res => res.json())
        .then(data => {
          const filtradasYOrdenadas = data
      .filter(t => t.univ_est?.toLowerCase() === "enabled")
      .filter(t => t.univ_top !== null && t.univ_top !== "" && !isNaN(Number(t.univ_top)))
      .sort((a, b) => Number(a.univ_top) - Number(b.univ_top)); // Orden ascendente
          setUniversidades(filtradasYOrdenadas);
        });
  }, []);
  const sections = [
    {
      title: "Universidad",
      renderContent: () => renderItems(universidades,"Universidad") // solo el array
    },
    {
      title: "Empresa",
      renderContent: () => renderItems(empresas,"Empresa") // solo el array
    }
  ];

  const navigate = useNavigate();
  
  function navigateWithTransition(path, options = {}) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(path, options);
      });
    } else {
      navigate(path, options);
    }
  }

  const handleItemMenuClick = (tagsObject) => {
    setSelectedTags((prevTags) => {
      const updatedTags = { ...prevTags };
      for (const [category, tag] of Object.entries(tagsObject)) {
        if (!updatedTags[category]) {
          updatedTags[category] = [tag];
        } else if (!updatedTags[category].includes(tag)) {
          updatedTags[category].push(tag);
        }
      }
      const queryParams = new URLSearchParams();
      for (const [cat, tags] of Object.entries(updatedTags)) {
        tags.forEach((tag) => queryParams.append(cat, tag));
      }
      navigateWithTransition(`/explora/filter?${queryParams.toString()}`, {
        replace: true,
        state: { selectedTags: updatedTags },
      });
      return updatedTags;
    });
  };

  const renderItems = (items,title) => {
    if (!Array.isArray(items)) {
      console.warn('items no es un array:', items);
      return <p>No hay datos disponibles</p>;
    }
    

    return items
      .filter((item) => item.empr_ico || item.univ_ico) // Filtra solo los que tienen imagen
      .slice(0, 14) // Limita a los primeros 14
      .map((item, i) => {
        const imgSrc = item.empr_ico || item.univ_ico;
      return (
          <Link
            to="#"
            className='w-[45%] gap-2 p-2 flex items-center'
            onClick={() =>
              handleItemMenuClick({
                [title]: item.nombre,
              })
            }
          >
              <img
                  className="w-[25%]"
                  src={item.empr_ico || item.univ_ico}
                  alt={item.nombre}
              />
              <span className='text-[1.2rem] text-[#F6F4EF] leading-[1.2em]'>
                {item.nombre}
              </span>
          </Link>
       );
      });
    };

  
  return (
    <>
      {/**SEO ELEMENTS WITH REACT -HELMET */}
      <Helmet>
          <title>Lo más top! | Top.education</title>
          <meta name="description" content="Descubre ebooks y blogs exclusivos de Top.education. Accede a contenido valioso para potenciar tu conocimiento y alcanzar tus metas personales y profesionales." />
          <meta property="og:title" content="Top Education | Aprende con edX, Coursera y MasterClass" />
          <meta name="author" content="Top Education" />
          <meta name="robots" content="index, follow" />
          <meta property="og:description" content="Descubre ebooks y blogs exclusivos de Top Education. Accede a contenido valioso para potenciar tu conocimiento y alcanzar tus metas personales y profesionales." />
          <meta property="og:type" content="website" />
      </Helmet>
      <section className="wrapper h-[80vh] w-full flex justify-center items-center bg-gradient-to-t from-transparent to-[#1c1c1c]">
        <div className="container m-auto mx-auto gap-2  sect-h-pequ">
            <div className='m-auto max-w-[100vw] lg:max-w-[50vw] pt-50'>
                <h1 className="text-[#F6F4EF] text-7xl font-normal font-[Lora] text-center leading-[1em] z-10 relative sm:text-6xl md:text-6xl lg:text-6xl xl:text-8xl">Lo más <span className='top-italic'>Top!</span></h1>
                <p className="mt-5 text-[2.125rem] text-[#F6F4EF] leading-[1em] text-center z-10 relative"> Encuentra tu próxima certificación</p>
                <p className="mt-5 text-[1.125rem] text-[#a8a8a8] text-center z-10 relative">
                  Explora los programas más demandados, descubre las mejores oportunidades de formación y mantente al día con todo lo que necesitas para avanzar en tu carrera.
                </p>                        
            </div>
            <div className='text-center px-6 md:px-16 mt-20 mb-[-130px]'>
              <input
                type="text"
                placeholder="Buscar entre miles de certificaciones..."
                className="w-full max-w-xl px-4 py-2 rounded-full text-black mb-4"
              />
              <p className="text-sm text-[#F6F4EF] mb-2"> Busca por tema, habilidad, universidad o institución</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs mt-4">
                {['Certificados', 'Google', 'Amazon', 'Desarrollo Personal', 'Programación', 'Negocios', 'Marketing', 'IA'].map((tag, idx) => (
                  <span key={idx} className="bg-[#F6F4EF] px-3 py-1 rounded-full hover:bg-neutral-400 cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* Proveedores / Universidades / Instituciones */}
      <section className="wrapper mt-40">
        <div className='m-auto container'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {/* Universidades */}
            <div>
              <h4 className="text-[2rem] font-semibold mb-3 text-[#F6F4EF]"> <AnimatedCounter end={100} title="Universidades" /></h4>
              <div className="flex flex-wrap gap-2">
                {sections
                  .find(s => s.title === "Universidad")
                  ?.renderContent()}
              </div>
              <Link className="mt-4 text-[#F6F4EF] text-[1.5rem] hover:underline" to="/lo-mas-top/universidades">Ver universidades →</Link>
            </div>

            {/* Instituciones */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-[#F6F4EF]"><AnimatedCounter end={40} title="Instituciones" /></h4>
              <div className="flex flex-wrap gap-2">
                {sections
                  .find(s => s.title === "Empresa")
                  ?.renderContent()}
              </div>
              <Link className="mt-4 text-[#F6F4EF] text-[1.5rem] hover:underline" to="/lo-mas-top/empresas">Ver instituciones →</Link>
            </div>
        </div>
        </div>
        
      </section>

      {/* Rankings Section */}
      <section className="py-12 px-6 md:px-16 text-center">
        <h3 className="text-[4rem] font-bold text-[#F6F4EF] mb-[-10px]">Rankings de lo más <span className='top-italic'>Top!</span></h3>
        <p className="text-gray-300 mb-8">
          Más de 250,000 reseñas escritas por usuarios te ayudan a elegir los mejores cursos.
        </p>

        <div className="flex flex-col md:flex-row justify-center mt-10 items-center gap-6">
          <div className="bg-[#5CC781] p-4 rounded-xl flex w-[30%] hover:scale-105 transition cursor-pointer">
            <div className='w-[40%]'>
              <img src="/assets/category/top-rankings.webp" className='!w-full mt-[-30px] ml-[-30px] mr-[-50px]' alt="" />
            </div>
            <div className='w-[60%] text-left flex flex-wrap items-center'>
              <div>
                <h4 className="text-[1.5rem]  font-bold leading-[1.2em]  mb-2">Las 50 Universidades<br></br> <span className='text-[2.75rem]'>más Top!</span></h4>
                <p className="text-[1rem] text-[#F6F4EF]">De todos los tiempos</p>
              </div>
            </div>
          </div>
          <div className="bg-[#034694] p-4 rounded-xl flex w-[30%] hover:scale-105 transition cursor-pointer">
            <div className='w-[35%]'>
              <img src="/assets/category/top-ranking-cert.webp" className='!w-full mt-[-50px] ml-[-20px]' alt="" />
            </div>
            <div className='w-[65%] text-left flex flex-wrap items-center'>
              <div>
                <h4 className="text-[1.2rem] text-[#F6F4EF]  font-bold leading-[1.2em] ">100 de las Certificaciones<br></br> <span className='text-[2.2rem]'>Más Populares</span></h4>
                <p className="text-[1rem] text-[#F6F4EF]">del año 2025</p>
              </div> 
            </div>
          </div>   
        </div>
      </section>
      <section className="wrapper">
          <div className="container m-auto">
              <BlogsGrid category='Lo más Top'/>
          </div>
      </section>

    </>
  )
}
