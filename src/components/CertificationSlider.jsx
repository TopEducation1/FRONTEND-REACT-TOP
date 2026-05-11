import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import tagFilterService from "../services/filterByTagsTesting";
import CertificationsList from "../components/layoutCertifications";

const CertificationSlider = ({ certification }) => {
  const { slug: currentSlug } = useParams();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [certifications, setCertifications] = useState([]);

  const amount = 9;

  const getSkillForFilter = useCallback(() => {
    const primarySkill = certification?.primary_skill;

    if (primarySkill?.slug) {
      return {
        category: "Tema",
        value: primarySkill.slug,
      };
    }

    const firstSkill = Array.isArray(certification?.skills)
      ? certification.skills.find((skill) => skill?.slug)
      : null;

    if (firstSkill?.slug) {
      return {
        category: "Tema",
        value: firstSkill.slug,
      };
    }

    return null;
  }, [certification]);

  const relatedFilters = useMemo(() => {
    const filters = {
      idioma: ["es", "en"],
    };

    const skillFilter = getSkillForFilter();

    if (skillFilter?.value) {
      filters[skillFilter.category] = [
        {
          slug: skillFilter.value,
        },
      ];
    }

    return filters;
  }, [getSkillForFilter]);

  const scoreRelatedCertification = useCallback(
    (cert) => {
      let score = 0;

      const currentPlatform = certification?.plataforma_certificacion?.nombre;
      const currentUniversity = certification?.universidad_certificacion?.nombre;
      const currentCompany = certification?.empresa_certificacion?.nombre;

      if (
        currentUniversity &&
        cert?.universidad_certificacion?.nombre === currentUniversity
      ) {
        score += 4;
      }

      if (currentCompany && cert?.empresa_certificacion?.nombre === currentCompany) {
        score += 4;
      }

      if (
        currentPlatform &&
        cert?.plataforma_certificacion?.nombre === currentPlatform
      ) {
        score += 2;
      }

      const currentSkillSlugs = new Set(
        (certification?.skills || [])
          .map((skill) => skill?.slug)
          .filter(Boolean)
      );

      const certSkillSlugs = (cert?.skills || [])
        .map((skill) => skill?.slug)
        .filter(Boolean);

      if (certSkillSlugs.some((slug) => currentSkillSlugs.has(slug))) {
        score += 5;
      }

      return score;
    },
    [certification]
  );

  const loadRelatedCertifications = useCallback(async () => {
    if (!certification) return;

    setLoading(true);
    setError(null);

    try {
      const response = await tagFilterService.filterByTags(relatedFilters, 1, 24);
      const rows = Array.isArray(response?.results) ? response.results : [];

      const filtered = rows
        .filter((cert) => cert?.slug && cert.slug !== currentSlug)
        .sort((a, b) => scoreRelatedCertification(b) - scoreRelatedCertification(a))
        .slice(0, amount);

      setCertifications(filtered);
    } catch (error) {
      console.error("Error al cargar certificaciones relacionadas:", error);
      setError("Error loading certifications");
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  }, [certification, relatedFilters, currentSlug, scoreRelatedCertification]);

  useEffect(() => {
    loadRelatedCertifications();
  }, [loadRelatedCertifications]);

  if (error) return <div className="error-message">{error}</div>;

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full py-4">
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
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        <span className="ml-2 text-neutral-700">Cargando...</span>
      </div>
    );
  }

  if (!certifications.length) return null;

  return (
    <div className="certification-slider relative">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".boton-next-related",
          prevEl: ".boton-prev-related",
        }}
        spaceBetween={12}
        slidesPerView={3}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {certifications.map((cert) => (
          <SwiperSlide key={cert.id || cert.slug}>
            <div className="[&_.grid]:!grid-cols-1 [&_.grid]:!mt-0">
              <CertificationsList certifications={[cert]} />
            </div>
          </SwiperSlide>
        ))}

        <div className="flex justify-between mt-4 mx-3">
          <button className="boton-prev-related bg-[#F6F4EF] hover:bg-[#F6F4EF]/70 text-[#0F090B] mt-0 lg:absolute lg:top-[42%] lg:left-[-15px] z-20 text-[1.8rem] lg:text-[2rem] px-4 py-1 lg:py-2 rounded-full">
            <FaChevronLeft />
          </button>

          <button className="boton-next-related bg-[#F6F4EF] hover:bg-[#F6F4EF]/70 text-[#0F090B] mt-0 lg:absolute lg:top-[42%] lg:right-[-15px] z-20 text-[1.8rem] lg:text-[2rem] px-4 py-1 lg:py-2 rounded-full">
            <FaChevronRight />
          </button>
        </div>
      </Swiper>
    </div>
  );
};

export default CertificationSlider;