import { useRef, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from "react-helmet";
import HorizontalScroll from "../components/HorizontalScroll";
import HeroSlider from "../components/HeroSlider";

import endpoints from '../config/api';


export default function TopOriginals() {

  const { slug } = useParams(); 
console.log("Slug actual:", slug);

  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
  // Reiniciar scroll vertical
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Reiniciar scroll horizontal si está disponible
  if (scrollRef.current) {
    scrollRef.current.scrollLeft = 0;
  }

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [slug]); // importante: depende del slug

  useEffect(() => {
    const fetchOriginal = async () => {
      try {
        //console.log("Obteniendo slug:", slug);
        const res = await axios.get(endpoints.original_detail(slug));
        //console.log("Respuesta del backend:", res.data);
        setOriginal(res.data);
      } catch (error) {
        console.error("Error al cargar autor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOriginal();
  }, [slug]);

   // Configura el efecto hasta cierto punto del scroll
  const maxScroll = 400; // puedes ajustar esto
  const clampedScroll = Math.min(scrollY, maxScroll);

  const scale = 1 + clampedScroll / (maxScroll * 2); // zoom in desde 1 hasta ~1.2
  const opacity = Math.max(1 - clampedScroll / maxScroll, 0); // de 1 a 0


  const scrollRef = useRef()

  const NUM_SLIDES = original?.certifications?.length ? original.certifications.length + 2 : 10;
  //console.error("Total de certificaciones:", original.certifications.length);

  const SECTION_HEIGHT = 100 // vh
  const SCROLL_START = SECTION_HEIGHT * 1 // después de 1 pantalla

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const el = scrollRef.current

      const start = window.innerHeight * 1.5 // ajuste aquí (1 = una pantalla de alto)
      const maxScroll = window.innerHeight * NUM_SLIDES

      if (scrollTop >= start && scrollTop <= start + maxScroll) {
        const relativeScroll = scrollTop - start
        if (el) {
          el.scrollLeft = relativeScroll
        }
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  // 🔹 Validaciones
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh] w-full py-4">
        <svg className="animate-spin h-6 w-6 text-neutral-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span className="ml-2 text-neutral-700">Cargando...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-white my-30 text-center">{error}</p>;
  }

  if (!original) {
    return <p className="text-white my-30 text-center">No se encontró el autor.</p>;
  }

return (
  <>
    {/**SEO ELEMENTS WITH REACT -HELMET */}
    <Helmet>
        <title>{original.name} | Top.education</title>
        <meta name="description" content="Descubre ebooks y blogs exclusivos de Top.education. Accede a contenido valioso para potenciar tu conocimiento y alcanzar tus metas personales y profesionales." />
        <meta property="og:title" content="Top Education | Aprende con edX, Coursera y MasterClass" />
        <meta name="author" content="Top Education" />
        <meta name="robots" content="index, follow" />
        <meta property="og:description" content="Descubre ebooks y blogs exclusivos de Top Education. Accede a contenido valioso para potenciar tu conocimiento y alcanzar tus metas personales y profesionales." />
        <meta property="og:type" content="website" />
    </Helmet>
  <div className="text-[#F6F4EF] font-sans">
    {loading ? (
      <div className="flex justify-center items-center w-full h-screen py-4">
        <svg
          className="animate-spin h-6 w-6 text-neutral-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="ml-2 text-neutral-700">Cargando...</span>
      </div>
    ) : original ? (
        <section className="relative h-[90vh] w-full pt-80 pb-50 overflow-hidden">
          <img
            src={`${original.image}`}
            alt={original.name}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-[400ms] ease-out"
              style={{
              transform: `scale(${scale})`,
              opacity: opacity,
            }}
          />
          
          <div className="absolute h-full bg-linear-to-b from-transparent to-[#0F090B] inset-0 flex flex-col justify-end items-center text-center px-6 md:px-20 " style={{background: 'linear-gradient(0deg, #0F090B, transparent)'}}>
            <h1 className="text-[2.75rem] lg:text-[3.75rem] font-semibold leading-snug text-[#F6F4EF]">
              ¿Qué habría aprendido<br/> 
              <span className="top-italic text-[3.5rem] leading-[1.2em] text-[#a8a8a8]">{original.name}</span> en 
              <span><span id='top'>top</span><span id='education'>.education</span></span>?
            </h1>
          </div>
        </section>
      ) : (
        <p className="text-red-500 text-center py-10">No se encontró el autor.</p>
      )}

      {/* Texto introductorio */}
       <section className="wrapper">
        <div className='m-auto container px-6 md:px-20 py-10 md:py-16'>
            <p
              className="mb-6 text-[1.125rem] text-[#a8a8a8] mt-[-30px] lg:mt-[-50px] leading-[1.2em] text-center"
              dangerouslySetInnerHTML={{ __html: original.biog }}
            />
        </div>
      </section>

      {/* Fake alto para simular scroll vertical */}
        <section className="wrapper">
          <section className="w-screen h-full flex-shrink-0">
            <HorizontalScroll className="lg:px-30">
                  {original?.certifications?.map((item, index) => (
                    <div key={index} className={`w-screen lg:w-[50vw] px-10 py-20 flex flex-col md:flex-row ${index == 0 ? "lg:ml-30":""}  justify-center  bg-no-repeat ${index % 2 !== 0 ? "bg-[url(/assets/content/originals/top-education-line-medium.svg)] bg-size-[50%] bg-right items-end":"bg-[url(/assets/content/originals/top-education-line-large.svg)] bg-size-[50%] items-start bg-right"}`}>
                      <div className='w-full lg:w-[45vw] flex flex-wrap relative '>
                        <img src={item.fondo} className={`absolute h-[50vh] z-[-5] object-contain opacity-25 ${index % 2 !== 0 ? "bottom-[90%]":"top-[90%]"}`} alt="" />
                          <div className='w-full lg:w-[60%] pr-0 lg:pr-30'>
                            <h2 className='block w-full text-[2.75rem]  top-italic leading-[1.1em] text-[#F6F4EF]'>{item.title}</h2>
                            <p className='text-[1.12rem] leading-[1.1em] text-[#a8a8a8] mt-3'>{item.hist}</p>
                          </div>
                          <Link to={`/certificacion/${item.certification_detail.plataforma_certificacion.nombre.toLowerCase()}/${item.certification_slug}`} className="w-full mt-10 lg:mt-0 lg:w-[40%] hover:scale-110 duration-200">
                            <div className='h-auto bg-[#F6F4EF] w-[80%] lg:w-full  rounded-xl'>
                              <img
                                src={item.certification_image_url}
                                alt={item.certification_title}
                                className="rounded-xl"
                              />
                              <div className="w-full py-1 px-3">
                                <h3 className="text-[1.2rem] text-center text-[#0F090B] leading-[1.1em] font-semibold mb-1"> {item.certification_title}</h3>
                                <div className='tag-platform'>
                                  <img src={item.certification_detail.plataforma_certificacion.plat_img} alt="" />
                                </div>
                              </div>
                            </div>
                          </Link>
                          <Link to={`/explora/filter?${item.certification_detail.tema_certificacion.tem_type}=${item.certification_detail.tema_certificacion.nombre}&page=1&page_size=16`} className={`w-[70px] absolute hover:scale-110 duration-300 cursor-pointer right-[5%] md:right-[7%] ${index % 2 !== 0 ? "top-[50%] lg:top-[-25%]":"bottom-[47%] lg:bottom-[-25%]"}`}>
                            <img src={item.certification_detail.tema_certificacion.tem_img} alt="" />
                          </Link>
                        </div>
                    </div>
                  ))}
                </HorizontalScroll>
            </section>
        </section>
        <section className="wrapper relative section">
        <div className="container m-auto">
          <HeroSlider />
        </div>
      </section>
    </div>
    </>
  )
}



