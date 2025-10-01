import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import TopicSelector from "../components/TopicSelector";
import PlatformsSelector from "../components/PlatformsSelector";
import HorizontalScroll from "../components/HorizontalScroll";
import Flags from "../components/Flags";
import ImageSlider3D from "../components/ImageSlider3D";
import HeroSlider from "../components/HeroSlider";
import FinisherHeaderComponent from '../components/FinisherHeaderComponent';
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import TopicGrid from "../components/TopicGrid";
//import LightRays from "../components/LightRays";

import endpoints from '../config/api';

function HomePage() {

   const topics = [
    {
      name: 'Aprendizaje de idioma',
      type: 'Tema',
      position: [{pos: 'topicText', size:'40', y:'9',x:'44'},{pos: 'topicImg', size: '60', y:'84',x:'48'},{pos: 'topicBlur', size: '30', y:'33',x:'15'}],
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
      position: [{pos: 'topicText', size:'48', y:'4',x:'30'},{pos: 'topicImg', size: '100', y:'76',x:'67'},{pos: 'topicBlur', size: '22', y:'22',x:'17'}],
      description: 'Explora las ideas, historias y expresiones que definen quiénes somos. Conoce el legado cultural que moldea nuestra visión del mundo.',
      universities: [
        {
          name: 'Parsons School of Design, The New School',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Parsons-School-of-Design-The-New-School.webp'
        },{
          name: 'Museum of Modern Art',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Museum-of-Modern-Art.png'
        },{
          name: 'Smithsonian',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-Smithsonian.png'
        },{
          name: 'Transforma Ideas en Arte - Es Devlin',
          link: '/certificacion/masterclass/transforma-ideas-en-arte-es-devlin',
          type: 'Certificacion',
          img: '/assets/universities/banners/masterclass/EsDevlin.jpg'
        },{
          name: 'Arte y Creatividad - Jeff Koons',
          link: '/certificacion/masterclass/arte-y-creatividad-jeff-koons',
          type: 'Certificacion',
          img: '/assets/universities/banners/masterclass/JeffKoons.jpg'
        }
      ]
    },{
      name: 'Ciencias de datos',
      type: 'Tema',
      position: [{pos: 'topicText', size:'48', y:'30',x:'30'},{pos: 'topicImg', size: '34', y:'31',x:'3'},{pos: 'topicBlur', size: '39', y:'30',x:'69'}],
      img: 'assets/category/topic/ico-Ciencia-de-datos',
      description: 'Convierte datos en decisiones inteligentes. Aprende a analizar, visualizar y comprender grandes volúmenes de información con impacto real.',
      universities: [
        {
          name: 'IBM',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-IBM.png'
        },{
          name: 'HP',
          type: 'Empresa',
          img: 'assets/companies/icons/ico-HP.png'
        },{
          name: 'DeepLearning.AI',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-DeepLearning-AI.png'
        },{
          name: 'Massachusetts Institute of Technology',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Massachusetts-Institute.webp'
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
          name: 'Massachusetts Institute of Technology',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Massachusetts-Institute.webp'
        },{
          name: 'Harvard University',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Harvard.webp'
        },{
          name: 'IBM',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-IBM.png'
        },{
          name: 'DeepLearning.AI',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-DeepLearning-AI.png'
        }
      ]
    },{
      name: 'Ciencias sociales',
      type: 'Tema',
      position: [{pos: 'topicText', size:'44', y:'92',x:'28'},{pos: 'topicImg', size: '170', y:'72',x:'87'},{pos: 'topicBlur', size: '30', y:'96',x:'37'}],
      img: 'assets/category/topic/ico-Ciencias-sociales',
      description: 'Comprende cómo pensamos, actuamos y evolucionamos como sociedad. Estudia economía, política y cultura para interpretar el mundo con criterio.',
      universities: [
        {
          name: 'Paul Krugman - Enseña Economía y Sociedad',
          type: 'Certificacion',
          link: '/certificacion/masterclass/paul-krugman-ensena-economia-y-sociedad',
          img: '/assets/universities/banners/masterclass/PaulKrugman.jpg'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        },{
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        }
      ]
    },{
      name: 'Ciencia física e ingeniería',
      type: 'Tema',
      position: [{pos: 'topicText', size:'43', y:'90',x:'48'},{pos: 'topicImg', size: '59', y:'58',x:'36'},{pos: 'topicBlur', size: '30', y:'55',x:'15'}],
      img: 'assets/category/topic/ico-Ciencias-fisicas-e-ingenieria',
      description: 'Aprende a diseñar, modelar y resolver problemas reales. Desde los fundamentos físicos hasta la ingeniería de vanguardia.',
      universities: [
        {
          name: 'Ciencia y Resolución de Problemas - Bill Nye',
          type: 'Certificacion',
          link: '/certificacion/masterclass/ciencia-y-resolucion-de-problemas-bill-nye',
          img: '/assets/universities/banners/masterclass/BillNye.jpg'
        },{
          name: 'La Exploración Espacial y lo que depara el futuro - Chris Hadfield',
          type: 'Certificacion',
          link: '/certificacion/masterclass/la-exploracion-espacial-y-lo-que-depara-el-futuro-chris-hadfield',
          img: '/assets/universities/banners/masterclass/ChrisHadfield.jpg'
        }
      ]
    },{
      name: 'Desarrollo personal',
      type: 'Tema',
      position: [{pos: 'topicText', size:'46', y:'34',x:'69'},{pos: 'topicImg', size: '60', y:'18',x:'64'},{pos: 'topicBlur', size: '35', y:'12',x:'52'}],
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
      position: [{pos: 'topicText', size:'36', y:'78',x:'10'},{pos: 'topicImg', size: '45', y:'25',x:'48'},{pos: 'topicBlur', size: '25', y:'16',x:'43'}],
      img: 'assets/category/topic/ico-Matematicas-y-logica',
      description: 'Activa tu pensamiento crítico. Aprende a resolver problemas complejos con lógica, estructura y claridad matemática.',
      universities: [
        {
          name: 'Pensamiento Matemático - Terence Tao',
          type: 'Certificacion',
          link: '/certificacion/masterclass/pensamiento-matematico-terence-tao',
          img: '/assets/universities/banners/masterclass/TerenceTao.jpeg'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Negocios',
      type: 'Tema',
      position: [{pos: 'topicText', size:'38', y:'13',x:'72'},{pos: 'topicImg', size: '50', y:'36',x:'35'},{pos: 'topicBlur', size: '34', y:'66',x:'34'}],
      img: 'assets/category/topic/ico-Negocios',
      description: 'Comprende cómo se construyen, escalan y lideran organizaciones en la era digital. Desde marketing hasta modelos de negocio.',
      universities: [
        {
          name: 'Richard Branson - Enseña Emprendimiento Disruptivo',
          type: 'Certificacion',
          link: '/certificacion/masterclass/richard-branson-ensena-emprendimiento-disruptivo',
          img: '/assets/universities/banners/masterclass/RichardBranson.jpg'
        },{
          name: 'Alexis Ohanian - Enseña a construir tu startup',
          type: 'Certificacion',
          link: '/certificacion/masterclass/alexis-ohanian-ensena-a-construir-tu-startup',
          img: '/assets/universities/banners/masterclass/AlexisOhanian.jpg'
        },{
          name: 'Mark Cuban - Gane a lo grande en los negocios',
          type: 'Certificacion',
          link: '/certificacion/masterclass/mark-cuban-gane-a-lo-grande-en-los-negocios',
          img: '/assets/universities/banners/masterclass/MarkCuban.jpg'
        },{
          name: 'Chris Voss - Enseña el arte de la negociación',
          type: 'Certificacion',
          link: '/certificacion/masterclass/chris-voss-ensena-el-arte-de-la-negociacion',
          img: '/assets/universities/banners/masterclass/ChrisVoss.jpg'
        },{
          name: 'Rosalind Brewer - Enseña Innovación Empresarial',
          type: 'Certificacion',
          link: '/certificacion/masterclass/rosalind-brewer-ensena-innovacion-empresarial',
          img: '/assets/universities/banners/masterclass/RosalindBrewer.jpg'
        },{
          name: 'HubSpot Academy',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-hubspot-academy.png'
        },{
          name: 'Universidad Anáhuac',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Universidades-Anahuac.webp'
        }
        
      ]
    },{
      name: 'Salud',
      type: 'Tema',
      position: [{pos: 'topicText', size:'74', y:'24',x:'32'},{pos: 'topicImg', size: '32', y:'72',x:'7'},{pos: 'topicBlur', size: '45', y:'61',x:'71'}],
      img: 'assets/category/topic/ico-Salud',
      description: 'Conoce tu cuerpo, promueve hábitos sanos y comprende cómo prevenir enfermedades desde la ciencia y la práctica.',
      universities: [
        {
          name: 'Harvard University',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Harvard.webp'
        },{
          name: 'Pontificia Universidad Catolica de Chile',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Pontificia-Universidad-Catolica-de-Chile.webp'
        },{
          name: 'University of Pennsylvania',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-University-of-Pennsylvania.webp'
        },{
          name: 'Yale University',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Yale-University.webp'
        },{
          name: 'The University of Chicago',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-The-University-of-Chicago.webp'
        },{
          name: 'Stanford University',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Stanford-University.webp'
        }
      ]
    },{
      name: 'Tecnología de información',
      type: 'Tema',
      position: [{pos: 'topicText', size:'48',y:'55',x:'48'},{pos: 'topicImg', size: '47', y:'18',x:'32'},{pos: 'topicBlur', size: '24', y:'90',x:'22'}],
      img: 'assets/category/topic/ico-Tecnologia-de-la-informacion',
      description: 'Gestiona el backend del mundo digital. Aprende redes, sistemas y servicios en la nube que mueven al planeta.',
      universities: [
        {
          name: 'Rochester Institute of Technology',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Rochester.webp'
        },{
          name: 'IBM',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-IBM.png'
        },{
          name: 'AWS',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-AWS.png'
        },{
          name: 'Microsoft',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-Microsoft.png'
        }
      ]
    },{
      name: 'Bienestar',
      type: 'Habilidad',
      position: [{pos: 'topicText', size:'48', y:'19',x:'43'},{pos: 'topicImg', size: '120', y:'68',x:'75'},{pos: 'topicBlur', size: '40', y:'74',x:'48'}],
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
      position: [{pos: 'topicText', size:'42', y:'75',x:'76'},{pos: 'topicImg', size: '38', y:'57',x:'1'},{pos: 'topicBlur', size: '35', y:'60',x:'48'}],
      img: 'assets/category/ability/ico-Comunicacion',
      description: 'Domina el arte de transmitir ideas con claridad y propósito. Aprende a persuadir, inspirar y conectar a través del lenguaje.',
      universities: [
        {
          name: 'Northwestern University',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Northwestern-University.webp'
        },{
          name: 'Deja Tu Huella con Humor - Kevin Hart',
          type: 'Certificacion',
          link: '/certificacion/masterclass/deja-tu-huella-con-humor-kevin-hart',
          img: '/assets/universities/banners/masterclass/KevinHart.jpg'
        },{
          name: 'George Stephanopoulos - Enseña la comunicación con propósito',
          type: 'Certificacion',
          link: '/certificacion/masterclass/george-stephanopoulos-ensena-la-comunicacion-con-proposito',
          img: '/assets/universities/banners/masterclass/GeorgeStephanopoulos.jpg'
        },{
          name: 'Original Series - Michael Lewis',
          type: 'Certificacion',
          link: '/certificacion/masterclass/original-series-michael-lewis',
          img: '/assets/universities/banners/masterclass/MichaelLewis.jpg'
        },{
          name: 'La Comedia - Steve Martin',
          type: 'Certificacion',
          link: '/certificacion/masterclass/la-comedia-steve-martin',
          img: '/assets/universities/banners/masterclass/stevemartin.jpg'
        }
      ]
    },{
      name: 'Creatividad',
      type: 'Habilidad',
      position: [{pos: 'topicText', size:'70', y:'70',x:'20'},{pos: 'topicImg', size: '62', y:'96',x:'53'},{pos: 'topicBlur', size: '40', y:'65',x:'85'}],
      img: 'assets/category/ability/ico-Creatividad',
      description: 'Despierta tu imaginación y transforma la forma en que ves el mundo. Aprende a innovar con pensamiento original y sensibilidad artística.',
      universities: [
        {
          name: 'Diseños de Moda Innovadores y Galardonados - Marc Jacobs',
          type: 'Certificacion',
          link: '/certificacion/masterclass/disenos-de-moda-innovadores-y-galardonados-marc-jacobs',
          img: '/assets/universities/banners/masterclass/MarcJacobs.jpg'
        },{
          name: 'Berklee College of Music',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Berklee-College-of-Music.webp'
        },{
          name: 'Metallica - Enseña a ser una banda',
          type: 'Certificacion',
          link: '/certificacion/masterclass/metallica-ensena-a-ser-una-banda',
          img: '/assets/universities/banners/masterclass/Metallica.jpg'
        },{
          name: 'Mariah Carey - Enseña la voz como instrumento',
          type: 'Certificacion',
          link: '/certificacion/masterclass/mariah-carey-ensena-la-voz-como-instrumento',
          img: '/assets/universities/banners/masterclass/MariahCarey.png'
        },{
          name: 'Alicia Keys - Enseña composición y producción de canciones',
          type: 'Certificacion',
          link: '/certificacion/masterclass/alicia-keys-ensena-composicion-y-produccion-de-canciones',
          img: '/assets/universities/banners/masterclass/AliciaKeys.jpeg'
        },{
          name: 'Ringo Starr - Enseña batería y colaboración creativa',
          type: 'Certificacion',
          link: '/certificacion/masterclass/ringo-starr-ensena-bateria-y-colaboracion-creativa',
          img: '/assets/universities/banners/masterclass/RingoStarr.jpg'
        }
      ]
    },{
      name: 'Crecimiento personal',
      type: 'Habilidad',
      position: [{pos: 'topicText', size:'40', y:'13',x:'14'},{pos: 'topicImg', size: '70', y:'63',x:'63'},{pos: 'topicBlur', size: '25', y:'94',x:'61'}],
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
      position: [{pos: 'topicText', size:'48', y:'37',x:'1'},{pos: 'topicImg', size: '60', y:'4',x:'60'},{pos: 'topicBlur', size: '22', y:'23',x:'56'}],
      img: 'assets/category/ability/ico-Diversidad-equidad-e-inclusion',
      description: 'Comprende la riqueza de lo diverso y aprende a construir espacios más equitativos, empáticos y humanos.',
      universities: [
        {
          name: 'University of California Irvine',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-University-of-California-Irvine.webp'
        },{
          name: 'University of Illinois Urbana-Champaign',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-University-of-Illinois-Urbana-Champaign.webp'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        }
      ]
    },{
      name: 'Estrategia',
      type: 'Habilidad',
      position: [{pos: 'topicText', size:'70', y:'83',x:'59'},{pos: 'topicImg', size: '30', y:'7',x:'22'},{pos: 'topicBlur', size: '36', y:'8',x:'32'}],
      img: 'assets/category/ability/ico-Estrategia',
      description: 'Piensa en grande y actúa con visión. Aprende a planear, analizar y tomar decisiones que generan impacto.',
      universities: [
        {
          name: 'Garry Kasparov - Enseña Ajedrez',
          type: 'Certificacion',
          link: '/certificacion/masterclass/garry-kasparov-ensena-ajedrez',
          img: '/assets/universities/banners/masterclass/GarryKasparov.jpg'
        },{
          name: 'Phil Ivey - Enseña estrategia de póker',
          type: 'Certificacion',
          link: '/certificacion/masterclass/phil-ivey-ensena-estrategia-de-poker',
          img: '/assets/universities/banners/masterclass/PhilIvey.jpg'
        },{
          name: 'Daniel Negreanu - Enseña póquer',
          type: 'Certificacion',
          link: '/certificacion/masterclass/daniel-negreanu-ensena-poquer',
          img: '/assets/universities/banners/masterclass/DanielNegreanu.jpg'
        }
      ]
    },{
      name: 'Liderazgo',
      type: 'Habilidad',
      position: [{pos: 'topicText', size:'48', y:'79',x:'77'},{pos: 'topicImg', size: '65', y:'31',x:'60'},{pos: 'topicBlur', size: '25', y:'75',x:'27'}],
      img: 'assets/category/ability/ico-Liderazgo',
      description: 'Desarrolla tu capacidad de guiar, inspirar y transformar equipos. Aprende de grandes líderes y sus decisiones clave.',
      universities: [
        {
          name: 'Howard Schultz - Liderazgo Empresarial',
          type: 'Certificacion',
          link: '/certificacion/masterclass/howard-schultz-liderazgo-empresarial',
          img: '/assets/universities/banners/masterclass/HowardSchultz.jpg'
        },{
          name: 'Harvard University',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Harvard.webp'
        },{
          name: 'Stanford University',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Stanford-University.webp'
        },{
          name: 'Indra Nooyi - Enseña a liderar con propósito',
          type: 'Certificacion',
          link: '/certificacion/masterclass/indra-nooyi-ensena-a-liderar-con-proposito',
          img: '/assets/universities/banners/masterclass/IndraNooyi.jpg'
        },{
          name: 'Serena Williams - Enseña tenis',
          type: 'Certificacion',
          link: '/certificacion/masterclass/serena-williams-ensena-tenis',
          img: '/assets/universities/banners/masterclass/SerenaWilliams.jpeg'
        },{
          name: 'Stephen Curry - Enseña tiro, manejo de la pelota y anotación',
          type: 'Certificacion',
          link: '/certificacion/masterclass/stephen-curry-ensena-tiro-manejo-de-la-pelota-y-anotacion',
          img: '/assets/universities/banners/masterclass/StephenCurry.jpg'
        }
      ]
    },{
      name: 'Personas y cultura',
      type: 'Habilidad',
      position: [{pos: 'topicText', size:'48', y:'77',x:'37'},{pos: 'topicImg', size: '42', y:'65',x:'22'},{pos: 'topicBlur', size: '43', y:'38',x:'78'}],
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
      position: [{pos: 'topicText', size:'68', y:'37',x:'45'},{pos: 'topicImg', size: '280', y:'28',x:'88'},{pos: 'topicBlur', size: '40', y:'16',x:'73'}],
      img: 'assets/category/ability/ico-Productividad',
      description: 'Gestiona tu tiempo, energía y enfoque con inteligencia. Aprende técnicas para hacer más con propósito y menos desgaste.',
      universities: [
        {
          name: 'IBM',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-IBM.png'
        },{
          name: 'James Clear - Pequeños hábitos que tienen un gran impacto en tu vida',
          type: 'Certificacion',
          link: '/certificacion/masterclass/james-clear-pequenos-habitos-que-tienen-un-gran-impacto-en-tu-vida',
          img: '/assets/universities/banners/masterclass/JamesClear.jpg'
        }
      ]
    },{
      name: 'Trabajo en equipo',
      type: 'Habilidad',
      position: [{pos: 'topicText', size:'52', y:'85',x:'17'},{pos: 'topicImg', size: '300', y:'56',x:'90'},{pos: 'topicBlur', size: '32', y:'82',x:'18'}],
      img: 'assets/category/ability/ico-Trabajo-en-equipo',
      description: 'Colabora, conecta y construye en conjunto. Aprende a liderar desde lo colectivo con inteligencia emocional.',
      universities: [
        {
          name: 'University of Michigan',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-University-of-Michigan.webp'
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
    fetch(endpoints.empresas)
      .then(res => res.json())
      .then(data => setLogos(data.filter(t => t.empr_est === "enabled")))
      .catch((err) => console.error("Error:", err));
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
  const x = useTransform(scrollYProgress, [0, 1], [0, -viewportWidth * 1]);

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
      <section className="h-[20vh] bg-gradient-to-t from-[#0F090B] to-transparent relative"></section>
      <section
        className="wrapper bg-[#0F090B]/30 relative section z-10"
      >
        
        <div
          className="container m-auto lg:px-4 justify-center-safe gap-2 "
        >
          {/*<TopicSelector topics={topics}/>
          <TopicGrid topics={topics} />      // 5 columnas por defecto*/}
          <TopicGrid
            topics={topics}
            columns={5}
          />
        </div>
        
      </section>
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
      <section className="w-screen h-full flex-shrink-0">
        <HorizontalScroll>
          <section className="w-screen h-full bg-[#0F090B] flex-shrink-0 flex items-center justify-center px-5">
            <div className="container m-auto">
              <PlatformsSelector platforms={platforms} />
            </div>
          </section>
          <Flags logos={logos} />
        </HorizontalScroll>
      </section>
      
      <section className="w-screen bg-[#0F090B] relative h-full flex-shrink-0 flex items-center justify-center section sect-6">
        <div className="container m-auto">
          <HeroSlider/>
        </div>
      </section>
    </>
  );
};

export default HomePage;
