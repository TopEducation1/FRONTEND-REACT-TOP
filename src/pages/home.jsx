import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function HomePage() {
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState("");
  
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(path));
    } else {
      navigate(path);
    }
  }
  const handleStartNow = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    navigate(
      `/empieza-ahora?email=${encodeURIComponent(email.trim())}`
    );
  };
  useEffect(() => {
  let cancelled = false;

  async function loadHomeSkillsGrid() {
    try {
      setTopicsLoading(true);
      setTopicsError("");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/home/skills-grid/`, {
        headers: { Accept: "application/json" },
      });

      const text = await response.text();

      let data = [];
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Respuesta no JSON. Status ${response.status}: ${text.slice(0, 200)}`);
      }

      if (!response.ok) {
        throw new Error(data?.error || `Error HTTP ${response.status}`);
      }

      if (!cancelled) {
        setTopics(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error cargando home skills grid:", error);

      if (!cancelled) {
        setTopics([]);
        setTopicsError("No se pudieron cargar los temas.");
      }
    } finally {
      if (!cancelled) {
        setTopicsLoading(false);
      }
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
    ["#F6F4EF", "#F6F4EF", "#F6F4EF"]
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

  const topicItems = topics.filter(
    (item) => item.skill_type?.trim().toLowerCase() === "tema"
  );

  const skillItems = topics.filter(
    (item) => item.skill_type?.trim().toLowerCase() === "habilidad"
  );

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
      <style jsx>{`
        .home-swiper-prev,
        .home-swiper-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 40;

          width: 64px;
          height: 64px;
          border-radius: 9999px;

          display: flex;
          align-items: center;
          justify-content: center;

          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);

          background: rgba(255, 255, 255, 0.08);

          border: 1px solid rgba(255, 255, 255, 0.14);

          color: rgba(255, 255, 255, 0.9);

          font-size: 1.5rem;
          font-weight: 300;

          transition: all 0.35s ease;

          box-shadow:
            0 10px 40px rgba(0,0,0,0.22),
            inset 0 1px 1px rgba(255,255,255,0.06);
        }

        .home-swiper-prev:hover,
        .home-swiper-next:hover {
          transform: translateY(-50%) scale(1.06);

          background: rgba(255,255,255,0.14);

          box-shadow:
            0 18px 50px rgba(87,80,255,0.22),
            inset 0 1px 1px rgba(255,255,255,0.08);
        }

        .home-swiper-prev {
          left: 48px;
        }

        .home-swiper-next {
          right: 48px;
        }

        .home-main-swiper .swiper-pagination {
          bottom: 32px !important;
        }

        .home-main-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.3);
          opacity: 1;
          transition: all 0.3s ease;
        }

        .home-main-swiper .swiper-pagination-bullet-active {
          width: 42px;
          border-radius: 999px;
          background: #5CC781;
        }

        @media (max-width: 1024px) {
          .home-swiper-prev,
          .home-swiper-next {
            width: 52px;
            height: 52px;
            font-size: 1.2rem;
          }

          .home-swiper-prev {
            left: 16px;
          }

          .home-swiper-next {
            right: 16px;
          }
        }
      `}</style>
      <FinisherHeaderComponent />

      <section className="relative py-12 lg:py-20 overflow-hidden bg-gradient-to-b from-transparent via-[#F5F3EE] to-[#F5F3EE] -mt-20 !z-5">
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="uppercase tracking-[0.35em] text-[11px] text-[#7B6E63] font-medium">
              Explora
            </span>

            <h2 className="mt-3 text-[#0F090B] font-light leading-none text-[2.5rem] md:text-[3.8rem] lg:text-[4.2rem] font-te">
              ¿Qué quieres aprender hoy?
            </h2>

            <p className="mt-3 max-w-2xl mx-auto text-[#6D6258] text-[1rem] md:text-[1.2rem] leading-[1.3em]">
              Haz clic en una categoría para explorar las instituciones que ofrecen certificaciones
            </p>
          </div>

          <div className="relative">
            <TopicGrid topics={topicItems} columns={5} />
          </div>

          <div className="flex justify-center mt-14">
            <button
              type="button"
              onClick={() => navigateWithTransition("/explora")}
              className="group inline-flex items-center gap-3 text-[#0F090B] transition-all duration-300 hover:text-[#1941cf]"
            >
              <span className="text-[1rem] font-medium">Ver todas las categorías</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={16} strokeWidth={2} className="translate-y-[1px]" />
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="wrapper w-screen bg-[#F5F3EE] relative flex-shrink-0 flex items-center justify-center">
        <div className="container m-auto py-20 max-w-[90vw] text-center">
          <div className="mx-auto max-w-[920px] text-center">
            <span className="uppercase tracking-[0.35em] text-[11px] text-[#7B6E63] font-medium">
              Universidades líderes
            </span>

            <h2 className="mt-3 text-[#0F090B] font-light leading-none
                text-[2.5rem] md:text-[3.8rem] lg:text-[4.2rem]
                font-te">
              Aprende con las universidades<br></br> líderes del mundo
            </h2>

            <p className="mt-3 max-w-3xl mx-auto text-[#6D6258] text-[1rem] md:text-[1.2rem] leading-[1.3em]">
              Explora certificaciones creadas por instituciones reconocidas
              globalmente y encuentra nuevas rutas para tu crecimiento profesional.
            </p>
          </div>
          <ImageSlider3D images={flagsImages} action="explora" />
        </div>
      </section>

      <section className="relative py-12 lg:py-20 overflow-hidden bg-[#F5F3EE] !z-5">
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="uppercase tracking-[0.35em] text-[11px] text-[#7B6E63] font-medium">
              Top habilidades
            </span>

            <h2 className="mt-3 text-[#0F090B] font-light leading-none text-[2.5rem] md:text-[3.8rem] lg:text-[4.2rem] font-te">
              Habilidades que impulsan tu futuro
            </h2>

            <p className="mt-3 max-w-2xl mx-auto text-[#6D6258] text-[1rem] md:text-[1.2rem] leading-[1.3em]">
              Explora las habilidades más relevantes para crecer profesionalmente y encuentra certificaciones alineadas con tus objetivos.
            </p>
          </div>

          <div className="relative">
            <TopicGrid topics={skillItems} columns={5} />
          </div>

          <div className="flex justify-center mt-14">
            <button
              type="button"
              onClick={() => navigateWithTransition("/explora")}
              className="group inline-flex items-center gap-3 text-[#0F090B] transition-all duration-300 hover:text-[#1941cf]"
            >
              <span className="text-[1rem] font-medium">Ver todas las habilidades</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={16} strokeWidth={2} className="translate-y-[1px]" />
              </span>
            </button>
          </div>
        </div>
      </section>
              
      <section className="w-screen h-full flex-shrink-0 bg-[#0F090B]">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: ".home-swiper-next",
            prevEl: ".home-swiper-prev",
          }}
          pagination={{
            clickable: true,
          }}
          spaceBetween={0}
          slidesPerView={1}
          preventClicks={false}
          preventClicksPropagation={false}
          noSwiping={true}
          noSwipingSelector=".flags-no-swiping"
          className="home-main-swiper w-full h-full"
        >
          <button className="home-swiper-prev">
            <FaChevronLeft />
          </button>

          <button className="home-swiper-next">
            <FaChevronRight />
          </button>
          {/* Slide 1 */}
          <SwiperSlide>
            <PlatformsSelector platforms={platforms} />
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <Flags logos={logos} />
          </SwiperSlide>
        </Swiper>
      </section>

      <section className="w-screen bg-[#F6F4EF] relative flex-shrink-0 flex items-center justify-center">
        <div className="container m-auto">
          <HeroSlider />
        </div>
      </section>
      <section className="bg-[#F5F3EE] px-4 py-16 md:py-24">
        <div className="mx-auto max-w-[920px]">
          <div className="relative overflow-hidden rounded-[28px] bg-[#1941cf] px-6 py-16 text-center shadow-[0_28px_80px_rgba(87,80,255,0.22)] md:rounded-[32px] md:px-12 md:py-15">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_45%,rgba(0,0,0,0.08)_100%)]" />

            <div className="relative z-10 mx-auto max-w-[850px]">
              <h2 className="font-te text-[2.5rem] !font-['Montserrat'] font-medium leading-[1.08em] text-white md:text-[2.8rem] " >
                Descubre tu ruta de aprendizaje
              </h2>

              <p className="mx-auto max-w-[760px] font-['Montserrat'] text-[1rem] font-medium leading-[1.7em] text-white/80 md:text-[1.15rem] ">
                Únete a miles de personas que ya aprenden con los mejores del mundo.
              </p>
              <form
                /*onSubmit={handleStartNow}*/
                className="mx-auto mt-10 flex w-full max-w-[620px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  className="h-[56px] w-full rounded-full border border-white/20 bg-white px-6 font-['Montserrat'] text-[15px] text-neutral-800 outline-none placeholder:text-neutral-400 focus:ring-4 focus:ring-white/20 sm:flex-1"
                  required
                />

                <button
                  type="submit"
                  className="h-[56px] rounded-full bg-[#0F090D] px-8 font-['Montserrat'] text-[15px] font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-[0_18px_45px_rgba(0,0,0,0.22)] sm:w-auto"
                >
                  Empieza ahora
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;