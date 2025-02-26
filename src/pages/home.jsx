import React, { useState, useRef, useEffect } from "react";
import SliderEditorial from "../components/SliderEditorial";
import TopicCircles from "../components/TopicCircles";
import FlagsHome from "../components/FlagsHome";
import RotateVideo from "../components/RotateVideo";
import MovingText from "../components/ComingSoon";
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import HomeGridBlogs from "../components/HomeGridBlogs";


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

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
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

      <div
        id="first-home-section"
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Capa de estrellas parallax */}
        <div id="stars-container">
          <div
            className="star-wrapper"
            style={{
              transform: `translate(${mousePosition.x * 15}px, ${
                mousePosition.y * 15
              }px)`,
            }}
          >
            <div id="star-1-parallax">
              <StarSVG />
            </div>
            <div id="star-2-parallax">
              <StarSVG />
            </div>
            <div id="star-3-parallax">
              <StarSVG />
            </div>
            <div id="star-4-parallax">
              <StarSVG />
            </div>
            <div id="star-5-parallax">
              <StarSVG />
            </div>
            <div id="star-6-parallax">
              <StarSVG />
            </div>
            <div id="star-7-parallax">
              <StarSVG />
            </div>
          </div>
        </div>

        <div id="left-first-section">
          <h1>Top Education</h1>
          <p>
            Aprende en línea mientras conectas tu interés con el conocimiento de
            los mejores del mundo
          </p>
        </div>

        <div id="right-first-section">
          <RotateVideo onClick={toggleVisibility} />
        </div>

        <div id="pop-up-video" className={statePopUp ? "visible" : ""}>
          <div id="wrapper-button-close-popup">
            <svg
              onClick={toggleVisibility}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </div>

          <video
            ref={videoRef}
            src="/assets/video/main-video.mp4"
            controls
          ></video>
        </div>
      </div>

      <div id="second-home-section">
        <div id="upper-section">
          <h1>
            Explora +13.000 certificaciones{" "}
            <span>
              <mark>y crea tu propia ruta de aprendizaje.</mark>
            </span>
          </h1>
        </div>
        <div className="block-second-section" id="first-section-circles">
          <h2>Temas</h2>
          <div className="block-circles">
          <TopicCircles
              topic="Diversidad, equidad e inclusión"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/e6b3b49a-b7c8-4dff-90ba-824523adbe4e/TE-ICONO-DIVERSIDAD_EQUIDAD+E+INCLUSI%C3%93N.png"
              tag="Diversidad, equidad e inclusión"
            />
            <TopicCircles
              topic="Arte y Humanidades"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/1b0794ce-4058-47b7-9b5d-de284d4488c6/TE-ICONO-ARTES+Y+HUMANIDADES.png"
              tag="Arte y Humanidades"
            />
            <TopicCircles
              topic="Ciencias de la Computación"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/d8dd5eae-3f58-492d-8d05-1cc5113f5f25/TE-ICONO-CIENCIAS+DE+LA+COMPUTACION.png"
              tag="Ciencias de la Computación"
            />
            <TopicCircles
              topic="Ciencias de Datos"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/918380b3-8296-4eb3-b26c-f97bf01de5eb/TE-ICONO-CIENCIA+Y+DATOS.png"
              tag="Ciencias de Datos"
            />
            <TopicCircles
              topic="Tecnología de Información"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/75995000-8559-48bb-96ed-871fdd7066f9/TE-ICONO-TECNOLOGIA+E+INFORMACION.png"
              tag="Tecnología de Información"
            />

            <TopicCircles
              topic="Salud"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/234a2a55-0888-4369-a6ae-64f6a7a99618/TE-ICONO-SALUD.png"
              tag="Salud"
            />
            <TopicCircles
              topic="Matemáticas y Lógica"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/b6393b7b-f672-4a8a-be48-72799e17cf28/TE-ICONO-MATEMATICAS+Y+LOGICA.png"
              tag="Matemáticas y Lógica"
            />
            <TopicCircles
              topic="Ciencias, física e ingeniería"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/eaea7635-0af1-4704-8cf6-03281c209dd3/TE-ICONO-CIENCIAS+F%C3%8DSICAS+E+INGENIERIA.png"
              tag="Ciencias, física e ingeniería"
            />
            <TopicCircles
              topic="Ciencias sociales"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/c9f4926a-b119-4287-96e3-f456a789d9b0/TE-ICONO-CIENCIAS+SOCIALES.png"
              tag="Ciencias sociales"
            />
            <TopicCircles
              topic="Personas y cultura"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/bb36fc68-859e-4d86-b0b6-97e79d83b644/TE-ICONO-PERSONAS+Y+CULTURA.png"
              tag="Personas y cultura"
            />
            
          </div>
        </div>

        <div className="block-second-section">
          <h2>Habilidades</h2>
          <div className="block-circles">
            <TopicCircles
              topic="Negocios"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/0cfa8c38-199b-403e-a05d-b49850ca617f/TE-ICONO-NEGOCIOS.png"
              tag="Negocios"
            />

            <TopicCircles
              topic="Crecimiento personal"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/079bb2bb-84f0-4a1f-9929-1112f978ca24/TE-ICONO-CRECIMIENTO+PERSONAL.png"
              tag="Crecimiento personal"
            />

            <TopicCircles
              topic="Desarrollo Personal"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/cd93c4ba-b356-4b01-87a6-6700c8839a4d/TE-ICONO-DESARROLLO+PERSONAL.png"
              tag="Desarrollo Personal"
            />

            <TopicCircles
              topic="Aprendizaje de un Idioma"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/318a66f7-8cf8-4053-a4bc-e2764aa6a704/TE-ICONO-LENGUAJES.png"
              tag="Aprendizaje de un Idioma"
            />
            <TopicCircles
              topic="Bienestar"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/a77359c8-7df4-47a6-907d-3b3d42618caf/TE-ICONO-BIENESTAR.png"
              tag="Bienestar"
            />

            <TopicCircles
              topic="Productividad"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/91a0e3d3-4578-431c-b09d-08b25497adbc/TE-ICONO-PRODUCTIVIDAD.png"
              tag="Productividad"
            />
            <TopicCircles
              topic="Liderazgo"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/37ffffa5-cda9-412e-bb48-8e802cfdc044/TE-ICONO-LIDERAZGO.png"
              tag="Liderazgo"
            />

            <TopicCircles
              topic="Estrategia"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/d64dd080-d117-463e-8429-02dfe4fb88fc/TE-ICONO-ESTRATEGIA.png"
              tag="Estrategia"
            />
            <TopicCircles
              topic="Comunicación"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/29500fce-c04f-4260-bc08-70944a061d95/TE-ICONO-COMUNICACION.png"
              tag="Comunicación"
            />
            <TopicCircles
              topic="Trabajo en equipo"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/ce129121-32c3-474d-81d6-287097cb2a65/TE-ICONO-TRABAJO+EN+EQUIPO.png"
              tag="Trabajo en equipo"
            />
            <TopicCircles
              topic="Creatividad"
              image="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/62c55e44-97c0-4afc-8e3f-1f1873a89052/TE-ICONO-CREATIVIDAD.png"
              tag="Creatividad"
            />
          </div>
        </div>
      </div>

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

        <h1>Editorial Top Education</h1>
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

        <h1>Explora y aprende</h1>

          <HomeGridBlogs />
          <Link to="/recursos" onClick={() => window.scrollTo(0, 0)}>
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
              <h1>¿Qué hubiese aprendido Nicola Tesla en Top Education?</h1>
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
