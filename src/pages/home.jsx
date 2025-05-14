import React, { useState, useRef, useEffect } from "react";

import SliderEditorial from "../components/SliderEditorial";
import TopicCircles from "../components/TopicCircles";
import FlagsHome from "../components/FlagsHome";
import RoutesComponent from "../components/RoutesComponent";

import ImageSlider3D from "../components/ImageSlider3D";

import HeroSlider from "../components/HeroSlider";

import MovingText from "../components/ComingSoon";
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';

import HomeGridBlogs from "../components/HomeGridBlogs";
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

  const flagsImages = [
    {
      id: 1, src: "assets/flags/BA-TE-MICHIGAN.webp", category:"Universidad", link: "University of Michigan",title:"",desc:""
    },{
      id: 2, src: "assets/flags/BA-TE-BERKLEE.webp", category:"Universidad", link: "Berklee College of Music",title:"",desc:""
    },{
      id: 3, src: "assets/flags/BA-TE-PEKING.webp", category:"Universidad", link: "Peking University",title:"",desc:""
    },{
      id: 4, src: "assets/flags/BA-TE-COLUMBIA.webp", category:"Universidad", link: "Columbia University",title:"",desc:""
    },{
      id: 5, src: "assets/flags/BA-TE-HARVARD.webp", category:"Universidad", link: "Harvard University",title:"",desc:""
    },{
      id: 6, src: "assets/flags/BA-TE-YALE.webp", category:"Universidad", link: "Yale University",title:"",desc:""
    },{
      id: 7, src:"assets/flags/BA-TE-STANFORD.webp", category:"Universidad", link: "Stanford University",title:"",desc:""
    },{
      id: 8, src: "assets/flags/BA-TE-NACIONAL.webp", category:"Universidad", link: "Universidad Nacional de Colombia",title:"",desc:""
    },{
      id: 9, src: "assets/flags/BA-TE-ANDES.webp", category:"Universidad", link: "Universidad de los Andes",title:"",desc:""
    },{
      id: 10, src:"assets/flags/BA-TE-TORONTO.webp", category:"Universidad", link: "University of Toronto",title:"",desc:""
    },{
      id: 11, src:"assets/flags/BA-TE-NEW-MEXICO.webp", category:"Universidad", link: "University of New Mexico",title:"",desc:""
    },{
      id: 12, src:"assets/flags/BA-TE-PARSONS.webp", category:"Universidad", link: "Parsons School of Design, The New School",title:"",desc:""
    },{
      id: 13, src:"assets/flags/BA-TE-VIRGINIA.webp", category:"Universidad", link: "University of Virginia",title:"",desc:""
    },{
      id: 14, src:"assets/flags/BA-TE-ILLINOIS.webp", category:"Universidad", link: "University of Illinois Urbana-Champaign",title:"",desc:""
    },{
      id: 15, src:"assets/flags/BA-TE-IRVINE.webp", category:"Universidad", link: "University of California, Irvine",title:"",desc:""
    },{
      id: 16, src:"assets/flags/BA-TE-NORTH-CAROLINA.webp", category:"Universidad", link: "The University of North Carolina at Chapel Hill",title:"",desc:""
    },{
      id: 17, src:"assets/flags/BA-TE-CHICAGO.webp", category:"Universidad", link: "Chicago University",title:"",desc:""
    },{
      id: 18, src:"assets/flags/BA-TE-NORTHWESTERN.webp", category:"Universidad", link: "Northwestern University",title:"",desc:""
    },{
      id: 19, src:"assets/flags/BA-TE-COLORADO.webp", category:"Universidad", link: "University of Colorado Boulder",title:"",desc:""
    },{
      id: 20, src: "assets/flags/BA-TE-MONTERREY.webp", category:"Universidad", link: "Tecnológico de Monterrey",title:"",desc:""
    },{
      id: 21, src: "assets/flags/BA-TE-PUCP.webp", category:"Universidad", link: "Pontificia Universidad Católica del Perú",title:"",desc:""
    },{
      id: 22, src: "assets/flags/BA-TE-AUTONOMA-MEXICO.webp", category:"Universidad", link: "HUNAM",title:"",desc:""
    },{
      id: 23, src: "assets/flags/BA-TE-ANAHUAC.webp", category:"Universidad", link: "Universidad Anáhuac",title:"",desc:""
    },{
      id: 24, src:"assets/flags/BA-TE-SEA.webp", category:"Universidad", link: "SAE Institute México",title:"",desc:""
    },{
      id: 25, src:"assets/flags/BA-TE-CATOLICA-CHILE.webp", category:"Universidad", link: "Pontificia Universidad Católica de Chile",title:"",desc:""
    },{
      id: 26, src:"assets/flags/BA-TE-AUSTRAL.webp", category:"Universidad", link: "Universidad Austral",title:"",desc:""
    }
  ];


  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    setMousePosition({ x, y });
  };


  const StarSVG = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 48 48"
      fill="none"
    >
      <g filter="url(#filter0_d_625_539)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0175 22.9568C19.6174 23.6036 24.3451 19.6176 24.9919 12.0177C24.3451 19.6176 28.3311 24.3452 35.931 24.9921C28.3311 24.3452 23.6035 28.3313 22.9566 35.9312C23.6035 28.3313 19.6174 23.6036 12.0175 22.9568Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_625_539"
          x="0.0175781"
          y="0.0175781"
          width="47.9136"
          height="47.9136"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_625_539"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_625_539"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
  

  const toggleVisibility = () => {

    setStatePopUp((prev) => !prev);
  };

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
        <title>Top Education</title>
        <meta name="description" content="Conoce Top Education, la plataforma donde aprendes de las mejores universidades de Latinoamérica y el mundo con +13,000 certificaciones." />
        <meta property="og:title" content="Top Education | Aprende con edX, Coursera y MasterClass" />
        <meta name="keywords" content="" />
        <meta name="author" content="Top Education" />
        <meta name="robots" content="index, follow" />
        <meta property="og:description" content="Conoce Top Education, la plataforma donde aprendes de las mejores universidades de Latinoamérica y el mundo con +13,000 certificaciones." />
        <meta property="og:type" content="website" />
      </Helmet>
      <FinisherHeaderComponent />
      <div id="second-home-section" className="container dark:bg-black-900 mx-auto px-4 justify-center-safe gap-2 ">
        <div id="upper-section">
          <h2 className="text-white text-7xl font-normal leading-20 relative">
            Explora +13.000 certificaciones{" "}
            <span className="font-bold text-white">y crea tu propia ruta de aprendizaje.</span>
          </h2>
        </div>
        <div className="mx-auto px-4 justify-center-safe gap-2 " >
          <h2>Temas</h2>
          <div className="block-circles">
            <TopicCircles topic="Aprendizaje de idioma" type="Tema" tag="Aprendizaje de idioma" />
            <TopicCircles topic="Arte y humanidades" type="Tema" tag="Arte y humanidades" />
            <TopicCircles topic="Ciencias de datos" type="Tema" tag="Ciencias de datos" />
            <TopicCircles topic="Ciencias de la computación" type="Tema" tag="Ciencias de la computación" />
            <TopicCircles topic="Ciencias sociales" type="Tema" tag="Ciencias sociales" />
            <TopicCircles topic="Ciencía física e ingeniería" type="Tema" tag="Ciencia física e ingeniería" />
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
        </div>
      </div>
      <div className="container m-auto pt-40">
        <h2 className="text-white text-6xl font-normal text-center italic leading-15 z-10 relative">Aprende con las universidades líderes del mundo</h2>
        <ImageSlider3D images={flagsImages} />
      </div>
      {/*<div className="container m-auto py-40">
        <h2 className="text-white text-6xl font-normal text-center leading-15 z-10 relativee">Editorial Top Education</h2>
        <p className="text-white text-2xl font-normal text-center leading-10 z-10 relative">
          Descarga gratis nuestros recursos exclusivos. Encuentra la información
          que necesitas para alcanzar tus metas educativas, personales y
          profesionales. Te ofrecemos herramientas poderosas para enriquecer tu
          vida y potenciar tu crecimiento.
        </p>
        <SliderEditorial />
      </div>*/}
      <div id="seventh-home-section">
        <img id="ellipse-red" src="/assets/Piezas/ellipse-red.png" alt="" />
        <h2 className="text-black text-7xl font-normal leading-20">Explora y aprende</h2>
        <HomeGridBlogs />
        <Link to="/recursos" >
          <button id="button-all-articles">Ver más artículos</button>
        </Link>
      </div>
      {/*<MovingText />*/}
      <div className="container m-auto">
        <HeroSlider authors={authors} />
      </div>
    </>
  );
}

export default HomePage;
