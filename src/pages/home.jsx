import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import TopicSelector from "../components/TopicSelector";
import PlatformsSelector from "../components/PlatformsSelector";
import Flags from "../components/Flags";
import ImageSlider3D from "../components/ImageSlider3D";
import HeroSlider from "../components/HeroSlider";
import FinisherHeaderComponent from '../components/FinisherHeaderComponent';
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

function HomePage() {
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

   const topics = [
    {
      name: 'Aprendizaje de idioma',
      type: 'Tema',
      position: [{pos: 'topicText', size:'40', y:'7',x:'44'},{pos: 'topicImg', size: '32', y:'83',x:'51'},{pos: 'topicBlur', size: '38', y:'33',x:'20'}],
      img: 'assets/category/topic/ico-Aprendizaje-de-un-idioma',
      description: 'Expande tu universo cultural y profesional. Conecta a través del inglés, francés, alemán y más, cultivando habilidades de comunicación global.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
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
      position: [{pos: 'topicText', size:'48', y:'4',x:'28'},{pos: 'topicImg', size: '34', y:'76',x:'65'},{pos: 'topicBlur', size: '29', y:'20',x:'20'}],
      description: 'Explora las ideas, historias y expresiones que definen quiénes somos. Conoce el legado cultural que moldea nuestra visión del mundo.',
      universities: [
        {
          name: 'Berklee college of music',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Berklee-College-of-Music.webp'
        },{
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Duke University',
          type: 'Empresa',
          img: 'assets/universities/icons/ico-Duke-University.webp'
        }
      ]
    },{
      name: 'Ciencias de datos',
      type: 'Tema',
      position: [{pos: 'topicText', size:'48', y:'30',x:'30'},{pos: 'topicImg', size: '25', y:'29',x:'3'},{pos: 'topicBlur', size: '39', y:'32',x:'72'}],
      img: 'assets/category/topic/ico-Ciencia-de-datos',
      description: 'Convierte datos en decisiones inteligentes. Aprende a analizar, visualizar y comprender grandes volúmenes de información con impacto real.',
      universities: [
        {
          name: 'Harvard University',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Harvard.webp'
        },{
          name: 'Google Cloud',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'IBM',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-IBM.png'
        }
      ]
    },{
      name: 'Ciencias de la computación',
      type: 'Tema',
      position: [{pos: 'topicText', size:'26', y:'1',x:'36'},{pos: 'topicImg', size: '30', y:'18',x:'9'},{pos: 'topicBlur', size: '30', y:'35',x:'47'}],
      img: 'assets/category/topic/ico-Ciencias-de-la-computacion',
      description: 'Domina los lenguajes que impulsan la tecnología. Desde algoritmos hasta desarrollo de software, convierte ideas en soluciones digitales.',
      universities: [
        {
          name: 'IBM',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-IBM.png'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'University of Michigan',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-University-of-Michigan.webp'
        }
      ]
    },{
      name: 'Ciencias sociales',
      type: 'Tema',
      position: [{pos: 'topicText', size:'46', y:'92',x:'28'},{pos: 'topicImg', size: '40', y:'70',x:'85'},{pos: 'topicBlur', size: '50', y:'83',x:'62'}],
      img: 'assets/category/topic/ico-Ciencias-sociales',
      description: 'Comprende cómo pensamos, actuamos y evolucionamos como sociedad. Estudia economía, política y cultura para interpretar el mundo con criterio.',
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
      position: [{pos: 'topicText', size:'43', y:'90',x:'48'},{pos: 'topicImg', size: '42', y:'60',x:'40'},{pos: 'topicBlur', size: '40', y:'39',x:'10'}],
      img: 'assets/category/topic/ico-Ciencias-fisicas-e-ingenieria',
      description: 'Aprende a diseñar, modelar y resolver problemas reales. Desde los fundamentos físicos hasta la ingeniería de vanguardia.',
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
      position: [{pos: 'topicText', size:'48', y:'35',x:'69'},{pos: 'topicImg', size: '35', y:'12',x:'62'},{pos: 'topicBlur', size: '35', y:'12',x:'62'}],
      img: 'assets/category/topic/ico-Desarrollo-personal',
      description: 'Construye una versión más fuerte y consciente de ti. Aprende a tomar decisiones, comunicarte mejor y crecer en cada etapa de tu vida.',
      universities: [
        {
          name: 'Stanford University',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Harvard.webp'
        },{
          name: 'Universidad de Curtin',
          type: 'Universidad',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Columbia University',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Columbia-University.webp'
        }
      ]
    },{
      name: 'Matemáticas y lógica',
      type: 'Tema',
      position: [{pos: 'topicText', size:'36', y:'78',x:'10'},{pos: 'topicImg', size: '33', y:'24',x:'48'},{pos: 'topicBlur', size: '33', y:'13',x:'45'}],
      img: 'assets/category/topic/ico-Matematicas-y-logica',
      description: 'Activa tu pensamiento crítico. Aprende a resolver problemas complejos con lógica, estructura y claridad matemática.',
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
      position: [{pos: 'topicText', size:'38', y:'13',x:'72'},{pos: 'topicImg', size: '34', y:'35',x:'33'},{pos: 'topicBlur', size: '34', y:'65',x:'32'}],
      img: 'assets/category/topic/ico-Negocios',
      description: 'Comprende cómo se construyen, escalan y lideran organizaciones en la era digital. Desde marketing hasta modelos de negocio.',
      universities: [
        {
          name: 'Tecnológico de Monterrey',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Tecnologico-de-Monterrey.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'University of Michigan',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-University-of-Michigan.webp'
        }
      ]
    },{
      name: 'Salud',
      type: 'Tema',
      position: [{pos: 'topicText', size:'75', y:'22',x:'30'},{pos: 'topicImg', size: '30', y:'71',x:'16'},{pos: 'topicBlur', size: '50', y:'71',x:'75'}],
      img: 'assets/category/topic/ico-Salud',
      description: 'Conoce tu cuerpo, promueve hábitos sanos y comprende cómo prevenir enfermedades desde la ciencia y la práctica.',
      universities: [
        {
          name: 'Universidad de Palermo',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-Palermo.webp'
        },{
          name: 'Google',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Stanford University',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Stanford-University.webp'
        }
      ]
    },{
      name: 'Tecnología de información',
      type: 'Tema',
      position: [{pos: 'topicText', size:'38', y:'77',x:'37'},{pos: 'topicImg', size: '32', y:'13',x:'36'},{pos: 'topicBlur', size: '24', y:'89',x:'22'}],
      img: 'assets/category/topic/ico-Tecnologia-de-la-informacion',
      description: 'Gestiona el backend del mundo digital. Aprende redes, sistemas y servicios en la nube que mueven al planeta.',
      universities: [
        {
          name: 'Google Cloud',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        },{
          name: 'Universidad Austral',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-Austral.webp'
        }
      ]
    },{
      name: 'Bienestar',
      type: 'Habilidad',
      position: [{pos: 'topicText', size:'48', y:'19',x:'43'},{pos: 'topicImg', size: '25', y:'85',x:'77'},{pos: 'topicBlur', size: '40', y:'74',x:'43'}],
      img: 'assets/category/ability/ico-Bienestar',
      description: 'Equilibra cuerpo, mente y entorno. Aprende a manejar el estrés, mejorar tu alimentación y cultivar salud mental.',
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
      position: [{pos: 'topicText', size:'38', y:'22',x:'56'},{pos: 'topicImg', size: '36', y:'60',x:'3'},{pos: 'topicBlur', size: '45', y:'86',x:'39'}],
      img: 'assets/category/ability/ico-Comunicacion',
      description: 'Domina el arte de transmitir ideas con claridad y propósito. Aprende a persuadir, inspirar y conectar a través del lenguaje.',
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
      position: [{pos: 'topicText', size:'70', y:'70',x:'24'},{pos: 'topicImg', size: '28', y:'64',x:'68'},{pos: 'topicBlur', size: '48', y:'60',x:'80'}],
      img: 'assets/category/ability/ico-Creatividad',
      description: 'Despierta tu imaginación y transforma la forma en que ves el mundo. Aprende a innovar con pensamiento original y sensibilidad artística.',
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
      position: [{pos: 'topicText', size:'40', y:'13',x:'14'},{pos: 'topicImg', size: '25', y:'64',x:'56'},{pos: 'topicBlur', size: '25', y:'94',x:'59'}],
      img: 'assets/category/ability/ico-Crecimiento-personal',
      description: 'Impulsa tu desarrollo emocional, físico y mental con el ejemplo de quienes superaron límites.',
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
      position: [{pos: 'topicText', size:'48', y:'36',x:'1'},{pos: 'topicImg', size: '24', y:'24',x:'83'},{pos: 'topicBlur', size: '38', y:'27',x:'28'}],
      img: 'assets/category/ability/ico-Diversidad-equidad-e-inclusion',
      description: 'Comprende la riqueza de lo diverso y aprende a construir espacios más equitativos, empáticos y humanos.',
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
      position: [{pos: 'topicText', size:'70', y:'86',x:'60'},{pos: 'topicImg', size: '30', y:'7',x:'22'},{pos: 'topicBlur', size: '36', y:'8',x:'32'}],
      img: 'assets/category/ability/ico-Estrategia',
      description: 'Piensa en grande y actúa con visión. Aprende a planear, analizar y tomar decisiones que generan impacto.',
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
      position: [{pos: 'topicText', size:'62', y:'80',x:'77'},{pos: 'topicImg', size: '25', y:'32',x:'63'},{pos: 'topicBlur', size: '25', y:'75',x:'27'}],
      img: 'assets/category/ability/ico-Liderazgo',
      description: 'Desarrolla tu capacidad de guiar, inspirar y transformar equipos. Aprende de grandes líderes y sus decisiones clave.',
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
      position: [{pos: 'topicText', size:'55', y:'59',x:'55'},{pos: 'topicImg', size: '25', y:'63',x:'21'},{pos: 'topicBlur', size: '43', y:'39',x:'78'}],
      img: 'assets/category/ability/ico-Personas-y-cultura',
      description: 'Descubre cómo se crean las narrativas que nos unen. Desde sociología hasta cultura pop, entiende lo que mueve a las personas.',
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
      position: [{pos: 'topicText', size:'68', y:'37',x:'45'},{pos: 'topicImg', size: '30', y:'79',x:'30'},{pos: 'topicBlur', size: '40', y:'73',x:'7'}],
      img: 'assets/category/ability/ico-Productividad',
      description: 'Gestiona tu tiempo, energía y enfoque con inteligencia. Aprende técnicas para hacer más con propósito y menos desgaste.',
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
      position: [{pos: 'topicText', size:'52', y:'85',x:'17'},{pos: 'topicImg', size: '32', y:'59',x:'89'},{pos: 'topicBlur', size: '32', y:'82',x:'18'}],
      img: 'assets/category/ability/ico-Trabajo-en-equipo',
      description: 'Colabora, conecta y construye en conjunto. Aprende a liderar desde lo colectivo con inteligencia emocional.',
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
      name: 'Inteligencia Artificial',
      type: 'search',
      position: [{pos: 'topicText', size:'49', y:'26',x:'58'}],
      img: '',
      description: 'Descubre cómo las máquinas pueden aprender, adaptarse y tomar decisiones. Desde modelos predictivos hasta ética de la IA, prepárate para liderar la revolución tecnológica.',
      universities: [
        {
          name: 'UNAM',
          type: 'search',
          img: ''
        },{
          name: 'Google',
          type: 'search',
          img: ''
        },{
          name: 'Universidad de los Andes',
          type: 'search',
          img: ''
        }
      ]
    },{
      name: 'Ciberseguridad',
      type: 'search',
      position: [{pos: 'topicText', size:'52', y:'65',x:'76'}],
      img: '',
      description: 'Protege lo más valioso del entorno digital. Aprende a detectar vulnerabilidades, gestionar riesgos y diseñar sistemas más seguros para un mundo interconectado.',
      universities: [
        {
          name: 'UNAM',
          type: 'search',
          img: ''
        },{
          name: 'Google',
          type: 'search',
          img: ''
        },{
          name: 'Universidad de los Andes',
          type: 'search',
          img: ''
        }
      ]
    },{
      name: 'Programación',
      type: 'search',
      position: [{pos: 'topicText', size:'49', y:'70',x:'50'}],
      img: '',
      description: 'Habla el lenguaje que construye el futuro. Aprende a desarrollar software, automatizar tareas y resolver problemas con código.',
      universities: [
        {
          name: 'Programación web',
          type: 'search',
          img: ''
        },{
          name: 'Programación con Python',
          type: 'search',
          img: ''
        }
      ]
    },{
      name: 'Diseño',
      type: 'search',
      position: [{pos: 'topicText', size:'69', y:'80',x:'38'}],
      img: '',
      description: 'Crea experiencias visuales con propósito. Desde diseño gráfico hasta UX/UI, aprende a comunicar ideas que conectan, impactan y transforman.',
      universities: [
        {
          name: 'Diseño e innovación',
          type: 'search',
          img: ''
        },{
          name: 'Diseño gráfico',
          type: 'search',
          img: ''
        },{
          name: 'Diseño y Arquitectura',
          type: 'search',
          img: ''
        }
      ]
    },{
      name: 'Marketing digital',
      type: 'search',
      position: [{pos: 'topicText', size:'43', y:'25',x:'6'}],
      img: '',
      description: 'Entiende cómo funcionan las marcas en la era digital. Aprende a atraer, convertir y fidelizar audiencias con herramientas y estrategias actualizadas.',
      universities: [
        {
          name: 'Estrategia de marketing',
          type: 'search',
          img: ''
        },{
          name: 'Marketing gerencial',
          type: 'search',
          img: ''
        },{
          name: 'Medición de marketing',
          type: 'search',
          img: ''
        }
      ]
    },{
      name: 'Neurociencia',
      type: 'search',
      position: [{pos: 'topicText', size:'44', y:'20',x:'72'}],
      img: '',
      description: 'Explora el cerebro humano desde la ciencia. Comprende cómo pensamos, sentimos y aprendemos, y aplica este conocimiento en salud, educación y tecnología.',
      universities: [
        {
          name: 'UNAM',
          type: 'search',
          img: ''
        },{
          name: 'Google',
          type: 'search',
          img: ''
        },{
          name: 'Universidad de los Andes',
          type: 'search',
          img: ''
        }
      ]
    },{
      name: 'Psicología',
      type: 'search',
      position: [{pos: 'topicText', size:'50', y:'68',x:'4'}],
      img: '',
      description: 'Conoce el comportamiento humano en profundidad. Aprende teorías, métodos y herramientas para comprender, acompañar y transformar realidades personales y sociales.',
      universities: [
        {
          name: 'UNAM',
          type: 'search',
          img: ''
        },{
          name: 'Google',
          type: 'search',
          img: ''
        },{
          name: 'Universidad de los Andes',
          type: 'search',
          img: ''
        }
      ]
    },{
      name: 'Videojuegos',
      type: 'search',
      position: [{pos: 'topicText', size:'44', y:'59',x:'20'}],
      img: '',
      description: 'Descubre el poder narrativo y técnico del gaming. Aprende diseño, desarrollo y lógica interactiva en una industria creativa y en constante evolución.',
      universities: [
        {
          name: 'UNAM',
          type: 'search',
          img: ''
        },{
          name: 'Google',
          type: 'search',
          img: ''
        },{
          name: 'Universidad de los Andes',
          type: 'search',
          img: ''
        }
      ]
    },{
      name: 'Educación',
      type: 'search',
      position: [{pos: 'topicText', size:'42', y:'95',x:'43'}],
      img: '',
      description: 'Diseña nuevas formas de enseñar y aprender. Explora metodologías, tecnologías y enfoques que hacen de la educación una experiencia transformadora.',
      universities: [
        {
          name: 'Educación ambiental',
          type: 'search',
          img: ''
        },{
          name: 'Innovación educativa',
          type: 'search',
          img: ''
        },{
          name: 'Capacidad de aprendizaje',
          type: 'search',
          img: ''
        }
      ]
    }
  ];
  

  const platforms = [
    {
      name: 'EdX',
      type: 'Plataforma',
      img: 'assets/platforms/icons/icon-edx.png',
      description: 'Accede a educación universitaria de prestigio global, con certificaciones reconocidas y flexibilidad para aprender a tu ritmo.',
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
      description: 'Aprende habilidades prácticas con expertos de universidades y empresas líderes. Certificaciones para avanzar profesionalmente desde casa',
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
      description: 'Inspiración y técnicas exclusivas de íconos mundiales. Aprende directamente de los mejores en su campo.',
      universities: [
        {
          name: 'Bienestar',
          type: 'Habilidad',
          img: '/assets/category/ability/ico-Bienestar.png'
        },{
          name: 'Estrategia',
          type: 'Habilidad',
          img: '/assets/category/ability/ico-Estrategia.png'
        },
        {
          name: 'Liderazgo',
          type: 'Habilidad',
          img: '/assets/category/ability/ico-Liderazgo.png'
        },{
          name: 'Personas y cultura',
          type: 'Habilidad',
          img: '/assets/category/ability/ico-Personas-y-cultura.png'
        },{
          name: 'Comunicación',
          type: 'Habilidad',
          img: '/assets/category/ability/ico-Comunicacion.png'
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
const [logos, setLogos] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/companies/")
      .then(res => res.json())
      .then(data => setLogos(data.filter(t => t.empr_est === "enabled")));
  }, []);

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Zoom scroll effect para sect-2
  const zoomRef = useRef(null);
  const { scrollYProgress: zoomScrollY } = useScroll({
    target: zoomRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(zoomScrollY, [0, 0.5, 1], [0.5, 1.2, 0.4]);
  const springScale = useSpring(scale, { stiffness: 100, damping: 20 });

  // Scroll horizontal secciones 3-5
  const scrollContainerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -viewportWidth * 2]);

  const background = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#0F090B", "#F6F4EF", "#0F090B"]
  );


  // Video autoplay handling
  const [statePopUp, setStatePopUp] = useState(false);
  const videoRef = useRef(null);
  useEffect(() => {
    if (statePopUp && videoRef.current) {
      videoRef.current.play().catch(() => {
        videoRef.current.muted = true;
        videoRef.current.play();
      });
    } else if (!statePopUp && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [statePopUp]);


  return (
    <>
      <Helmet>
        <title>Top.education</title>
        <meta name="description" content="Conoce Top Education..." />
        <meta property="og:title" content="Top Education | Aprende con edX, Coursera y MasterClass" />
        <meta name="author" content="Top Education" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Sección 1 */}
      <FinisherHeaderComponent className="sect-1" />

      {/* Sección 2: Zoom Scroll */}
      <motion.section
        ref={zoomRef}
        style={{ scale: springScale }}
        className="wrapper bg-[#0F090B] relative section sect-2"
      >
        <div className="container m-auto px-2 lg:px-4 py-15 justify-center-safe gap-2">
          <TopicSelector topics={topics} />
        </div>
      </motion.section>
      {/* Sección 3 */}
      <section className="wrapper w-screen h-full bg-[#0F090B] relative flex-shrink-0 flex items-center justify-center">
        <div className="container m-auto py-30 max-w-[90vw] text-center">
          <h2 className="text-white text-4xl lg:text-6xl font-normal top-italic leading-[1.2em] mb-5">
            Aprende con las universidades <br></br>líderes del mundo
          </h2>
          <ImageSlider3D images={flagsImages} action="explora" />
        </div>
      </section>

      {/* Secciones 3-5: Scroll Horizontal */}
      <section
        ref={scrollContainerRef}
        className="relative bg-[#0F090B]"
        style={{ height: `${2 * 100}vh` }} // 3 secciones × 100vh = 300vh de scroll vertical
      >
        <motion.div 
        className="sticky top-0 h-screen w-screen overflow-hidden"
        >
          <motion.div style={{ x }} className="flex flex-row w-[100vw]  h-full" >

            {/* Sección 4 */}
            <section className="w-screen h-full flex-shrink-0 flex items-center justify-center px-10">
              <div className="container m-auto">
                <PlatformsSelector platforms={platforms} />
              </div>
            </section>

            {/* Sección 5 */}
            <section className="w-screen h-full  flex-shrink-0 flex items-center justify-center px-10">
              <div className="m-auto max-w-[110vw]  mr-[-10vw] text-center">
                <Flags direction="left" logos={logos} />
              </div>
            </section>
          </motion.div>
        </motion.div>
      </section>

      {/* Sección 6 */}
      <section className="wrapper relative bg-[#0F090B] section sect-6">
        <div className="container m-auto">
          <HeroSlider authors={authors} />
        </div>
      </section>
    </>
  );
};

export default HomePage;
