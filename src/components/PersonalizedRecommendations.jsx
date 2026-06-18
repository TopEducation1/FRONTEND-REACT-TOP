import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import recommendationsFetcher from "../services/recommendationsFetcher";

const RecommendationsSkeleton = () => (
  <div className="space-y-5">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="flex min-h-[120px] animate-pulse items-center gap-5 rounded-[22px] border border-black/10 bg-white p-6 shadow-[0_14px_45px_rgba(0,0,0,0.05)]"
      >
        <div className="hidden h-[96px] w-[120px] rounded-[18px] bg-neutral-200 sm:block" />
        <div className="flex-1">
          <div className="h-4 w-[220px] rounded-full bg-[#2563EB]/25" />
          <div className="mt-4 h-6 w-[70%] rounded-full bg-neutral-200" />
          <div className="mt-4 h-4 w-[260px] rounded-full bg-neutral-100" />
        </div>
        <div className="h-10 w-10 rounded-full bg-neutral-100" />
      </div>
    ))}
  </div>
);

export default function PersonalizedRecommendations({ learningRoute }) {
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadRecommendations = async () => {
      setLoading(true);

      try {
        const data = await recommendationsFetcher.getRecommendations(
          learningRoute || {}
        );

        if (mounted) {
          setRecommendations(data);
        }
      } catch (error) {
        console.error("Error loading personalized recommendations:", error);
        if (mounted) {
          setRecommendations([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadRecommendations();

    return () => {
      mounted = false;
    };
  }, [learningRoute]);

  const getPlatformName = (cert) =>
    cert?.plataforma_certificacion?.nombre ||
    cert?.plataforma_nombre ||
    cert?.platform ||
    "Top Education";

  const getImage = (cert) =>
    cert?.imagen_final ||
    cert?.image ||
    cert?.miniatura ||
    "/assets/Piezas/demo-blog.png";

  const getTitle = (cert) => cert?.nombre || cert?.title || "Certificación recomendada";

  const getDuration = (cert) =>
    cert?.tiempo_certificacion ||
    cert?.duration ||
    "Duración flexible";

  const getLevel = (cert) =>
    cert?.nivel_certificacion ||
    cert?.level ||
    "Todos los niveles";

  if (loading) {
    return <RecommendationsSkeleton />;
  }

  if (!recommendations.length) {
    return (
      <div className="rounded-[22px] border border-black/10 bg-white p-8 text-center font-['Montserrat'] text-neutral-500">
        Estamos preparando recomendaciones para tu ruta.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {recommendations.slice(0, 3).map((cert) => (
        <article
          key={cert.id || cert.slug}
          onClick={() => cert.slug && navigate(`/certificacion/${cert.slug}`)}
          className="group flex cursor-pointer items-center gap-5 rounded-[22px] border border-black/10 bg-white px-3 shadow-[0_14px_45px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(0,0,0,0.09)]"
        >
          <img
            src={getImage(cert)}
            alt={getTitle(cert)}
            className="h-[96px] w-[120px] rounded-[25px] object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />

          <div className="flex-1 py-5">
            <div className="!font-['Montserrat'] text-xs font-semibold uppercase text-[#2563EB]">
              {getPlatformName(cert)} · Personalizado
            </div>

            <h3 className="mt-1 !font-['Montserrat'] text-lg font-semibold text-[#0F090B]">
              {getTitle(cert)}
            </h3>

            <div className="mt-2 !font-['Montserrat'] text-sm text-neutral-500">
              ◷ {getDuration(cert)} · {getLevel(cert)}
            </div>
          </div>

          <button
            type="button"
            className="mr-5 grid h-10 w-10 place-items-center rounded-full border border-black/10 text-neutral-400 transition group-hover:bg-[#2563EB] group-hover:text-white"
          >
            →
          </button>
        </article>
      ))}
    </div>
  );
}