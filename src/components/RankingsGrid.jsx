import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RankingsFetcher from '../services/RankingsFetcher';

const RankingsGrid = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [pagination, setPagination] = useState({
    count: 0,
    current_page: 1,
    total_pages: 1,
  });

  const loadRankings = useCallback(async (page = 1, pageSize = 16, query = '') => {
    setLoading(true);
    try {
      const data = await RankingsFetcher.getAllRankings(page, pageSize, query);

      setRankings(data.results || []);
      setPagination({
        count: data.count || 0,
        current_page: page,
        total_pages: Math.ceil((data.count || 0) / pageSize) || 1,
      });
    } catch (err) {
      console.error('Error loading rankings:', err);
      setError('Error al cargar los rankings');
      setRankings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      loadRankings(pagination.current_page, 16, searchQuery);
    }, 300);
    return () => clearTimeout(delay);
  }, [pagination.current_page, searchQuery, loadRankings]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPagination((prev) => ({ ...prev, current_page: newPage }));
    }
  };

    const toSlug = (str) =>
        str
            .toLowerCase()
            .replace(/\s+/g, "-")             // espacios → guiones
            .normalize("NFD")                 // quita acentos
            .replace(/[\u0300-\u036f]/g, ""); // remueve diacríticos

    const handleRankingClick = (ranking) => {
        if (!ranking) return;
        const slug = toSlug(ranking.nombre);
        navigate(`/lo-mas-top/ranking/${slug}`);
    };


  const renderPageButtons = () => {
    const { current_page, total_pages } = pagination;
    const delta = 2;
    const range = [];

    for (let i = Math.max(2, current_page - delta); i <= Math.min(total_pages - 1, current_page + delta); i++) {
      range.push(i);
    }
    if (current_page - delta > 2) range.unshift('...');
    if (current_page + delta < total_pages - 1) range.push('...');
    range.unshift(1);
    if (total_pages > 1) range.push(total_pages);

    const uniquePages = [...new Set(range)];
    return uniquePages.map((page, index) => {
      if (page === '...') {
        return <span key={`ellipsis-${index}`} className="text-[#F6F4EF] px-2">...</span>;
      }
      return (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1 rounded-[25px] ${page === current_page ? 'bg-neutral-700 text-[#F6F4EF]' : 'bg-neutral-200'}`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <section className="wrapper px-4">
      {/* Oculta el buscador en la sección "Lo más Top", igual que en BlogsGrid */}

      {error && <div className="text-red-500 text-center">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center w-full py-4">
          <svg
            className="animate-spin h-6 w-6 text-neutral-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span className="ml-2 text-neutral-700">Cargando...</span>
        </div>
      ) : (
        <div className={`container m-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
          {rankings.map((ranking) => {
            // Campos comunes: ajusta nombres si tu API usa otros (ej: imagen_ranking, banner, portada)
            const imageUrl =
              ranking.image ||
              "/assets/Piezas/demo-ranking.png";

            const title = ranking.nombre || 'Ranking';
            const key = ranking.id ;

            return (
              <div
                key={key}
                onClick={() => handleRankingClick(ranking)}
                className="cursor-pointer border border-[#F6F4EF] rounded-xl hover:scale-[1.02] transition"
              >
                <img src={imageUrl} alt={title} className="w-full rounded-xl" />
                
              </div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      <div className="flex justify-center py-6">
        <div className="flex gap-2 flex-wrap items-center">
          <button
            className="px-3 py-1 bg-neutral-200 rounded-[25px]"
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
          >
            Anterior
          </button>

          {renderPageButtons()}

          <button
            className="px-3 py-1 bg-neutral-200 rounded-[25px]"
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.total_pages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
};

export default RankingsGrid;
