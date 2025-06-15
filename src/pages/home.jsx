import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import TopicCircles from "../components/TopicCircles";
import TopicSelector from "../components/TopicSelector";
import PlatformsSelector from "../components/PlatformsSelector";
import Flags from "../components/Flags";
import ImageSlider3D from "../components/ImageSlider3D";
import HeroSlider from "../components/HeroSlider";
import FinisherHeaderComponent from '../components/FinisherHeaderComponent';

function HomePage() {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [statePopUp, setStatePopUp] = useState(false);
  const videoRef = useRef(null);
  const authors = [
    {
      name: "Steve Jobs",
      image: "assets/content/sliders/slider-Steve-Jobs.png",
      link: "#",
      description: "Empresario, inventor y fundador de Apple."
    },{
      name: "Alexander turing",
      image: "assets/content/sliders/slider-Alexander-turing.png",
      link: "#",
      description: "Metematico, padre de la informatica moderna."
    },{
      name: "Sigmund Freud",
      image: "assets/content/sliders/slider-Sigmund-Freud.png",
      link: "#",
      description: "Neurólogo, padre del psicoanálisis y una de las figuras más influyentes del siglo XX."
    },{
      name: "Leonardo da Vinci",
      image: "assets/content/sliders/slider-Leonardo-da-Vinci.png",
      link: "#",
      description: "Pintor, Científico, Ingeniero, Anatomista."
    },{
      name: "Nikola Tesla",
      image: "assets/content/sliders/slider-Nikola-Tesla.png",
      link: "#",
      description: "Físico, ingeniero, matemático, mecánico e inventor visionario."
    },{
      name: "Marie Curie",
      image: "assets/content/sliders/slider-Marie-Curie.png",
      link: "#",
      description: "Científica, pionera, radioactividad, premio nobel en quimica y fisica."
    }
  ];

   const topics = [
    {
      name: 'Aprendizaje de idioma',
      type: 'Tema',
      img: 'assets/category/topic/ico-Aprendizaje-de-un-idioma',
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
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },
    {
      name: 'Arte y humanidades',
      img: 'assets/category/topic/ico-Artes-y-humanidades',
      type: 'Tema',
      description: 'Explora la historia, la filosofía y el arte para entender el sentido humano. Aprende análisis crítico, historia del arte y pensamiento ético.',
      universities: [
        {
          name: 'Universidad Austral',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-Austral.webp'
        },{
          name: 'Yad Vashem',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Yad-Vashem.png'
        },{
          name: 'Berklee college of music',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Berklee-College-of-Music.webp'
        }
      ]
    },{
      name: 'Ciencias de datos',
      type: 'Tema',
      img: 'assets/category/topic/ico-Ciencia-de-datos',
      description: 'Descifra patrones y genera valor con la información. Domina herramientas como SQL, Python, Power BI y la lógica detrás de la ciencia de datos.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Ciencias de la computación',
      type: 'Tema',
      img: 'assets/category/topic/ico-Ciencias-de-la-computacion',
      description: 'Construye innovación desde el núcleo tecnológico. Aprende programación (Python, Java), desarrollo web, algoritmos y estructuras de datos con visión estratégica.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Ciencias sociales',
      type: 'Tema',
      img: 'assets/category/topic/ico-Ciencias-sociales',
      description: 'Comprende los sistemas que configuran nuestras sociedades. Explora sociología, psicología social, economía política y habilidades de investigación cualitativa.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Ciencia física e ingeniería',
      type: 'Tema',
      img: 'assets/category/topic/ico-Ciencias-fisicas-e-ingenieria',
      description: 'Transforma ideas en innovación tangible. Aprende fundamentos de física, diseño de circuitos, robótica y sistemas de ingeniería aplicados al mundo real.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Desarrollo personal',
      type: 'Tema',
      img: 'assets/category/topic/ico-Desarrollo-personal',
      description: 'El crecimiento consciente transforma realidades. Aprende técnicas de mindfulness, gestión emocional, marca personal y diseño de rutas de vida estratégicas.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Matemáticas y lógica',
      type: 'Tema',
      img: 'assets/category/topic/ico-Matematicas-y-logica',
      description: 'Piensa con rigor y conecta estructuras. Profundiza en álgebra, estadística, lógica matemática y métodos cuantitativos para resolver problemas complejos.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Negocios',
      type: 'Tema',
      img: 'assets/category/topic/ico-Negocios',
      description: 'Dibuja estrategias que crean valor. Aprende finanzas, marketing, gestión de proyectos, análisis de mercados y emprendimiento con visión global.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Salud',
      type: 'Tema',
      img: 'assets/category/topic/ico-Salud',
      description: 'Entiende la ciencia del bienestar humano. Aprende sobre nutrición, psicología positiva, neurociencia y gestión del autocuidado integral.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Tecnología de información',
      type: 'Tema',
      img: 'assets/category/topic/ico-Tecnologia-de-la-informacion',
      description: 'Conecta con el corazón digital del mundo. Aprende ciberseguridad, administración de bases de datos, redes de información y gestión de sistemas TI.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Bienestar',
      type: 'Habilidad',
      img: 'assets/category/ability/ico-Bienestar',
      description: 'El bienestar es una práctica continua de sentido. Aprende sobre hábitos saludables, técnicas de resiliencia, gestión del estrés y equilibrio emocional.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Comunicación',
      type: 'Habilidad',
      img: 'assets/category/ability/ico-Comunicacion',
      description: 'Trazar ideas claras transforma relaciones. Aprende storytelling, oratoria, redacción estratégica, comunicación digital y manejo de la imagen personal.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Creatividad',
      type: 'Habilidad',
      img: 'assets/category/ability/ico-Creatividad',
      description: 'Conecta la innovación con el sentido. Aprende design thinking, técnicas de ideación, pensamiento visual y métodos creativos de resolución de problemas.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Crecimiento personal',
      type: 'Habilidad',
      img: 'assets/category/ability/ico-Crecimiento-personal',
      description: 'Construye una ruta de expansión consciente. Aprende habilidades de liderazgo personal, gestión del cambio, inteligencia emocional y visión de vida.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Diversidad e inclusión',
      type: 'Habilidad',
      img: 'assets/category/ability/ico-Diversidad-equidad-e-inclusion',
      description: 'La conexión humana se construye en la diversidad. Aprende sobre inclusión laboral, liderazgo diverso, políticas de equidad y comunicación intercultural.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Estrategia',
      type: 'Habilidad',
      img: 'assets/category/ability/ico-Estrategia',
      description: 'Convertir ideas en impacto requiere visión. Aprende pensamiento estratégico, gestión del cambio, OKRs, planeación de negocios y escenarios futuros.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Liderazgo',
      type: 'Habilidad',
      img: 'assets/category/ability/ico-Liderazgo',
      description: 'Conectar y transformar equipos desde el propósito. Aprende liderazgo transformacional, gestión de equipos, toma de decisiones y coaching ejecutivo.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Personas y cultura',
      type: 'Habilidad',
      img: 'assets/category/ability/ico-Personas-y-cultura',
      description: 'Leer las dinámicas humanas traza líneas de éxito. Aprende cultura organizacional, desarrollo de talento, bienestar laboral y construcción de entornos de trabajo positivos.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Productividad',
      type: 'Habilidad',
      img: 'assets/category/ability/ico-Productividad',
      description: 'Cada acción alineada crea valor. Aprende técnicas de gestión del tiempo, metodologías ágiles, productividad personal y planificación estratégica.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Trabajo en equipo',
      type: 'Habilidad',
      img: 'assets/category/ability/ico-Trabajo-en-equipo',
      description: 'Conectar talentos multiplica los resultados. Aprende trabajo colaborativo, metodologías Scrum y Agile, liderazgo horizontal y resolución de conflictos.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
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
          img: '/assets/universities/icons/ico-Harvard.webp'
        },{
          name: 'Stanford University',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Stanford-University.webp'
        },{
          name: 'Columbia University',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Columbia-University.webp'
        },{
          name: 'IBM',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-IBM.png'
        },{
          name: 'Microsoft',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-Microsoft.png'
        },{
          name: 'Google',
          type: 'Universidad',
          img: '/assets/companies/icons/ico-Google-Cloud.png'
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
        },{
          name: 'University of Michigan',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-University-of-Michigan.webp'
        },{
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
        },{
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
        },{
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
