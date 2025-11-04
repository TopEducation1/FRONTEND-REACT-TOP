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
import Galaxy from "../components/GalaxyBackground";
//import LightRays from "../components/LightRays";

import endpoints from '../config/api';

function HomePage() {

   const topics = [
    {
      name: 'Aprendizaje de idioma',
      type: 'Tema',
      position: [{pos: 'topicText', size:'40', y:'9',x:'44'},{pos: 'topicImg', size: '60', y:'84',x:'48'},{pos: 'topicBlur', size: '30', y:'33',x:'15'}],
      img: 'assets/category/topic/ico-Aprendizaje-de-un-idioma',
      color: '#5CC781',
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
        },{
          name: 'University of California, Davis',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-u-califonia-davis.webp'
        }
        
      ]
    },
    {
      name: 'Arte y humanidades',
      img: 'assets/category/topic/ico-Artes-y-humanidades',
      color: '#034694',
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
      color: '#5CC781',
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
      color: '#034694',
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
      color: '#5CC781',
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
        },{
          name: 'IE Business School',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-IE-Business-school.webp'
        }
      ]
    },{
      name: 'Ciencia, física e ingeniería',
      type: 'Tema',
      position: [{pos: 'topicText', size:'43', y:'90',x:'48'},{pos: 'topicImg', size: '59', y:'58',x:'36'},{pos: 'topicBlur', size: '30', y:'55',x:'15'}],
      img: 'assets/category/topic/ico-Ciencias-fisicas-e-ingenieria',
      color: '#D33B3E',
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
        },{
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Pontificia Universidad Catolica de Chile',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Pontificia-Universidad-Catolica-de-Chile.webp'
        }
      ]
    },{
      name: 'Desarrollo personal',
      type: 'Tema',
      position: [{pos: 'topicText', size:'46', y:'34',x:'69'},{pos: 'topicImg', size: '60', y:'18',x:'64'},{pos: 'topicBlur', size: '35', y:'12',x:'52'}],
      img: 'assets/category/topic/ico-Desarrollo-personal',
      color: '#D33B3E',
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
        },{
          name: 'Fundación Raspberry Pi',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-Fundacion-Raspberry-Pi.png'
        }
      ]
    },{
      name: 'Matemáticas y lógica',
      type: 'Tema',
      position: [{pos: 'topicText', size:'36', y:'78',x:'10'},{pos: 'topicImg', size: '45', y:'25',x:'48'},{pos: 'topicBlur', size: '25', y:'16',x:'43'}],
      img: 'assets/category/topic/ico-Matematicas-y-logica',
      color: '#034694',
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
        },{
          name: 'Universitat Politècnica de València',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-u-politecnica-de-valencia.webp'
        },{
          name: 'The University of Adelaide',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-u-adelaide.webp'
        }
      ]
    },{
      name: 'Negocios',
      type: 'Tema',
      position: [{pos: 'topicText', size:'38', y:'13',x:'72'},{pos: 'topicImg', size: '50', y:'36',x:'35'},{pos: 'topicBlur', size: '34', y:'66',x:'34'}],
      img: 'assets/category/topic/ico-Negocios',
      color: '#D33B3E',
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
      color: '#D33B3E',
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
      color: '#5CC781',
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
      color: '#D33B3E',
      description: 'Equilibra cuerpo, mente y entorno. Aprende a manejar el estrés, mejorar tu alimentación y cultivar salud mental.',
      universities: [
        {
          name: 'Donna Farhi - Enseña Fundamentos de Yoga',
          type: 'Certificacion',
          link: '/certificacion/masterclass/donna-farhi-ensena-fundamentos-de-yoga',
          img: '/assets/universities/banners/masterclass/DonnaFarhi.jpg'
        },{
          name: 'Jon Kabat-Zinn - Enseña Mindfulness y Meditación',
          type: 'Certificacion',
          link: '/certificacion/masterclass/jon-kabat-zinn-ensena-mindfulness-y-meditacion',
          img: '/assets/universities/banners/masterclass/JonKabatZinn.jpg'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        },{
          name: ' Salud Cerebral',
          type: 'Certificacion',
          link: '/certificacion/masterclass/dr-wendy-suzuki-dr-lisa-feldman-barrett-dr-uma-naidoo-and-gregory-gourdet-salud-cerebral',
          img: '/assets/universities/banners/masterclass/BrainHealth.jpg'
        },{
          name: 'Universidad del Rosario',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Universidad-del-Rosario.webp'
        }
      ]
    },{
      name: 'Comunicación',
      type: 'Habilidad',
      position: [{pos: 'topicText', size:'42', y:'75',x:'76'},{pos: 'topicImg', size: '38', y:'57',x:'1'},{pos: 'topicBlur', size: '35', y:'60',x:'48'}],
      img: 'assets/category/ability/ico-Comunicacion',
      color: '#034694',
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
      color: '#D33B3E',
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
      color: '#5CC781',
      description: 'Impulsa tu desarrollo emocional, físico y mental con el ejemplo de quienes superaron límites.',
      universities: [
        {
          name: 'Jay Shetty - Navegando por el cambio',
          type: 'Certificacion',
          link: '/certificacion/masterclass/jay-shetty-navegando-por-el-cambio',
          img: '/assets/universities/banners/masterclass/JayShetty.jpg'
        },{
          name: 'Jeff Goodby & Rich Silverstein - Enseñar Publicidad y Creatividad',
          type: 'Certificacion',
          link: '/certificacion/masterclass/jeff-goodby-rich-silverstein-ensenar-publicidad-y-creatividad',
          img: '/assets/universities/banners/masterclass/JeffGoodby&RichSilverstein.jpg'
        },{
          name: 'Enseña Skateboarding',
          type: 'Certificacion',
          link: '/certificacion/masterclass/tony-hawk-ensena-skateboarding',
          img: '/assets/universities/banners/masterclass/TonyHawk.jpg'
        },{
          name: 'Enseña a dar con impacto',
          type: 'Certificacion',
          link: '/certificacion/masterclass/melinda-french-gates-ensena-a-dar-con-impacto',
          img: '/assets/universities/banners/masterclass/MelindaFrenchGates.jpg'
        }
      ]
    },{
      name: 'Diversidad e inclusión',
      type: 'Habilidad',
      position: [{pos: 'topicText', size:'48', y:'37',x:'1'},{pos: 'topicImg', size: '60', y:'4',x:'60'},{pos: 'topicBlur', size: '22', y:'23',x:'56'}],
      img: 'assets/category/ability/ico-Diversidad-equidad-e-inclusion',
      color: '#034694',
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
        },{
          name: 'Enseña a rastrear tus raíces a través de la comida',
          type: 'Certificacion',
          link: '/certificacion/masterclass/michael-w-twitty-ensena-a-rastrear-tus-raices-a-traves-de-la-comida',
          img: '/assets/universities/banners/masterclass/MichaelTwitty.webp'
        },{
          name: 'Lecciones de voces negras influyentes',
          type: 'Certificacion',
          link: '/certificacion/masterclass/angela-davis-cornel-west-kimberle-williams-crenshaw-nikole-hannah-jones-sherrilyn-ifill-jelani-cobb-and-john-mcwhorter-lecciones-de-voces-negras-influyentes',
          img: '/assets/universities/banners/masterclass/Blackhistory.jpg'
        }
      ]
    },{
      name: 'Estrategia',
      type: 'Habilidad',
      position: [{pos: 'topicText', size:'70', y:'83',x:'59'},{pos: 'topicImg', size: '30', y:'7',x:'22'},{pos: 'topicBlur', size: '36', y:'8',x:'32'}],
      img: 'assets/category/ability/ico-Estrategia',
      color: '#D33B3E',
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
        },{
          name: 'El poder de la empatía',
          type: 'Certificacion',
          link: '/certificacion/masterclass/pharrell-williams-robin-arzon-roxane-gay-walter-mosley-robert-reffkin-gloria-steinem-and-cornel-west-el-poder-de-la-empatia',
          img: '/assets/universities/banners/masterclass/Elpoderdelaempatia.webp'
        }
      ]
    },{
      name: 'Liderazgo',
      type: 'Habilidad',
      position: [{pos: 'topicText', size:'48', y:'79',x:'77'},{pos: 'topicImg', size: '65', y:'31',x:'60'},{pos: 'topicBlur', size: '25', y:'75',x:'27'}],
      img: 'assets/category/ability/ico-Liderazgo',
      color: '#5CC781',
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
      color: '#5CC781',
      description: 'Descubre cómo se crean las narrativas que nos unen. Desde sociología hasta cultura pop, entiende lo que mueve a las personas.',
      universities: [
        {
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Original Series - Chris Voss, Chris Hadfield, Condoleezza Rice, and Stephen Hadley',
          type: 'Certificacion',
          link: '/certificacion/masterclass/original-series-chris-voss-chris-hadfield-condoleezza-rice-and-stephen-hadley',
          img: '/assets/universities/banners/masterclass/crisis-day.png'
        },{
          name: 'Pensamiento Independiente y el poder Invisible de los medios de comunicación',
          type: 'Certificacion',
          link: '/certificacion/masterclass/pensamiento-independiente-y-el-poder-invisible-de-los-medios-de-comunicacion-noam-chomsky',
          img: '/assets/universities/banners/masterclass/NoamChomsky.jpeg'
        },{
          name: 'Piensa como un jefe, vive como una leyenda',
          type: 'Certificacion',
          link: '/certificacion/masterclass/martha-stewart-piensa-como-un-jefe-vive-como-una-leyenda',
          img: '/assets/universities/banners/masterclass/MarthaStewart.jpg'
        }
      ]
    },{
      name: 'Productividad',
      type: 'Tema',
      position: [{pos: 'topicText', size:'68', y:'37',x:'45'},{pos: 'topicImg', size: '280', y:'28',x:'88'},{pos: 'topicBlur', size: '40', y:'16',x:'73'}],
      img: 'assets/category/ability/ico-Productividad',
      color: '#034694',
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
        },{
          name: 'Harvard University',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Harvard.webp'
        },{
          name: 'University of California Irvine',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-University-of-California-Irvine.webp'
        }
      ]
    },{
      name: 'Trabajo en equipo',
      type: 'Habilidad',
      position: [{pos: 'topicText', size:'52', y:'85',x:'17'},{pos: 'topicImg', size: '300', y:'56',x:'90'},{pos: 'topicBlur', size: '32', y:'82',x:'18'}],
      img: 'assets/category/ability/ico-Trabajo-en-equipo',
      color: '#034694',
      description: 'Colabora, conecta y construye en conjunto. Aprende a liderar desde lo colectivo con inteligencia emocional.',
      universities: [
        {
          name: 'University of Michigan',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-University-of-Michigan.webp'
        },{
          name: 'Mentalidad ganadora - Lewis Hamilton',
          type: 'Certificacion',
          link: '/certificacion/masterclass/mentalidad-ganadora-lewis-hamilton',
          img: '/assets/universities/banners/masterclass/LewisHamilton.jpg'
        },{
          name: 'Metallica - Enseña a ser una banda',
          type: 'Certificacion',
          link: '/certificacion/masterclass/metallica-ensena-a-ser-una-banda',
          img: 'https://top.education/assets/universities/banners/masterclass/Metallica.jpg'
        }
      ]
    },{
      name: 'Inteligencia Artificial',
      type: 'search',
      position: [{pos: 'topicText', size:'44', y:'25',x:'58'}],
      img: '/assets/category/icons/ico-inteligencia-artificial-t.png',
      color: '#034694',
      description: 'Descubre cómo las máquinas pueden aprender, adaptarse y tomar decisiones. Desde modelos predictivos hasta ética de la IA, prepárate para liderar la revolución tecnológica.',
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
          name: 'Microsoft',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-Microsoft.png'
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
      name: 'Programación',
      type: 'search',
      position: [{pos: 'topicText', size:'49', y:'70',x:'50'}],
      img: '/assets/category/icons/ico-programacion-t.png',
      color: '#034694',
      description: 'Habla el lenguaje que construye el futuro. Aprende a desarrollar software, automatizar tareas y resolver problemas con código.',
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
          name: 'Microsoft',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-Microsoft.png'
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
      name: 'Marketing digital',
      type: 'search',
      position: [{pos: 'topicText', size:'43', y:'25',x:'6'}],
      img: '/assets/category/icons/ico-marketing-t.png',
      color: '#034694',
      description: 'Entiende cómo funcionan las marcas en la era digital. Aprende a atraer, convertir y fidelizar audiencias con herramientas y estrategias actualizadas.',
      universities: [
        {
          name: 'Karl Rove and David Axelrod - Enseñar estrategia de campaña y mensajes',
          type: 'Certificacion',
          link: '/certificacion/masterclass/karl-rove-and-david-axelrod-ensenar-estrategia-de-campana-y-mensajes',
          img: '/assets/universities/banners/masterclass/KarlRoveandDavidAxelrod.jpg'
        },{
          name: 'Universidad de Palermo',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Universidad-de-Palermo.webp'
        },{
          name: 'IE Business School',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-IE-Business-school.webp'
        },{
          name: 'Google',
          type: 'Universidad',
          img: '/assets/companies/icons/ico-Google-Cloud.png'
        },{
          name: 'Universidad Austral',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Universidad-Austral.webp'
        }
      ]
    },{
      name: 'Cine',
      type: 'search',
      position: [{pos: 'topicText', size:'44', y:'20',x:'72'}],
      img: '/assets/category/icons/ico-cine-t.png',
      color: '#034694',
      description: 'Explora el cerebro humano desde la ciencia. Comprende cómo pensamos, sentimos y aprendemos, y aplica este conocimiento en salud, educación y tecnología.',
      universities: [
        {
          name: 'Martin Scorsese - Enseña Cinematografía',
          type: 'Certificacion',
          link: '/certificacion/masterclass/martin-scorsese-ensena-cinematografia',
          img: '/assets/universities/banners/masterclass/MartinScorsese.jpg'
        },{
          name: 'Hans Zimmer - Enseña composición de música para películas',
          type: 'Certificacion',
          link: '/certificacion/masterclass/hans-zimmer-ensena-composicion-de-musica-para-peliculas',
          img: '/assets/universities/banners/masterclass/HansZimmer.jpg'
        },{
          name: 'Enseña Cinematografía - James Cameron',
          type: 'Certificacion',
          link: '/certificacion/masterclass/ensena-cinematografia-james-cameron',
          img: '/assets/universities/banners/masterclass/JamesCameron.jpg'
        },{
          name: 'Jodie Foster - Enseña Cinematografía',
          type: 'Certificacion',
          link: '/certificacion/masterclass/jodie-foster-ensena-cinematografia',
          img: '/assets/universities/banners/masterclass/JodieFoster.jpg'
        }
      ]
    },{
      name: 'Psicología',
      type: 'search',
      position: [{pos: 'topicText', size:'50', y:'65',x:'4'}],
      img: '/assets/category/icons/ico-psicologia-t.png',
      color: '#034694',
      description: 'Conoce el comportamiento humano en profundidad. Aprende teorías, métodos y herramientas para comprender, acompañar y transformar realidades personales y sociales.',
      universities: [
        {
          name: 'Robin Arzón - Enseña fuerza mental',
          type: 'Certificacion',
          link: '/certificacion/masterclass/robin-arzon-ensena-fuerza-mental',
          img: '/assets/universities/banners/masterclass/RobinArzon.jpg'
        },{
          name: 'Universidad de Palermo',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Universidad-de-Palermo.webp'
        },{
          name: 'UNAM',
          type: 'Universidad',
          img: 'assets/universities/icons/ico-UNAM.webp'
        },{
          name: 'Yale University',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Yale-University.webp'
        }
      ]
    },{
      name: 'Videojuegos',
      type: 'search',
      position: [{pos: 'topicText', size:'47', y:'59',x:'14'}],
      img: '/assets/category/icons/ico-videojuegos-t.png',
      color: '#034694',
      description: 'Descubre el poder narrativo y técnico del gaming. Aprende diseño, desarrollo y lógica interactiva en una industria creativa y en constante evolución.',
      universities: [
        {
          name: 'Universidad Autónoma de Barcelona',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-U-Autonoma-de-barcelona.webp'
        },{
          name: 'Universidad de los Andes',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Universidad-de-los-Andes.webp'
        },{
          name: 'Enseña diseño y teoría de juegos',
          type: 'Certificacion',
          link: '/certificacion/masterclass/will-wright-ensena-diseno-y-teoria-de-juegos',
          img: '/assets/universities/banners/masterclass/WillWright.jpg'
        },{
          name: 'HP',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-HP.png'
        }
      ]
    },{
      name: 'Educación',
      type: 'search',
      color: '#034694',
      position: [{pos: 'topicText', size:'42', y:'64',x:'47'}],
      img: '/assets/category/icons/ico-educacion-t.png',
      description: 'Diseña nuevas formas de enseñar y aprender. Explora metodologías, tecnologías y enfoques que hacen de la educación una experiencia transformadora.',
      universities: [
        {
          name: 'Stanford University',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Stanford-University.webp'
        },{
          name: 'Harvard University',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Harvard.webp'
        },{
          name: 'Malala Yousafzai - Enseña a crear cambios',
          type: 'Certificacion',
          link: '/certificacion/masterclass/malala-yousafzai-ensena-a-crear-cambios',
          img: '/assets/universities/banners/masterclass/MalalaYousafzai.jpg'
        },{
          name: 'ArmEducation',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-ArmEducation.png'
        }
      ]
    },{
      name: 'Diseño',
      type: 'search',
      position: [{pos: 'topicText', size:'42', y:'64',x:'47'}],
      img: '/assets/category/icons/ico-diseno-t.png',
      color: '#D33B3E',
      description: 'Diseña nuevas formas de enseñar y aprender. Explora metodologías, tecnologías y enfoques que hacen de la educación una experiencia transformadora.',
      universities: [
        {
          name: 'Museum of Modern Art',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Museum-of-Modern-Art.png'
        },{
          name: 'Smithsonian',
          type: 'Empresa',
          img: '/assets/companies/icons/ico-Smithsonian.png'
        },{
          name: 'Parsons School of Design, The New School',
          type: 'Universidad',
          img: '/assets/universities/icons/ico-Parsons-School-of-Design-The-New-School.webp '
        },{
          name: 'Diseños Gráficos de Gran Impacto - David Carson',
          type: 'Certificacion',
          link: '/certificacion/masterclass/disenos-graficos-de-gran-impacto-david-carson',
          img: '/assets/universities/banners/masterclass/DavidCarson.jpg'
        },{
          name: 'Diseño y Arquitectura - Frank Gehry',
          type: 'Certificacion',
          link: '/certificacion/masterclass/diseno-y-arquitectura-frank-gehry',
          img: '/assets/universities/banners/masterclass/FrankGehry.jpg'
        }
      ]
    },{
      name: 'Ciberseguridad',
      type: 'search',
      position: [{pos: 'topicText', size:'42', y:'64',x:'47'}],
      img: '/assets/category/icons/ico-ciberseguridad-t.png',
      color: '#D33B3E',
      description: 'Diseña nuevas formas de enseñar y aprender. Explora metodologías, tecnologías y enfoques que hacen de la educación una experiencia transformadora.',
      universities: [
        {
          name: 'Escudo Digital: Ciberseguridad para Protección de Datos y Sistemas',
          type: 'Certificacion',
          link: '/certificacion/edx/anahuacx-escudo-digital-ciberseguridad-para-proteccion-de-datos-y-sistemas',
          img: '/assets/universities/icons/ico-Universidades-Anahuac.webp'
        },{
          name: 'Analista de Ciberseguridad en Microsoft',
          type: 'Certificacion',
          link: '/certificacion/coursera/analista-de-ciberseguridad-en-microsoft-certificado-profesional',
          img: '/assets/companies/icons/ico-Microsoft.png'
        },{
          name: 'Google',
          type: 'Universidad',
          img: '/assets/companies/icons/ico-Google-Cloud.png'
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
      id: 25, src:"/assets/universities/flags/BA-TE-IRVINE.webp", category:"Universidad", link: "University of California Irvine",title:"",desc:""
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
      <section className="h-[20vh] bg-gradient-to-t from-transparent to-[#0F090B] relative"></section>
      <section className="wrapper relative section z-10">
      {/* Fondo de sección 
      <Galaxy
        className="absolute inset-0 -z-10 pointer-events-none"
        transparent
        density={0.9}        // puedes bajar un poco la densidad
        hueShift={150}
        starSpeed={0.45}
        speed={1.0}
        twinkleIntensity={0.25}
        glowIntensity={0.28}
        saturation={0.05}
        mouseRepulsion={true}
        repulsionStrength={1.6}
        rotationSpeed={0.08}
        autoCenterRepulsion={0}
      />*/}

      {/* Si quieres un color base muy sutil detrás del galaxy, usa un overlay */}
      <div className="absolute inset-0 -z-20 bg-[#0F090B]/5 " />

      <div className="container m-auto px-2 lg:px-4 justify-center-safe gap-2 relative">
        <TopicGrid topics={topics} columns={5} withBackground={false} />
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
