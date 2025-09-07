import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import endpoints from '../config/api'; // Ajusta la ruta según tu proyecto
// Importaciones necesarias
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

// Importa Navigation desde el path correcto
import { Navigation } from "swiper/modules";

export default function RankingPage() {
    const { slug } = useParams();
    const [ranking, setRanking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTags, setSelectedTags] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        window.scrollTo(0,0);
    }, []);
    useEffect(() => {
        const fetchRanking = async () => {
        try {
            const res = await axios.get(
            endpoints.ranking_detail(encodeURIComponent(slug)) // 👈 protege caracteres especiales
            );
            setRanking(res.data);
        } catch (err) {
            console.error("Error al cargar ranking:", err);
            setError("No se pudo cargar el ranking.");
        } finally {
            setLoading(false);
        }
        };

        fetchRanking();
    }, [slug]);

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(path);
      });
    } else {
      navigate(path);
    }
  }

  const handleItemMenuClick = (tagsObject) => {
    setSelectedTags((prevTags) => {
      const updatedTags = { ...prevTags };
      for (const [category, tag] of Object.entries(tagsObject)) {
        if (!updatedTags[category]) {
          updatedTags[category] = [tag];
        } else if (!updatedTags[category].includes(tag)) {
          updatedTags[category].push(tag);
        }
      }
      const queryParams = new URLSearchParams();
      for (const [cat, tags] of Object.entries(updatedTags)) {
        tags.forEach((tag) => queryParams.append(cat, tag));
      }
      navigateWithTransition(`/explora/filter?${queryParams.toString()}`, {
        replace: true,
        state: { selectedTags: updatedTags },
      });
      return updatedTags;
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[100vh] w-full py-4">
        <svg
            className="animate-spin h-6 w-6 text-neutral-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            ></circle>
            <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
            ></path>
        </svg>
        <span className="ml-2 text-neutral-700">Cargando...</span>
    </div>);
  if (error) return <p className="text-white my-30 text-center">{error}</p>;
  if (!ranking) return <p className="text-white my-30">No se encontró el ranking.</p>;

  return (
    <section className="wrapper">
        <div className="container m-auto pt-30">
            <h1 className="text-5xl text-center text-[#F6F4EF] mb-6">{ranking.nombre}</h1>
            <p className="text-[#F6F4EF] text-center pb-5">{ranking.descripcion}</p>
            {/*<div className="flex text-[#F6F4EF] w-full justify-center text-center">Fecha: {new Date(ranking.fecha).toLocaleDateString()} | Tipo: {ranking.tipo}</div>*/}

      {ranking.entradas?.length > 0 ? (
        <ul>
          {ranking.entradas.map((entry) => (
            <li className="p-4 flex flex-wrap items-center justify-center lg:justify-start bg-[#1B1B1B] rounded-xl mb-4 relative" key={entry.id}>
              <div className=" w-full lg:w-[10%]">
                <img src={entry.universidad?.univ_ico || entry.empresa?.empr_ico} className="w-[120px] h-[120px] mx-auto mb-5 lg:mb-0 lg:w-[80px] lg:h-[80px] lg:ml-[35px] object-contain rounded-xl relative z-10" alt=""
                  onClick={() =>
                    handleItemMenuClick({
                    [ranking.tipo ? ranking.tipo.charAt(0).toUpperCase() + ranking.tipo.slice(1) : '']: entry.universidad?.nombre || entry.empresa?.nombre,
                    })
                  } 
                />
                <strong className="bg-[#F6F4EF] text-black flex items-center rounded-[25px] lg:rounded-[25px_0px_0px_25px] w-auto !py-[3px] px-3 sm:pr-7 !lg:w-[60px] !lg:h-[60px] absolute top-[125px] lg:top-[30%] left-[50%] transform -translate-x-1/2 lg:translate-x-0 lg:left-2 z-11 lg:z-0 text-[0.9rem] lg:text-[1.5rem]"><span className="block text-[0.9rem] mr-2 lg:hidden">Rank</span>{entry.posicion}</strong>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start w-[100%] lg:w-[35%]" 
                onClick={() =>
                  handleItemMenuClick({
                  [ranking.tipo ? ranking.tipo.charAt(0).toUpperCase() + ranking.tipo.slice(1) : '']: entry.universidad?.nombre || entry.empresa?.nombre,
                  })
                }>
                  <div className="w-full flex flex-wrap justify-center lg:justify-start lg:block">
                      <h2 className="text-[1.5rem] lg:text-[1.8rem] w-full font-semibold text-white text-center lg:text-left leading-[1.1em] mb-2">{entry.universidad?.nombre || entry.empresa?.nombre}</h2>
                      <span className="inline-flex items-center rounded-full bg-[#F6F4EF] px-2 py-[2px] text-[.8rem] font-medium text-[#0F090B] ">{entry.total_certificaciones} Certificaciones</span>  
                  </div>
              </div>
              <div className="w-full mt-10 lg:mt-0 lg:w-[55%] flex !items-center relative">
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    nextEl: `.boton-next-${entry.id}`,
                    prevEl: `.boton-prev-${entry.id}`,
                  }}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  spaceBetween={5}
                  slidesPerView="auto"
                  grabCursor={true}
                >
                  {entry.temas_certificaciones?.map((tema) => (
                  <SwiperSlide
                    key={tema.id}
                    style={{ width: "230px" }}
                    className="!flex !items-center !min-h-[70px]"
                    onClick={() =>
                      handleItemMenuClick({
                      [tema.tema_certificacion__tem_type]: tema.tema_certificacion__nombre,
                      [ranking.tipo ? ranking.tipo.charAt(0).toUpperCase() + ranking.tipo.slice(1) : '']: entry.universidad?.nombre || entry.empresa?.nombre,
                      })
                    }
                  >
                    <div className="flex items-center px-2 gap-2">
                      <img
                        src={tema.tema_certificacion__tem_img}
                        alt={tema.tema_certificacion__nombre}
                        className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] block object-contain"
                      />
                      <div className="w-[80%]">
                        <span className="text-[#F6F4EF] text-[0.9rem] block w-full !leading-[1.1em]">{tema.tema_certificacion__nombre}</span>
                        <span className="mt-1 inline-flex items-center rounded-full bg-[#F6F4EF] px-2 py-[2px] text-[.75rem] font-medium text-[#0F090B]">
                        {tema.total_certificaciones} certificaciones
                        </span>
                      </div> 
                    </div>
                  </SwiperSlide>
                  ))}
                </Swiper>
                <div className="flex justify-between mt-2 absolute gap-1 top-[-30px] lg:top-[-35px] right-[50%] lg:right-1 transform translate-x-1/2 lg:translate-x-0 ">
                  <button className={`boton-prev-${entry.id} bg-[#F6F4EF] hover:bg-[#F6F4EF]/70 text-[0.8rem] px-3 py-1 rounded-xl`}><FaAngleLeft /></button>
                  <button className={`boton-next-${entry.id} bg-[#F6F4EF] hover:bg-[#F6F4EF]/70  text-[0.8rem] px-3 py-1 rounded-xl`}><FaAngleRight /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay entradas en este ranking.</p>
      )}
      </div>
    </section>
  );
}
