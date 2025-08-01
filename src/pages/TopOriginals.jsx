import { useRef, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from "react-helmet";

import HeroSlider from "../components/HeroSlider";

import endpoints from '../config/api';

const authors = [
    {
      name: "Leonardo da Vinci",
      image: "assets/content/sliders/slider-Leonardo-da-Vinci.png",
      link: "/originals/leonardo-da-vinci",
      description: "Pintor, científico, ingeniero y anatomista renacentista."
    },{
      name: "Marie Curie",
      image: "assets/content/sliders/slider-Marie-Curie.png",
      link: "/originals/marie-curie",
      description: "Científica, pionera de la radiactividad, Nobel en física y química."
    },{
      name: "Malala Yousafzai",
      image: "assets/content/sliders/slider-Malala.png",
      link: "/originals/malala-yousafzai",
      description: "Activista por la educación y los derechos de las niñas, Nobel de la Paz."
    },{
      name: "Walt Disney",
      image: "assets/content/sliders/slider-Walt.png",
      link: "/originals/walt-disney",
      description: "Productor, animador y empresario, creador de un imperio del entretenimiento."
    },{
      name: "Ada Lovelace",
      image: "assets/content/sliders/slider-Ada-lovelace.png",
      link: "/originals/ada-lovelace",
      description: "Matemática y visionaria, considerada la primera programadora de la historia."
    },{
      name: "Hedy Lamarr",
      image: "assets/content/sliders/slider-Hedy.png",
      link: "/originals/hedy-lamarr",
      description: "Inventora y actriz, precursora de la tecnología inalámbrica moderna."
    },{
      name: "Jane Goodall",
      image: "assets/content/sliders/slider-Jane.png",
      link: "/originals/jane-goodall",
      description: "Primatóloga y conservacionista, referente mundial en el estudio de los chimpancés."
    },{
      name: "Benjamin Franklin",
      image: "assets/content/sliders/slider-Benjamin.png",
      link: "/originals/benjamin-franklin",
      description: "Político, inventor y diplomático, clave en la independencia de EE. UU."
    },{
      name: "Mark Cuban",
      image: "assets/content/sliders/slider-Mark.png",
      link: "/originals/mark-cuban",
      description: "Empresario, inversionista y figura del emprendimiento y la innovación digital."
    },{
      name: "Steve Jobs",
      image: "assets/content/sliders/slider-Steve-Jobs.png",
      link: "/originals/steve-jobs",
      description: "Empresario, inventor y fundador de Apple."
    }
  ];


export default function TopOriginals() {

  const { slug } = useParams(); 
console.log("Slug actual:", slug);

  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);

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
  if (loading || !original) return (
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
  );

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
      <p className="text-[#F6F4EF] text-center py-10">Cargando...</p>
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
          
          <div className="absolute bg-linear-to-b from-transparent to-[#0F090B] inset-0 flex flex-col justify-end items-center text-center px-6 md:px-20 ">
            <h1 className="text-[3.75rem] font-semibold leading-snug text-[#F6F4EF]">
              ¿Qué habría aprendido<br/> 
              <span className="top-italic text-[#a8a8a8]">{original.name}</span> en 
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
            <div style={{ height: `${NUM_SLIDES * 80}vh` }} className="relative">
                <div ref={scrollRef} className="sticky top-0 h-screen overflow-hidden bg-[#0F090B]">
                <div className={`flex h-full lg:pr-[90px] px-30 py-10 box-border w-[${(NUM_SLIDES - 1) * 100}vw]  lg:w-[${(NUM_SLIDES - 1) * 45}vw] ` }>
                  {original?.certifications?.map((item, index) => (
                    <div key={index} className={`w-screen px-10 py-20 flex flex-col md:flex-row  justify-center  bg-no-repeat ${index % 2 !== 0 ? "bg-[url(/assets/content/originals/top-education-line-medium.svg)] bg-size-[50%] bg-right items-end":"bg-[url(/assets/content/originals/top-education-line-large.svg)] bg-size-[50%] items-start bg-right"}`}>
                      <div className='w-full lg:w-[45vw] flex flex-wrap relative '>
                        <img src={item.image} className='absolute z-[-5] opacity-10' alt="" />
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
                          <Link to={`/explora/filter?${item.certification_detail.tema_certificacion.tem_type}=${item.certification_detail.tema_certificacion.nombre}&page=1&page_size=16`} className={`w-[70px] absolute hover:scale-110 duration-300 cursor-pointer right-[7%] ${index % 2 !== 0 ? "top-[-25%]":"bottom-[-25%]"}`}>
                            <img src={item.certification_detail.tema_certificacion.tem_img} alt="" />
                          </Link>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </section>
        <section className="wrapper relative section">
        <div className="container m-auto">
          <HeroSlider authors={authors} />
        </div>
      </section>
    </div>
    </>
  )
}



