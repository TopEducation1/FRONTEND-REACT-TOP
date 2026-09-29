import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import { useParams } from "react-router-dom";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";

import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import CertificationsList from "../components/layoutCertifications";

import relatedCertificationsFetcher from "../services/relatedCertificationsFetcher";


const RelatedSliderSkeleton = () => (
  <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
    {Array.from({
      length: 3,
    }).map((_, index) => (
      <div
        key={index}
        className="
          overflow-hidden
          rounded-[18px]
          border
          border-black/10
          bg-white
        "
      >
        <div
          className="
            h-[130px]
            animate-pulse
            bg-neutral-200
          "
        />

        <div className="space-y-2 px-4 py-3">
          <div
            className="
              h-4
              w-[90px]
              animate-pulse
              rounded-full
              bg-neutral-200
            "
          />

          <div
            className="
              h-5
              w-[85%]
              animate-pulse
              rounded-full
              bg-neutral-200
            "
          />

          <div className="mt-3 flex items-center justify-between">
            <div
              className="
                h-8
                w-[90px]
                animate-pulse
                rounded-full
                bg-neutral-200
              "
            />

            <div
              className="
                h-9
                w-9
                animate-pulse
                rounded-full
                bg-neutral-200
              "
            />
          </div>
        </div>
      </div>
    ))}
  </div>
);


const CertificationSlider = ({
  slug: slugProp,
}) => {

  const {
    slug: routeSlug,
  } = useParams();

  /*
   * Podemos recibir el slug directamente desde CertificationPage.
   * Si no viene, usamos el de la URL.
   */
  const currentSlug =
    slugProp || routeSlug;

  const [
    certifications,
    setCertifications,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(null);

  /*
   * Evita que una respuesta vieja modifique el estado
   * si el usuario navega rápidamente entre certificaciones.
   */
  const requestVersionRef =
    useRef(0);

  /*
   * Botones reales de navegación Swiper.
   *
   * Esto evita usar la misma clase CSS para los
   * botones desktop y mobile.
   */
  const desktopPrevRef =
    useRef(null);

  const desktopNextRef =
    useRef(null);

  const mobilePrevRef =
    useRef(null);

  const mobileNextRef =
    useRef(null);

  const amount = 9;


  useEffect(() => {

    if (!currentSlug) {
      setCertifications([]);
      setLoading(false);
      return;
    }

    const requestVersion =
      ++requestVersionRef.current;

    let active = true;

    const loadRelated = async () => {

      setLoading(true);
      setError(null);

      /*
       * Al cambiar de certificación eliminamos
       * inmediatamente las cards anteriores.
       */
      setCertifications([]);

      try {

        const data =
          await relatedCertificationsFetcher
            .getRelatedCertifications(
              currentSlug,
              amount
            );

        /*
         * Si entretanto el usuario navegó a otra
         * certificación, ignoramos esta respuesta.
         */
        if (
          !active ||
          requestVersion !==
            requestVersionRef.current
        ) {
          return;
        }

        setCertifications(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (loadError) {

        if (
          !active ||
          requestVersion !==
            requestVersionRef.current
        ) {
          return;
        }

        console.error(
          "Error al cargar certificaciones relacionadas:",
          loadError
        );

        setError(
          loadError?.message ||
            "Error loading certifications"
        );

        setCertifications([]);

      } finally {

        if (
          active &&
          requestVersion ===
            requestVersionRef.current
        ) {
          setLoading(false);
        }
      }
    };

    loadRelated();

    return () => {

      /*
       * No abortamos el fetch aquí.
       *
       * El service se encarga de deduplicar la petición.
       * Esto es importante para React StrictMode:
       *
       * mount 1 → request
       * cleanup
       * mount 2 → reutiliza la misma Promise
       *
       * Resultado:
       * UNA petición HTTP real.
       */
      active = false;
    };

  }, [
    currentSlug,
  ]);


  if (error) {
    return null;
  }


  return (
    <div
      className="
        relative
        w-full
        max-w-full
        px-2
      "
    >

      {loading ? (

        <RelatedSliderSkeleton />

      ) : certifications.length > 0 ? (

        <>

          {/* ================================================= */}
          {/* DESKTOP NAVIGATION */}
          {/* ================================================= */}

          <button
            ref={desktopPrevRef}
            type="button"
            className="
              absolute
              left-[-18px]
              top-1/2
              z-20
              hidden
              h-[52px]
              w-[52px]
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-black/10
              bg-white
              text-neutral-700
              shadow-[0_12px_35px_rgba(0,0,0,0.08)]
              transition
              hover:scale-105
              hover:bg-black
              hover:text-white
              lg:flex
            "
            aria-label="Anterior"
          >
            <FaChevronLeft />
          </button>


          <button
            ref={desktopNextRef}
            type="button"
            className="
              absolute
              right-[-18px]
              top-1/2
              z-20
              hidden
              h-[52px]
              w-[52px]
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-black/10
              bg-white
              text-neutral-700
              shadow-[0_12px_35px_rgba(0,0,0,0.08)]
              transition
              hover:scale-105
              hover:bg-black
              hover:text-white
              lg:flex
            "
            aria-label="Siguiente"
          >
            <FaChevronRight />
          </button>


          {/* ================================================= */}
          {/* SWIPER */}
          {/* ================================================= */}

          <Swiper

            modules={[
              Navigation,
            ]}

            /*
             * Inicializamos Navigation manualmente usando refs.
             */
            onBeforeInit={(swiper) => {

              swiper.params.navigation.prevEl =
                desktopPrevRef.current;

              swiper.params.navigation.nextEl =
                desktopNextRef.current;
            }}

            onSwiper={(swiper) => {

              /*
               * Los controles mobile se conectan después
               * del montaje.
               */

              setTimeout(() => {

                if (
                  !swiper ||
                  swiper.destroyed
                ) {
                  return;
                }

                const prevElements = [
                  desktopPrevRef.current,
                  mobilePrevRef.current,
                ].filter(Boolean);

                const nextElements = [
                  desktopNextRef.current,
                  mobileNextRef.current,
                ].filter(Boolean);

                swiper.params.navigation.prevEl =
                  prevElements;

                swiper.params.navigation.nextEl =
                  nextElements;

                swiper.navigation.destroy();
                swiper.navigation.init();
                swiper.navigation.update();

              }, 0);
            }}

            spaceBetween={18}

            slidesPerView={2}

            breakpoints={{
              0: {
                slidesPerView: 1.05,
                spaceBetween: 12,
              },

              640: {
                slidesPerView: 1.2,
                spaceBetween: 14,
              },

              768: {
                slidesPerView: 1.6,
                spaceBetween: 16,
              },

              1024: {
                slidesPerView: 2,
                spaceBetween: 18,
              },

              1280: {
                slidesPerView: 2.35,
                spaceBetween: 18,
              },
            }}

            className="
              !overflow-visible
              [clip-path:inset(-40px_0_-40px_0)]
            "
          >

            {certifications.map(
              (cert) => (

                <SwiperSlide
                  key={
                    cert.id ||
                    cert.slug
                  }
                  className="py-3"
                >
                  <div
                    className="
                      [&_.grid]:!mt-0
                      [&_.grid]:!grid-cols-1
                    "
                  >
                    <CertificationsList
                      certifications={[
                        cert,
                      ]}
                    />
                  </div>
                </SwiperSlide>

              )
            )}

          </Swiper>


          {/* ================================================= */}
          {/* MOBILE NAVIGATION */}
          {/* ================================================= */}

          <div
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-3
              lg:hidden
            "
          >

            <button
              ref={mobilePrevRef}
              type="button"
              className="
                flex
                h-[46px]
                w-[46px]
                items-center
                justify-center
                rounded-full
                border
                border-black/10
                bg-white
                text-neutral-700
                shadow-[0_10px_25px_rgba(0,0,0,0.06)]
                transition
                active:scale-95
              "
              aria-label="Anterior"
            >
              <FaChevronLeft />
            </button>


            <button
              ref={mobileNextRef}
              type="button"
              className="
                flex
                h-[46px]
                w-[46px]
                items-center
                justify-center
                rounded-full
                border
                border-black/10
                bg-white
                text-neutral-700
                shadow-[0_10px_25px_rgba(0,0,0,0.06)]
                transition
                active:scale-95
              "
              aria-label="Siguiente"
            >
              <FaChevronRight />
            </button>

          </div>

        </>

      ) : null}

    </div>
  );
};


export default CertificationSlider;