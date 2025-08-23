import React, { useEffect,useState } from 'react'
import { Helmet } from "react-helmet";
import { useNavigate} from 'react-router-dom';
import AnimatedCounter from "../components/AnimatedCounter";
import HorizontalScroll from "../components/HorizontalScroll";
import SearchLMT from "../components/SearchLMT";
import BlogsGrid from "../components/BlogsGrid";
import RankingsGrid from "../components/RankingsGrid";

import { Link } from 'react-router-dom';

import endpoints from '../config/api';

export default function LoMasTop() {
  const [empresas, setEmpresas] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [rankingName1, setRankingName1] = useState("");
  const [rankingName2, setRankingName2] = useState("");
  const [rankingName1Slug, setRankingName1Slug] = useState("");
  const [rankingName2Slug, setRankingName2Slug] = useState("");
  const [selectedTags, setSelectedTags] = useState({});
  const [limit, setLimit] = useState(7);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const calcLimit = () =>
      window.matchMedia("(max-width: 767px)").matches ? 7 : 14;

    // set inicial
    setLimit(calcLimit());

    // listener con pequeño debounce
    let tid;
    const onResize = () => {
      clearTimeout(tid);
      tid = setTimeout(() => setLimit(calcLimit()), 150);
    };

    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  
  useEffect(() => {
    const toSlug = (str) =>
    str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    Promise.all([
      fetch(endpoints.ranking_detail("Top-50-de-universidades")).then(res => res.json()),
      fetch(endpoints.ranking_detail("Top-50-de-empresas")).then(res => res.json())
    ])
    .then(([universidadesData, empresasData]) => {
      // Ranking universidades
      if (universidadesData?.entradas) {
        setRankingName1(universidadesData.nombre);
        setRankingName1Slug(toSlug(universidadesData.nombre));
        
        const universidadesFiltradas = universidadesData.entradas
          .filter(e => e.universidad !== null) // solo universidades
          .map(e => ({
            nombre: e.universidad?.nombre || e.nombre,
            univ_ico: e.universidad?.univ_ico,
            ...e
          }));
        setUniversidades(universidadesFiltradas);
      }

      // Ranking empresas
      if (empresasData?.entradas) {
        setRankingName2(empresasData.nombre);
        setRankingName2Slug(toSlug(empresasData.nombre));
        const empresasFiltradas = empresasData.entradas
          .filter(e => e.empresa !== null) // solo empresas
          .map(e => ({
            nombre: e.empresa?.nombre || e.nombre,
            empr_ico: e.empresa?.empr_ico,
            ...e
          }));
        setEmpresas(empresasFiltradas);
      }
    })
    .catch(err => console.error("Error cargando rankings:", err));
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
      .slice(0, limit)// Limita a los primeros 14
      .map((item, i) => {
        const imgSrc = item.empr_ico || item.univ_ico;
      return (
          <Link
            to="#"
            className='w-full lg:w-[48%] gap-2 p-1 flex items-center'
            onClick={() =>
              handleItemMenuClick({
                [title]: item.nombre,
              })
            }
          >
              <img
                  className="w-[35px] lg:w-[18%]"
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
      <section className="w-screen h-full flex-shrink-0 bg-gradient-to-t from-transparent to-[#1c1c1c]">
        <HorizontalScroll>
          <div className='w-[100vw] flex justify-center items-center px-5'>
            <div className='m-auto max-w-[100vw] lg:max-w-[60vw] flex flex-wrap'>
                <h1 className="text-[#F6F4EF] block w-[100%] lg:w-[30%] text-[4rem] font-normal font-[Lora] text-center lg:text-left leading-[1.5em] z-10 relative sm:text-[5rem] md:text-[5rem] lg:text-[5rem] xl:text-[6rem]">Lo más <br></br><span className='top-italic text-[8rem] lg:text-[10rem]' >Top!</span></h1>
                <div className='w-[100%] lg:w-[70%] lg:pl-10'>
                  <h2 className="mt-2 text-[1.7rem] lg:text-[2.125rem] text-[#F6F4EF] font-[Lora] leading-[1em] text-center lg:text-left z-10 relative"> Encuentra tu próxima certificación</h2>
                  <p className="mt-2 text-[1.125rem] text-[#a8a8a8] text-center lg:text-left z-10 relative">
                    Descubre oportunidades de formación diseñadas para el futuro. Prepárate y da el siguiente paso en tu carrera profesional.
                  </p>
                  <SearchLMT/>
                  
                </div>                     
            </div>
          </div>
          {/* Rankings Section */}
          <div className='w-[100vw] px-10'>
            <div className='m-auto max-w-[100vw] flex flex-wrap justify-center pt-90 lg:pt-100'>
              <div>
                <h3 className="text-[3rem] md:text-[4rem] text-[#F6F4EF] text-center leading-[1.2em] mb-[-10px]"><span className='text-[4rem] md:text-[5rem]'>Rankings</span><br></br> de lo más <span className='top-italic'>Top!</span></h3>
                <p className="my-4 text-[1.125rem] text-[#a8a8a8] max-w-[80%] m-auto text-center z-10 relative">
                  Más de 250,000 reseñas escritas por usuarios te ayudan a elegir los mejores cursos.
                </p>
              </div>
              
            </div>
          </div>
        </HorizontalScroll>
      </section>
      {/* Proveedores / Universidades / Instituciones */}
      <section className="w-screen h-full flex-shrink-0 p-5 lg:p-10 mt-[-70%] lg:mt-[-20%]">
        <div className='container m-auto'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm pt-10 lg:pt-20">
            {/* Universidades */}
            <div>
              <h4 className="text-[2rem] font-semibold mb-3 text-[#F6F4EF]"> {rankingName1} </h4>
              <div className="flex flex-wrap gap-1">
                {sections
                  .find(s => s.title === "Universidad")
                  ?.renderContent()}
              </div>
              <Link className="mt-5 flex max-w-[250px] font-bold transition duration-300  hover:text-shadow-[0_35px_35px_rgb(255_255_255_/_0.25)] item-empezar  ml-4 shadow-[0px_0px_10px_3px_#F6F4EF] bg-[#F6F4EF] !text-[#1c1c1c] z-[11] !py-2 !px-5 !rounded-full " to={`/lo-mas-top/ranking/${rankingName1Slug}`}>Ver el top de universidades →</Link>
            </div>
            {/* Instituciones */}
            <div className='my-5  lg:my-0'>
              <h4 className="text-[2rem] font-semibold mb-3 text-[#F6F4EF]"> {rankingName2}</h4>
              <div className="flex flex-wrap gap-1">
                {sections
                  .find(s => s.title === "Empresa")
                  ?.renderContent()}
              </div>
              <Link className="mt-5 flex max-w-[220px] font-bold transition duration-300  hover:text-shadow-[0_35px_35px_rgb(255_255_255_/_0.25)] item-empezar  ml-4 shadow-[0px_0px_10px_3px_#F6F4EF] bg-[#F6F4EF] !text-[#1c1c1c] z-[11] !py-2 !px-5 !rounded-full" to={`/lo-mas-top/ranking/${rankingName2Slug}`}>Ver el top de empresas →</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="wrapper">
        <div className="container m-auto">
          <RankingsGrid/>
          <h3 className='text-white text-center text-[3rem] mb-4'>Ranking de blog</h3>
          {/*<div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-5">
            <Link to="/lo-mas-top/ranking/Top-10-de-universidades" className="rounded-xl flex w-[80%] md:w-[30%] hover:scale-105 transition cursor-pointer">
              <img src="/assets/content/banners/Top-50-Universidades.webp" className='!w-full rounded-xl' alt="" />
              {/*<div className='w-[40%]'>
                <img src="/assets/category/top-rankings.webp" className='!w-full mt-[-30px] ml-[-30px] mr-[-50px]' alt="" />
              </div>
              <div className='w-[60%] text-left flex flex-wrap items-center'>
                <div>
                  <h4 className="text-[1.5rem]  font-bold leading-[1.2em]  mb-2">Las 50 Universidades<br></br> <span className='text-[2.75rem]'>más Top!</span></h4>
                  <p className="text-[1rem] text-[#F6F4EF]">De todos los tiempos</p>
                </div>
              </div>
            </Link>
            <Link to="/lo-mas-top/ranking/Las-50-mejores-empresas-latam-2025" className="bg-[#034694] rounded-xl flex w-[80%] md:w-[30%] hover:scale-105 transition cursor-pointer">
              <img src="/assets/content/banners/Top-100-Certificaciones.webp" className='!w-full rounded-xl' alt="" />
              {/*<div className='w-[35%]'>
                <img src="/assets/category/top-ranking-cert.webp" className='!w-full mt-[-50px] ml-[-20px]' alt="" />
              </div>
              <div className='w-[65%] text-left flex flex-wrap items-center'>
                <div>
                  <h4 className="text-[1.2rem] text-[#F6F4EF]  font-bold leading-[1.2em] ">100 de las Certificaciones<br></br> <span className='text-[2.2rem]'>Más Populares</span></h4>
                  <p className="text-[1rem] text-[#F6F4EF]">del año 2025</p>
                </div> 
              </div>
            </Link>   
          </div>*/}
          <BlogsGrid category='Lo más Top'/>
        </div>
      </section>
    </>
  )
}
