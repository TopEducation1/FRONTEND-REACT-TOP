import React, { useState, useRef, useEffect } from "react";

import SliderEditorial from "../components/SliderEditorial";
import TopicCircles from "../components/TopicCircles";
import FlagsHome from "../components/FlagsHome";

import MovingText from "../components/ComingSoon";
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';

import HomeGridBlogs from "../components/HomeGridBlogs";
import FinisherHeaderComponent from '../components/FinisherHeaderComponent';

function HomePage() {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [statePopUp, setStatePopUp] = useState(false);
  const videoRef = useRef(null);

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
        <meta name="description" content="Conoce Top Education, la plataforma donde aprendes de las mejores universidades de Latinoamérica y el mundo con +13,000 certificaciones.
" />
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
          <h2 className="text-white text-7xl font-normal leading-20">
            Explora +13.000 certificaciones{" "}
            <span className="font-bold text-white">y crea tu propia ruta de aprendizaje.</span>
          </h2>
        </div>
        
        <div className="mx-auto px-4 justify-center-safe gap-2 " >
          <h2>Temas</h2>
          <div className="block-circles">
          <TopicCircles
              topic="Aprendizaje de idioma"
              type="Tema"
              image="assets/temas/Aprendizaje de idioma.png"
              tag="Aprendizaje de idioma"
            />
            <TopicCircles
              topic="Arte y humanidades"
              type="Tema"
              image="assets/temas/Arte y humanidades.png"
              tag="Arte y humanidades"
            />
            <TopicCircles
              topic="Ciencias de datos"
              type="Tema"
              image="assets/temas/Ciencias de datos.png"
              tag="Ciencias de datos"
            />
            <TopicCircles
              topic="Ciencias de la computación"
              type="Tema"
              image="assets/temas/Ciencias de la computación.png"
              tag="Ciencias de la computación"
            />
            <TopicCircles
              topic="Ciencias sociales"
              type="Tema"
              image="assets/temas/Ciencias sociales.png"
              tag="Ciencias sociales"
            />
            <TopicCircles
              topic="Ciencía física e ingeniería"
              type="Tema"
              image="assets/temas/Ciencía física e Ingeniería.png"
              tag="Ciencia física e ingeniería"
            />
            <TopicCircles
              topic="Desarrollo personal"
              type="Tema"
              image="assets/temas/Desarrollo personal.png"
              tag="Desarrollo personal"
            />
            <TopicCircles
              topic="Matemáticas y lógica"
              type="Tema"
              image="assets/temas/Matemáticas y lógica.png"
              tag="Matemáticas y lógica"
            />
            <TopicCircles
              topic="Negocios"
              type="Tema"
              image="assets/temas/Negocios.png"
              tag="Negocios"
            />
            <TopicCircles
              topic="Salud"
              type="Tema"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/234a2a55-0888-4369-a6ae-64f6a7a99618/TE-ICONO-SALUD.png"
              tag="Salud"
            />
            <TopicCircles
              topic="Tecnología de información"
              type="Tema"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/75995000-8559-48bb-96ed-871fdd7066f9/TE-ICONO-TECNOLOGIA+E+INFORMACION.png"
              tag="Tecnología de la información"
            />
          
            <TopicCircles
              topic="Bienestar"
              type="Habilidad"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/a77359c8-7df4-47a6-907d-3b3d42618caf/TE-ICONO-BIENESTAR.png"
              tag="Bienestar"
            />
            <TopicCircles
              topic="Comunicación"
              type="Habilidad"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/29500fce-c04f-4260-bc08-70944a061d95/TE-ICONO-COMUNICACION.png"
              tag="Comunicación"
            />
            <TopicCircles
              topic="Creatividad"
              type="Habilidad"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/62c55e44-97c0-4afc-8e3f-1f1873a89052/TE-ICONO-CREATIVIDAD.png"
              tag="Creatividad"
            />
            <TopicCircles
              topic="Crecimiento personal"
              type="Habilidad"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/079bb2bb-84f0-4a1f-9929-1112f978ca24/TE-ICONO-CRECIMIENTO+PERSONAL.png"
              tag="Crecimiento personal"
            />
            <TopicCircles
              topic="Diversidad, equidad e inclusión"
              type="Habilidad"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/e6b3b49a-b7c8-4dff-90ba-824523adbe4e/TE-ICONO-DIVERSIDAD_EQUIDAD+E+INCLUSI%C3%93N.png"
              tag="Diversidad, equidad e inclusión"
            />
            <TopicCircles
              topic="Estrategia"
              type="Habilidad"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/d64dd080-d117-463e-8429-02dfe4fb88fc/TE-ICONO-ESTRATEGIA.png"
              tag="Estrategia"
            />
            <TopicCircles
              topic="Liderazgo"
              type="Habilidad"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/37ffffa5-cda9-412e-bb48-8e802cfdc044/TE-ICONO-LIDERAZGO.png"
              tag="Liderazgo"
            />
            <TopicCircles
              topic="Personas y cultura"
              type="Habilidad"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/bb36fc68-859e-4d86-b0b6-97e79d83b644/TE-ICONO-PERSONAS+Y+CULTURA.png"
              tag="Personas y cultura"
            />
            <TopicCircles
              topic="Productividad"
              type="Habilidad"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/91a0e3d3-4578-431c-b09d-08b25497adbc/TE-ICONO-PRODUCTIVIDAD.png"
              tag="Productividad"
            />
            <TopicCircles
              topic="Trabajo en equipo"
              type="Habilidad"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/ce129121-32c3-474d-81d6-287097cb2a65/TE-ICONO-TRABAJO+EN+EQUIPO.png"
              tag="Trabajo en equipo"
            />
          </div>
        </div>
      </div>
      {/*<TrandingSlider />*/}
      <FlagsHome />

      <div id="fifth-home-section">
        <img src="/assets/Piezas/ellipse-big.png" id="ellipse-big" alt="" />
        <img src="/assets/Piezas/ellipse-mini.png" id="ellipse-big" alt="" />

        <svg
          id="star"
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
        >
          <g filter="url(#filter0_d_625_542)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.0175 22.9312C19.6174 23.578 24.3451 19.592 24.9919 11.9921C24.3451 19.592 28.3311 24.3197 35.931 24.9665C28.3311 24.3197 23.6035 28.3057 22.9566 35.9056C23.6035 28.3057 19.6174 23.578 12.0175 22.9312Z"
              fill="white"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_625_542"
              x="0.0175781"
              y="-0.0078125"
              width="47.9136"
              height="47.9133"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
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
                result="effect1_dropShadow_625_542"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_625_542"
                result="shape"
              />
            </filter>
          </defs>
        </svg>

        <svg
          id="star-1"
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
        >
          <g filter="url(#filter0_d_625_539)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
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
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
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

        <h2>Editorial Top Education</h2>
        <p>
          Descarga gratis nuestros recursos exclusivos. Encuentra la información
          que necesitas para alcanzar tus metas educativas, personales y
          profesionales. Te ofrecemos herramientas poderosas para enriquecer tu
          vida y potenciar tu crecimiento.
        </p>

        <SliderEditorial />
      </div>

      <div id="seventh-home-section">
        <img id="ellipse-red" src="/assets/Piezas/ellipse-red.png" alt="" />

        <h2>Explora y aprende</h2>

          <HomeGridBlogs />
          <Link to="/recursos" >
    <button id="button-all-articles">Ver más artículos</button>
</Link>
        
      </div>

      <div id="sixth-home-section">
        <div id="wrapper-coming-soon">
          <MovingText />
        </div>
        <div id="wrapper-title-sixth">
          <div id="sixth-1">
            <img src="/assets/Piezas/star-title.png" alt="" />
          </div>
          <div id="sixth-2">
            <div id="upper-sixth-2">
              <h2>¿Qué hubiese aprendido Nikola Tesla en Top Education?</h2>
            </div>

            <div id="lower-sixth-2">
              <span>
                Descubre las rutas del conocimiento con Genios Históricos
              </span>
            </div>
          </div>
        </div>

        <div id="grid-genius">
          <a>
            <img src="assets/SliderImages/6.png" />
          </a>
          <a>
            <img src="assets/SliderImages/2.png" />
          </a>
          <a>
            <img src="assets/SliderImages/3.png" />
          </a>
          <a>
            <img src="assets/SliderImages/4.png" />
          </a>
          <a>
            <img src="assets/SliderImages/1.png" />
          </a>
          <a>
            <img src="assets/SliderImages/5.png" />
          </a>
        </div>
      </div>
    </>
  );
}

export default HomePage;
