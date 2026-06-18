import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import CertificationsList from "../components/layoutCertifications";
import relatedCertificationsFetcher from "../services/relatedCertificationsFetcher";

const RelatedSliderSkeleton = () => (
  <div className="grid grid-cols-1 gap-2 md:grid-cols-3 mt-2">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-[18px] border border-black/10 bg-white"
      >
        <div className="h-[130px] animate-pulse bg-neutral-200" />

        <div className="space-y-2 px-4 py-3">
          <div className="h-4 w-[90px] animate-pulse rounded-full bg-neutral-200" />
          <div className="h-5 w-[85%] animate-pulse rounded-full bg-neutral-200" />

          <div className="mt-3 flex items-center justify-between">
            <div className="h-8 w-[90px] animate-pulse rounded-full bg-neutral-200" />
            <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-200" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const CertificationSlider = () => {
  const { slug: currentSlug } = useParams();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [certifications, setCertifications] = useState([]);

  const amount = 9;

  const loadRelatedCertifications = useCallback(async () => {
    if (!currentSlug) return;

    setLoading(true);
    setError(null);

    try {
      const data =
        await relatedCertificationsFetcher.getRelatedCertifications(
          currentSlug,
          amount
        );

      setCertifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar certificaciones relacionadas:", error);
      setError("Error loading certifications");
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  }, [currentSlug]);

  useEffect(() => {
    loadRelatedCertifications();
  }, [loadRelatedCertifications]);

  if (error) return null;

  return (
    <div className="relative w-full max-w-full px-2">
      {loading ? (
        <RelatedSliderSkeleton />
      ) : certifications.length > 0 ? (
        <>
          <button
            className="boton-prev-related absolute left-[-18px] top-1/2 z-20 hidden h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition hover:scale-105 hover:bg-black hover:text-white lg:flex"
            aria-label="Anterior"
          >
            <FaChevronLeft />
          </button>

          <button
            className="boton-next-related absolute right-[-18px] top-1/2 z-20 hidden h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition hover:scale-105 hover:bg-black hover:text-white lg:flex"
            aria-label="Siguiente"
          >
            <FaChevronRight />
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".boton-next-related",
              prevEl: ".boton-prev-related",
            }}
            spaceBetween={18}
            slidesPerView={2}
            breakpoints={{
              0: { slidesPerView: 1.05 },
              640: { slidesPerView: 1.2 },
              768: { slidesPerView: 1.6 },
              1024: { slidesPerView: 2 },
              1280: { slidesPerView: 2.35 },
            }}
            className="!overflow-visible [clip-path:inset(-40px_0_-40px_0)]"
          >
            {certifications.map((cert) => (
              <SwiperSlide key={cert.id || cert.slug} className="py-3">
                <div className="[&_.grid]:!mt-0 [&_.grid]:!grid-cols-1">
                  <CertificationsList certifications={[cert]} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
            <button
              className="boton-prev-related flex h-[46px] w-[46px] items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
              aria-label="Anterior"
            >
              <FaChevronLeft />
            </button>

            <button
              className="boton-next-related flex h-[46px] w-[46px] items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
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