import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import TopicSelector from "../components/TopicSelector";
import PlatformsSelector from "../components/PlatformsSelector";
import HorizontalScroll from "../components/HorizontalScroll";
import Flags from "../components/Flags";
import ImageSlider3D from "../components/ImageSlider3D";
import HeroSlider from "../components/HeroSlider";
import FinisherHeaderComponent from "../components/FinisherHeaderComponent";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import TopicGrid from "../components/TopicGrid";
import endpoints from "../config/api";

function HomePage() {
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState("");
  useEffect(() => {
  let cancelled = false;

  async function loadHomeSkillsGrid() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/home/skills-grid/`);
      const data = await response.json();

      console.log("data:", data);

      if (!cancelled) {
        setTopics(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
    }
  }

  loadHomeSkillsGrid();

  return () => {
    cancelled = true;
  };
}, []);

  const platforms = [
    {
      name: "EdX",
      type: "Plataforma",
      img: "assets/platforms/icons/icon-edx.png",
      description:
        "Accede a educación universitaria de prestigio global, con certificaciones reconocidas y flexibilidad para aprender a tu ritmo.",
      universities: [
        {
          name: "Harvard University",
          type: "Universidad",
          img: "/assets/universities/icons/ico-Harvard.webp",
        },
        {
          name: "Stanford University",
          type: "Universidad",
          img: "/assets/universities/icons/ico-Stanford-University.webp",
        },
        {
          name: "Columbia University",
          type: "Universidad",
          img: "/assets/universities/icons/ico-Columbia-University.webp",
        },
        {
          name: "IBM",
          type: "Empresa",
          img: "/assets/companies/icons/ico-IBM.png",
        },
        {
          name: "Microsoft",
          type: "Empresa",
          img: "/assets/companies/icons/ico-Microsoft.png",
        },
        {
          name: "Google",
          type: "Universidad",
          img: "/assets/companies/icons/ico-Google-Cloud.png",
        },
      ],
    },
    {
      name: "Coursera",
      img: "/assets/platforms/icons/icon-coursera.png",
      type: "Plataforma",
      description:
        "Aprende habilidades prácticas con expertos de universidades y empresas líderes. Certificaciones para avanzar profesionalmente desde casa",
      universities: [
        {
          name: "Yale University",
          type: "Universidad",
          img: "assets/universities/icons/ico-Yale-University.webp",
        },
        {
          name: "University of Michigan",
          type: "Universidad",
          img: "assets/universities/icons/ico-University-of-Michigan.webp",
        },
        {
          name: "University of Illinois Urbana Champaign",
          type: "Universidad",
          img: "assets/universities/icons/ico-University-of-Illinois-Urbana-Champaign.webp",
        },
      ],
    },
    {
      name: "MasterClass",
      type: "Plataforma",
      img: "/assets/platforms/icons/icon-masterclass.png",
      description:
        "Inspiración y técnicas exclusivas de íconos mundiales. Aprende directamente de los mejores en su campo.",
      universities: [
        {
          name: "Bienestar",
          type: "Habilidad",
          img: "/assets/category/ability/ico-Bienestar.png",
        },
        {
          name: "Estrategia",
          type: "Habilidad",
          img: "/assets/category/ability/ico-Estrategia.png",
        },
        {
          name: "Liderazgo",
          type: "Habilidad",
          img: "/assets/category/ability/ico-Liderazgo.png",
        },
        {
          name: "Personas y cultura",
          type: "Habilidad",
          img: "/assets/category/ability/ico-Personas-y-cultura.png",
        },
        {
          name: "Comunicación",
          type: "Habilidad",
          img: "/assets/category/ability/ico-Comunicacion.png",
        },
      ],
    },
  ];

  const flagsImages = [
    {
      id: 1,
      src: "/assets/universities/flags/BA-TE-HARVARD.webp",
      category: "Universidad",
      link: "Harvard University",
      title: "",
      desc: "",
    },
    {
      id: 2,
      src: "/assets/universities/flags/BA-TE-NACIONAL.webp",
      category: "Universidad",
      link: "Universidad Nacional de Colombia",
      title: "",
      desc: "",
    },
    {
      id: 3,
      src: "/assets/universities/flags/BA-TE-TORONTO.webp",
      category: "Universidad",
      link: "University of Toronto",
      title: "",
      desc: "",
    },
    {
      id: 4,
      src: "/assets/universities/flags/BA-TE-ANDES.webp",
      category: "Universidad",
      link: "Universidad de los Andes",
      title: "",
      desc: "",
    },
    {
      id: 5,
      src: "/assets/universities/flags/BA-TE-YALE.webp",
      category: "Universidad",
      link: "Yale University",
      title: "",
      desc: "",
    },
    {
      id: 6,
      src: "/assets/universities/flags/BA-TE-PUCP.webp",
      category: "Universidad",
      link: "Pontificia Universidad Catolica de Peru",
      title: "",
      desc: "",
    },
    {
      id: 7,
      src: "/assets/universities/flags/BA-TE-STANFORD.webp",
      category: "Universidad",
      link: "Stanford University",
      title: "",
      desc: "",
    },
    {
      id: 8,
      src: "/assets/universities/flags/BA-TE-AUSTRAL.webp",
      category: "Universidad",
      link: "Universidad Austral",
      title: "",
      desc: "",
    },
    {
      id: 9,
      src: "/assets/universities/flags/BA-TE-MICHIGAN.webp",
      category: "Universidad",
      link: "University of Michigan",
      title: "",
      desc: "",
    },
    {
      id: 10,
      src: "/assets/universities/flags/BA-TE-PEKING.webp",
      category: "Universidad",
      link: "Peking University",
      title: "",
      desc: "",
    },
    {
      id: 11,
      src: "/assets/universities/flags/BA-TE-NEW-MEXICO.webp",
      category: "Universidad",
      link: "University of New Mexico",
      title: "",
      desc: "",
    },
    {
      id: 12,
      src: "/assets/universities/flags/BA-TE-ANAHUAC.webp",
      category: "Universidad",
      link: "Universidad Anáhuac",
      title: "",
      desc: "",
    },
    {
      id: 13,
      src: "/assets/universities/flags/BA-TE-COLUMBIA.webp",
      category: "Universidad",
      link: "Columbia University",
      title: "",
      desc: "",
    },
    {
      id: 14,
      src: "/assets/universities/flags/BA-TE-CATOLICA-CHILE.webp",
      category: "Universidad",
      link: "Pontificia Universidad Catolica de Chile",
      title: "",
      desc: "",
    },
    {
      id: 15,
      src: "/assets/universities/flags/BA-TE-ILLINOIS.webp",
      category: "Universidad",
      link: "University of Illinois Urbana-Champaign",
      title: "",
      desc: "",
    },
    {
      id: 16,
      src: "/assets/universities/flags/BA-TE-MONTERREY.webp",
      category: "Universidad",
      link: "Tecnológico de Monterrey",
      title: "",
      desc: "",
    },
    {
      id: 17,
      src: "/assets/universities/flags/BA-TE-VIRGINIA.webp",
      category: "Universidad",
      link: "University of Virginia",
      title: "",
      desc: "",
    },
    {
      id: 18,
      src: "/assets/universities/flags/BA-TE-AUTONOMA-MEXICO.webp",
      category: "Universidad",
      link: "UNAM",
      title: "",
      desc: "",
    },
    {
      id: 19,
      src: "/assets/universities/flags/BA-TE-NORTH-CAROLINA.webp",
      category: "Universidad",
      link: "The University of North Carolina at Chapel Hill",
      title: "",
      desc: "",
    },
    {
      id: 20,
      src: "/assets/universities/flags/BA-TE-SEA.webp",
      category: "Universidad",
      link: "SAE-México",
      title: "",
      desc: "",
    },
    {
      id: 21,
      src: "/assets/universities/flags/BA-TE-CHICAGO.webp",
      category: "Universidad",
      link: "The University of Chicago",
      title: "",
      desc: "",
    },
    {
      id: 22,
      src: "/assets/universities/flags/BA-TE-BERKLEE.webp",
      category: "Universidad",
      link: "Berklee College of Music",
      title: "",
      desc: "",
    },
    {
      id: 23,
      src: "/assets/universities/flags/BA-TE-PARSONS.webp",
      category: "Universidad",
      link: "Parsons School of Design, The New School",
      title: "",
      desc: "",
    },
    {
      id: 24,
      src: "/assets/universities/flags/BA-TE-COLORADO.webp",
      category: "Universidad",
      link: "University of Colorado Boulder",
      title: "",
      desc: "",
    },
    {
      id: 25,
      src: "/assets/universities/flags/BA-TE-IRVINE.webp",
      category: "Universidad",
      link: "University of California Irvine",
      title: "",
      desc: "",
    },
    {
      id: 26,
      src: "/assets/universities/flags/BA-TE-NORTHWESTERN.webp",
      category: "Universidad",
      link: "Northwestern University",
      title: "",
      desc: "",
    },
  ];

  const [logos, setLogos] = useState([]);

  useEffect(() => {
    fetch(endpoints.empresas)
      .then((res) => res.json())
      .then((data) => setLogos(data.filter((t) => t.empr_est === "enabled")))
      .catch((err) => console.error("Error:", err));
  }, []);

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const zoomRef = useRef(null);

  const { scrollYProgress: zoomScrollY } = useScroll({
    target: zoomRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(zoomScrollY, [0, 0.5, 1], [0.5, 1.2, 0.4]);
  const springScale = useSpring(scale, { stiffness: 100, damping: 20 });

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
        <meta
          property="og:title"
          content="Top Education | Aprende con edX, Coursera y MasterClass"
        />
        <meta name="author" content="Top Education" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <FinisherHeaderComponent className="sect-1" />

      <section className="h-[20vh] bg-gradient-to-t from-[#0F090B] to-transparent relative"></section>
      <section className="h-[20vh] bg-gradient-to-t from-transparent to-[#0F090B] relative"></section>

      <section className="wrapper relative section z-10">
        <div className="absolute inset-0 -z-20 bg-[#0F090B]/5 " />

        <div className="container m-auto px-2 lg:px-4 justify-center-safe gap-2 relative">
          <TopicGrid topics={topics} columns={5} withBackground={false} />
        </div>
      </section>

      <section className="wrapper w-screen h-full bg-[#0F090B] relative flex-shrink-0 flex items-center justify-center">
        <div className="container m-auto py-30 max-w-[90vw] text-center">
          <h2 className="text-white text-4xl lg:text-6xl font-normal top-italic leading-[1.2em] mb-5">
            Aprende con las universidades <br />
            líderes del mundo
          </h2>
          <ImageSlider3D images={flagsImages} action="explora" />
        </div>
      </section>

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
          <HeroSlider />
        </div>
      </section>
    </>
  );
}

export default HomePage;