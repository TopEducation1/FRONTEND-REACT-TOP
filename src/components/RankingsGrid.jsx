import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import RankingsFetcher from "../services/RankingsFetcher";

const RankingsGrid = () => {
  const navigate = useNavigate();

  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    count: 0,
    current_page: 1,
    total_pages: 1,
  });

  const pageSize = 16;

  const palette = [
    {
      bg: "bg-[#5CC781]",
      text: "text-white",
      stars: "text-white/80",
      circle: "border-white/25",
    },
    {
      bg: "bg-[#D33B3E]",
      text: "text-white",
      stars: "text-white/80",
      circle: "border-white/25",
    },
    
    {
      bg: "bg-[#034694]",
      text: "text-white",
      stars: "text-white/80",
      circle: "border-white/25",
    },
  ];

  const loadRankings = useCallback(async (page = 1, size = pageSize) => {
    setLoading(true);

    try {
      const data = await RankingsFetcher.getAllRankings(page, size, "");

      setRankings(data.results || []);

      setPagination({
        count: data.count || 0,
        current_page: page,
        total_pages: Math.ceil((data.count || 0) / size) || 1,
      });
    } catch (err) {
      console.error("Error loading rankings:", err);
      setError("Error al cargar los rankings");
      setRankings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRankings(pagination.current_page, pageSize);
  }, [pagination.current_page, loadRankings]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPagination((prev) => ({
        ...prev,
        current_page: newPage,
      }));
    }
  };

  const toSlug = (str = "") =>
    str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const handleRankingClick = (ranking) => {
    if (!ranking) return;

    const slug = toSlug(ranking.nombre);
    navigate(`/lo-mas-top/ranking/${slug}`);
  };

  const getRankingImage = (ranking) => {
    return (
      ranking.image ||
      ranking.imagen ||
      ranking.imagen_ranking ||
      ranking.icon ||
      ranking.ico ||
      null
    );
  };

  const getVisiblePages = () => {
    const { current_page, total_pages } = pagination;
    const maxVisible = 5;

    let start = Math.max(1, current_page - 2);
    let end = Math.min(total_pages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <section className="relative overflow-hidden bg-white px-4 pt-12 pb-20">
      <div className="mx-auto max-w-[1200px]">
        {error && (
          <div className="mb-6 rounded-[20px] bg-red-50 px-5 py-4 text-center font-['Montserrat'] text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex w-full items-center justify-center py-16">
            <svg
              className="h-6 w-6 animate-spin text-neutral-700"
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

            <span className="ml-2 font-['Montserrat'] text-sm font-medium text-neutral-700">
              Cargando...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rankings.map((ranking, index) => {
              const theme = palette[index % palette.length];
              const imageUrl = getRankingImage(ranking);
              const title = ranking.nombre || "Ranking";

              return (
                <article
                  key={ranking.id || title}
                  onClick={() => handleRankingClick(ranking)}
                  className={`
                    group
                    relative
                    min-h-[195px]
                    cursor-pointer
                    overflow-hidden
                    rounded-[18px]
                    p-6
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:scale-[1.015]
                    hover:shadow-[0_24px_70px_rgba(0,0,0,0.16)]
                    ${theme.bg}
                    ${theme.text}
                  `}
                >
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <div
                        className={`mb-4 font-['Montserrat'] text-[14px] font-bold tracking-[0.18em] ${theme.stars}`}
                      >
                        ★★★★★
                      </div>

                      <p className="font-['Montserrat'] text-[1.25rem] font-extrabold leading-none tracking-[-0.03em]">
                        Top 50
                      </p>

                      <h3 className="mt-2 max-w-[260px] font-te-it text-[2.3rem] font-bold leading-[1.05em] text-white">
                        {title.replace(/^Top\s*50\s*/i, "")}
                      </h3>

                      <p className="mt-1 font-['Montserrat'] text-[13px] font-medium text-white/70">
                        por top.education
                      </p>
                    </div>
                  </div>

                  <div
                    className={`
                      absolute
                      bottom-0
                      right-0
                      z-1
                      flex
                      h-[full]
                      w-[40%]
                      items-end
                      justify-end                      
                      ${theme.circle}
                    `}
                  >
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="h-auto w-full transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-[linear-gradient(135deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.12)_35%,transparent_100%)]
                    "
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-[radial-gradient(circle_at_90%_85%,rgba(255,255,255,0.14),transparent_24%)]
                    "
                  />
                </article>
              );
            })}
          </div>
        )}

        {pagination.total_pages > 1 && (
          <div className="mt-10 flex justify-center">
            <div className="flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-2 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
              <button
                type="button"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="flex h-10 items-center gap-2 rounded-full bg-white px-4 font-['Montserrat'] text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaChevronLeft className="text-xs" />
                Anterior
              </button>

              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`hidden h-10 min-w-10 items-center justify-center rounded-full px-3 font-['Montserrat'] text-sm font-bold transition sm:flex ${
                    page === pagination.current_page
                      ? "bg-[#111111] text-white"
                      : "bg-white text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages}
                className="flex h-10 items-center gap-2 rounded-full bg-white px-4 font-['Montserrat'] text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RankingsGrid;