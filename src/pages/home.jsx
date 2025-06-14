import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";

import TopicCircles from "../components/TopicCircles";
import TopicSelector from "../components/TopicSelector";
import PlatformsSelector from "../components/PlatformsSelector";
import ImageSlider3D from "../components/ImageSlider3D";
import HeroSlider from "../components/HeroSlider";
import Flags from "../components/Flags";
import FinisherHeaderComponent from '../components/FinisherHeaderComponent';

function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [statePopUp, setStatePopUp] = useState(false);
  const videoRef = useRef(null);
  const authors = [
    {
      name: "Steve Jobs",
      image: "assets/SliderImages/6.png",
      link: "#",
      description: "Empresario, inventor y fundador de Apple."
    },{
      name: "Alexander turing",
      image: "assets/SliderImages/2.png",
      link: "#",
      description: "Metematico, padre de la informatica moderna."
    },{
      name: "Sigmund Freud",
      image: "assets/SliderImages/3.png",
      link: "#",
      description: "Neurólogo, padre del psicoanálisis y una de las figuras más influyentes del siglo XX."
    },{
      name: "Leonardo da Vinci",
      image: "assets/SliderImages/4.png",
      link: "#",
      description: "Pintor, Científico, Ingeniero, Anatomista."
    },{
      name: "Nikola Tesla",
      image: "assets/SliderImages/5.png",
      link: "#",
      description: "Físico, ingeniero, matemático, mecánico e inventor visionario."
    },{
      name: "Marie Curie",
      image: "assets/SliderImages/1.png",
      link: "#",
      description: "Científica, pionera, radioactividad, premio nobel en quimica y fisica."
    }
  ];
  const topics = [
    {
      name: 'Aprendizaje de idioma',
      type: 'Tema',
      img: 'assets/temas/Aprendizaje de idioma',
      description: 'Aprender un idioma expande tu universo cultural y profesional. Conecta a través del inglés, francés, alemán y más, cultivando habilidades de comunicación global.',
      universities: [
        {
          name: 'University of Michigan',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-University-of-Michigan.webp'
        },{
          name: 'Columbia University',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Columbia-University.webp'
        },
        {
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },
    {
      name: 'Arte y humanidades',
      img: 'assets/temas/Arte y humanidades',
      type: 'Tema',
      description: 'Explora la historia, la filosofía y el arte para entender el sentido humano. Aprende análisis crítico, historia del arte y pensamiento ético.',
      universities: [
        {
          name: 'Universidad Austral',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-Austral.webp'
        },
        {
          name: 'Yad Vashem',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Yad-Vashem.png'
        },
        {
          name: 'Berklee college of music',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Berklee-College-of-Music.webp'
        }
      ]
    },{
      name: 'Ciencias de datos',
      type: 'Tema',
      img: 'assets/temas/Ciencias de datos',
      description: 'Descifra patrones y genera valor con la información. Domina herramientas como SQL, Python, Power BI y la lógica detrás de la ciencia de datos.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },
        {
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },
        {
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },
  ];

  const platforms = [
    {
      name: 'EdX',
      type: 'Plataforma',
      img: 'assets/platforms/icons/icon-edx.png',
      description: 'Su objetivo es hacer la educación de calidad accesible para todos.',
      universities: [
        {
          name: 'Harvard University',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Harvard.webp'
        },{
          name: 'Stanford University',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Stanford-University.webp'
        },{
          name: 'Columbia University',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Columbia-University.webp'
        },{
          name: 'IBM',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-IBM.png'
        },{
          name: 'Microsoft',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Microsoft.png'
        },{
          name: 'Google',
          type: 'Universidad',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        }
      ]
    },
    {
      name: 'Coursera',
      img: '/assets/platforms/icons/icon-coursera.png',
      type: 'Plataforma',
      description: 'Plataforma en línea que brinda cursos y certificaciones de universidades y empresas líderes a nivel global.',
      universities: [
        {
          name: 'Yale University',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Yale-University.webp'
        },
        {
          name: 'University of Michigan',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-University-of-Michigan.webp'
        },
        {
          name: 'University of Illinois Urbana Champaign',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-University-of-Illinois-Urbana-Champaign.webp'
        }
      ]
    },{
      name: 'MasterClass',
      type: 'Plataforma',
      img: '/assets/platforms/icons/icon-masterclass.png',
      description: 'Plataforma en línea que ofrece clases impartidas por expertos y celebridades en diversas áreas como arte, cocina, cine y más.',
      universities: [
        {
          name: 'Bienestar',
          type: 'Habilidad',
          img: '/assets/category/ability/Bienestar.png'
        },
        {
          name: 'Estrategia',
          type: 'Habilidad',
          img: '/assets/category/ability/Estrategia.png'
        },
        {
          name: 'Liderazgo',
          type: 'Habilidad',
          img: '/assets/category/ability/Liderazgo.png'
        },{
          name: 'Personas y cultura',
          type: 'Habilidad',
          img: '/assets/category/ability/Personas-y-cultura.png'
        },
        {
          name: 'Comunicación',
          type: 'Habilidad',
          img: '/assets/category/ability/Comunicacion.png'
        }
      ]
    },
  ];

  const flagsImages = [
    {
      id: 1, src: "/assets/universities/flags/BA-TE-HARVARD.webp", category:"Universidad", link: "Harvard University",title:"",desc:""
    },{
      id: 2, src: "/assets/universities/flags/BA-TE-NACIONAL.webp", category:"Universidad", link: "Universidad Nacional de Colombia",title:"",desc:""
    },{
      id: 3, src:"/assets/universities/flags/BA-TE-TORONTO.webp", category:"Universidad", link: "University of Toronto",title:"",desc:""
    },{
      id: 4, src: "/assets/universities/flags/BA-TE-ANDES.webp", category:"Universidad", link: "Universidad de los Andes",title:"",desc:""
    },{
      id: 5, src: "/assets/universities/flags/BA-TE-YALE.webp", category:"Universidad", link: "Yale University",title:"",desc:""
    },{
      id: 6, src: "/assets/universities/flags/BA-TE-PUCP.webp", category:"Universidad", link: "Pontificia Universidad Catolica de Peru",title:"",desc:""
    },{
      id: 7, src:"/assets/universities/flags/BA-TE-STANFORD.webp", category:"Universidad", link: "Stanford University",title:"",desc:""
    },{
      id: 8, src:"/assets/universities/flags/BA-TE-AUSTRAL.webp", category:"Universidad", link: "Universidad Austral",title:"",desc:""
    },{
      id: 9, src: "/assets/universities/flags/BA-TE-MICHIGAN.webp", category:"Universidad", link: "University of Michigan",title:"",desc:""
    },{
      id: 10, src: "/assets/universities/flags/BA-TE-PEKING.webp", category:"Universidad", link: "Peking University",title:"",desc:""
    },{
      id: 11, src:"/assets/universities/flags/BA-TE-NEW-MEXICO.webp", category:"Universidad", link: "University of New Mexico",title:"",desc:""
    },{
      id: 12, src: "/assets/universities/flags/BA-TE-ANAHUAC.webp", category:"Universidad", link: "Universidad Anáhuac",title:"",desc:""
    },{
      id: 13, src: "/assets/universities/flags/BA-TE-COLUMBIA.webp", category:"Universidad", link: "Columbia University",title:"",desc:""
    },{
      id: 14, src:"/assets/universities/flags/BA-TE-CATOLICA-CHILE.webp", category:"Universidad", link: "Pontificia Universidad Catolica de Chile",title:"",desc:""
    },{
      id: 15, src:"/assets/universities/flags/BA-TE-ILLINOIS.webp", category:"Universidad", link: "University of Illinois Urbana-Champaign",title:"",desc:""
    },{
      id: 16, src: "/assets/universities/flags/BA-TE-MONTERREY.webp", category:"Universidad", link: "Tecnológico de Monterrey",title:"",desc:""
    },{
      id: 17, src:"/assets/universities/flags/BA-TE-VIRGINIA.webp", category:"Universidad", link: "University of Virginia",title:"",desc:""
    },{
      id: 18, src: "/assets/universities/flags/BA-TE-AUTONOMA-MEXICO.webp", category:"Universidad", link: "UNAM",title:"",desc:""
    },{
      id: 19, src:"/assets/universities/flags/BA-TE-NORTH-CAROLINA.webp", category:"Universidad", link: "The University of North Carolina at Chapel Hill",title:"",desc:""
    },{
      id: 20, src:"/assets/universities/flags/BA-TE-SEA.webp", category:"Universidad", link: "SAE-México",title:"",desc:""
    },{
      id: 21, src:"/assets/universities/flags/BA-TE-CHICAGO.webp", category:"Universidad", link: "The University of Chicago",title:"",desc:""
    },{
      id: 22, src: "/assets/universities/flags/BA-TE-BERKLEE.webp", category:"Universidad", link: "Berklee College of Music",title:"",desc:""
    },{
      id: 23, src:"/assets/universities/flags/BA-TE-PARSONS.webp", category:"Universidad", link: "Parsons School of Design, The New School",title:"",desc:""
    },{
      id: 24, src:"/assets/universities/flags/BA-TE-COLORADO.webp", category:"Universidad", link: "University of Colorado Boulder",title:"",desc:""
    },{
      id: 25, src:"/assets/universities/flags/BA-TE-IRVINE.webp", category:"Universidad", link: "University of California, Irvine",title:"",desc:""
    },{
      id: 26, src:"/assets/universities/flags/BA-TE-NORTHWESTERN.webp", category:"Universidad", link: "Northwestern University",title:"",desc:""
    }
  ];

 
  useEffect(() => {

    if (statePopUp && videoRef.current) {
      videoRef.current.play().catch((error) => {
        videoRef.current.play().catch((error) => {
          videoRef.current.muted = true;
          videoRef.current.play();
        });
      });
    } else if (!statePopUp && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [statePopUp]);
  
  return (
    <>
      {/**SEO ELEMENTS WITH REACT -HELMET */}
      <Helmet>
        <title>Top.education</title>
        <meta name="description" content="Conoce Top Education, la plataforma donde aprendes de las mejores universidades de Latinoamérica y el mundo con +13,000 certificaciones." />
        <meta property="og:title" content="Top Education | Aprende con edX, Coursera y MasterClass" />
        <meta name="keywords" content="" />
        <meta name="author" content="Top Education" />
        <meta name="robots" content="index, follow" />
        <meta property="og:description" content="Conoce Top Education, la plataforma donde aprendes de las mejores universidades de Latinoamérica y el mundo con +13,000 certificaciones." />
        <meta property="og:type" content="website" />
      </Helmet>
      <FinisherHeaderComponent />
      <div class="bg-gradient-to-t from-neutral-950 relative h-30"></div>
      <section className="wrapper bg-neutral-950 relative section">
        <div className="container m-auto px-2 lg:px-4 py-15 justify-center-safe gap-2">
          <h2 className="index-text text-white text-4xl lg:text-7xl text-center font-normal leading-[1.2em] mb-10">Explora +13.000 certificaciones<br></br>
            <span className="font-bold text-white text-3xl lg:text-6xl leading-[1.2em]"> y crea tu propia ruta de aprendizaje.</span>
          </h2>
          <div className="grid grid-cols-3 lg:grid-cols-8 md:grid-cols-5 content-start justify-items-center gap-4">
            <TopicCircles topic="Aprendizaje de idioma" type="Tema" tag="Aprendizaje de idioma" />
            <TopicCircles topic="Arte y humanidades" type="Tema" tag="Arte y humanidades" />
            <TopicCircles topic="Ciencias de datos" type="Tema" tag="Ciencias de datos" />
            <TopicCircles topic="Ciencias de la computación" type="Tema" tag="Ciencias de la computación" />
            <TopicCircles topic="Ciencias sociales" type="Tema" tag="Ciencias sociales" />
            <TopicCircles topic="Ciencia física e ingeniería" type="Tema" tag="Ciencia física e ingeniería" />
            <TopicCircles topic="Desarrollo personal" type="Tema" tag="Desarrollo personal" />
            <TopicCircles topic="Matemáticas y lógica" type="Tema" tag="Matemáticas y lógica" />
            <TopicCircles topic="Negocios" type="Tema" tag="Negocios" />
            <TopicCircles topic="Salud" type="Tema" tag="Salud" />
            <TopicCircles topic="Tecnología de la información" type="Tema" tag="Tecnología de la información" />

            <TopicCircles topic="Bienestar" type="Habilidad" tag="Bienestar" />
            <TopicCircles topic="Comunicación" type="Habilidad" tag="Comunicación" />
            <TopicCircles topic="Creatividad" type="Habilidad" tag="Creatividad" />
            <TopicCircles topic="Crecimiento personal" type="Habilidad" tag="Crecimiento personal" />
            <TopicCircles topic="Diversidad, equidad e inclusión" type="Habilidad" tag="Diversidad, equidad e inclusión" />
            <TopicCircles topic="Estrategia" type="Habilidad" tag="Estrategia" />
            <TopicCircles topic="Liderazgo" type="Habilidad" tag="Liderazgo"/>
            <TopicCircles topic="Personas y cultura" type="Habilidad" tag="Personas y cultura"/>
            <TopicCircles topic="Productividad" type="Habilidad" tag="Productividad"/>
            <TopicCircles topic="Trabajo en equipo" type="Habilidad" tag="Trabajo en equipo"/>
          </div>
          <TopicSelector topics={topics} />
        </div>
      </section>
      <section className="wrapper bg-neutral-950 relative section">
        <div className="container m-auto py-30 px-5">
          <h2 className="text-white text-4xl lg:text-6xl font-normal text-center italic w-[100%] lg:w-[80%] m-auto leading-[1.2em] relative">Aprende con las universidades líderes del mundo</h2>
          <ImageSlider3D images={flagsImages} action="explora" />
        </div>
      </section>
      <section className="wrapper relative section">
        <div className="container m-auto  text-center">
          <div className="rounded-lg border-1 border-white px-5 py-10 lg:px-10 bg-[#0F090B]/90">
            <h2 className="text-white text-center text-5xl font-normal leading-[1.2em] mb-5">Forma equipos que <span className="italic">aprenden y crecen</span></h2>
            <p className="text-white text-center text-2xl mb-5">Potencia las habilidades de tu equipo con certificaciones clave y seguimiento en tiempo real. Con Top Education para Equipos, accede a contenido exclusivo de MasterClass, edX y Coursera, y maximiza su productividad y crecimiento.</p>
            <div className="w-[100%] lg:w-[50%] m-auto gap-4 mb-10 !text-center">
              {/*<div className="flex justify-center"><img className="w-[120px]" src="assets/platforms/icons/icon-coursera.png" alt="" /></div>
              <div className="flex justify-center"><img className="w-[120px]" src="assets/platforms/icons/icon-edx.png" alt="" /></div>
              <div className="flex justify-center"><img className="w-[120px]" src="assets/platforms/icons/icon-masterclass.png" alt="" /></div>*/}
              <PlatformsSelector platforms={platforms} />
            </div>
            <Link to="/para-equipos"  className="btn btn-col-3 py-3 px-5 m-auto text-[18px] lg:text-2xl">Conoce<span id="top">top</span><span id="education">.education</span> para equipos</Link>
          </div>
          
        </div>
      </section>
      <div className="pt-5 xl:pt-5 lg:pt-5 pb-[4.5rem] xl:pb-5 lg:pb-5 md:pb-10 relative bg-[#0F090B]">
          <div id="seventh-leader-section">
              <h2 className="text-white text-center text-4xl leading-[1.2em] lg:text-5xl font-normal font-[Lora] w-full">Trabajamos con líderes de la industria</h2>
              <Flags direction="left" />  
              <Flags direction="right" />          
          </div>
      </div>
      <section className="wrapper relative section">
        <div className="container m-auto">
          <HeroSlider authors={authors} />
        </div>
      </section>
    </>
  );
}

export default HomePage;
