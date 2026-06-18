import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import suggestedCertificationsFetcher from "../services/suggestedCertificationsFetcher";
import CertificationsList from "./layoutCertifications";

const SuggestedCardSkeleton = () => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-[18px] border border-black/10 bg-white"
      >
        <div className="h-[140px] animate-pulse bg-neutral-200" />

        <div className="space-y-2 px-4 py-3">
          <div className="h-4 w-[90px] animate-pulse rounded-full bg-neutral-200" />
          <div className="h-5 w-[85%] animate-pulse rounded-full bg-neutral-200" />

          <div className="mt-4 flex items-center justify-between">
            <div className="h-8 w-[90px] animate-pulse rounded-full bg-neutral-200" />
            <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-200" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SuggestedCertifications = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [certifications, setCertifications] = useState([]);

  const amount = 9;

  const loadSuggestedCertifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchData =
        await suggestedCertificationsFetcher.getSuggestedCertifications(amount);

      setCertifications(Array.isArray(fetchData) ? fetchData : []);
    } catch (error) {
      console.error("Error loading suggested certifications:", error);
      setError("Error loading certifications");
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSuggestedCertifications();
  }, [loadSuggestedCertifications]);

  const shuffledCertifications = useMemo(() => {
    return [...certifications].sort(() => Math.random() - 0.5);
  }, [certifications]);

  if (error) return null;

  return (
    <div className="relative w-full max-w-full px-2">
      {loading ? (
        <SuggestedCardSkeleton />
      ) : shuffledCertifications.length > 0 ? (
        <>
          <button
            className="boton-prev-suggested absolute left-[-18px] top-1/2 z-20 hidden h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition hover:scale-105 hover:bg-black hover:text-white lg:flex"
            aria-label="Anterior"
          >
            <FaChevronLeft />
          </button>

          <button
            className="boton-next-suggested absolute right-[-18px] top-1/2 z-20 hidden h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition hover:scale-105 hover:bg-black hover:text-white lg:flex"
            aria-label="Siguiente"
          >
            <FaChevronRight />
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".boton-next-suggested",
              prevEl: ".boton-prev-suggested",
            }}
            spaceBetween={18}
            slidesPerView={4}
            breakpoints={{
              0: { slidesPerView: 1.05 },
              640: { slidesPerView: 1.2 },
              768: { slidesPerView: 1.6 },
              1024: { slidesPerView: 2.4 },
              1280: { slidesPerView: 4 },
            }}
            className="!overflow-visible [clip-path:inset(-40px_0_-40px_0)]"
          >
            {shuffledCertifications.map((certification) => (
              <SwiperSlide
                key={certification.id || certification.slug}
                className="py-3"
              >
                <div className="[&_.grid]:!mt-0 [&_.grid]:!grid-cols-1">
                  <CertificationsList certifications={[certification]} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
            <button className="boton-prev-suggested flex h-[46px] w-[46px] items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
              <FaChevronLeft />
            </button>

            <button className="boton-next-suggested flex h-[46px] w-[46px] items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
              <FaChevronRight />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SuggestedCertifications;