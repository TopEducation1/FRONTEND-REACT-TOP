import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogsFetcher from '../services/BlogsFetcher';
import {
  FaAnglesLeft,
  FaChevronLeft,
  FaChevronRight,
  FaAnglesRight,
} from "react-icons/fa6";

const BlogsGrid = ({ category = "" }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [pagination, setPagination] = useState({
    count: 0,
    current_page: 1,
    total_pages: 1,
  });

  // ⬇️ NUEVO: pageSize responsive (4 móvil, 16 desktop)
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const calcPageSize = () =>
      window.matchMedia('(max-width: 767px)').matches ? 4 : 8;

    setPageSize(calcPageSize());

    let tid;
    const onResize = () => {
      clearTimeout(tid);
      tid = setTimeout(() => setPageSize(calcPageSize()), 150);
    };

    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(tid);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const loadBlogs = useCallback(
    async (page = 1, size = pageSize, query = '') => {
      setLoading(true);
      try {
        const data = await BlogsFetcher.getAllBlogs(page, size, query, category);

        setBlogs(data.results || []);
        setPagination({
          count: data.count || 0,
          current_page: page,
          total_pages: Math.ceil((data.count || 0) / size) || 1,
        });
      } catch (error) {
        console.error('Error loading blogs:', error);
        setError('Error al cargar los blogs');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    },
    [category, pageSize] // importante: responde a cambios de categoría o tamaño de página
  );

  const BlogsGridSkeleton = ({ category = "" }) => {
    const items = category !== "Lo más Top" ? 8 : 8;

    return (
      <div
        className={`
          container
          mx-auto
          grid
          grid-cols-1
          sm:grid-cols-2
          ${category !== "Lo más Top" ? "lg:grid-cols-4" : "lg:grid-cols-3"}
          gap-6
        `}
      >
        {Array.from({ length: items }).map((_, index) => (
          <article
            key={index}
            className="overflow-hidden rounded-[14px] bg-[#130D10] animate-pulse"
          >
            <div className="relative h-[175px] bg-neutral-800">
              <div className="absolute left-4 top-4 h-6 w-[150px] rounded-full bg-[#5CC781]/40" />
            </div>

            <div className="min-h-[90px] px-5 py-5">
              <div className="h-4 w-[90%] rounded-full bg-white/15" />
              <div className="mt-3 h-4 w-[70%] rounded-full bg-white/10" />
            </div>
          </article>
        ))}
      </div>
    );
  };

  // Cargar blogs al cambiar página, búsqueda o pageSize
  useEffect(() => {
    const delay = setTimeout(() => {
      // Si cambió el pageSize, mantenemos la página actual.
      loadBlogs(pagination.current_page, pageSize, searchQuery);
    }, 300);
    return () => clearTimeout(delay);
  }, [pagination.current_page, searchQuery, pageSize, loadBlogs]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPagination((prev) => ({ ...prev, current_page: newPage }));
    }
  };

  const handleBlogClick = (blog) => {
    if (!blog) return;
    navigate(`/recursos/${blog.slug}`);
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
    <section className="wrapper px-4">
      {category !== 'Lo más Top' && (
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Qué estás buscando..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPagination((prev) => ({ ...prev, current_page: 1 }));
            }}
            className="px-4 py-2 w-full max-w-md border rounded-[25px]"
          />
        </div>
      )}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {loading ? (
        <BlogsGridSkeleton category={category} />
      ) : (
        <div
          className={`
            container
            mx-auto
            grid
            grid-cols-1
            sm:grid-cols-2
            ${category !== "Lo más Top" ? "lg:grid-cols-4" : "lg:grid-cols-3"}
            gap-6
          `}
        >
          {blogs.map((blog) => {
            const imageUrl = blog.miniatura_blog || "/assets/Piezas/demo-blog.png";

            return (
              <article
                key={blog.id}
                onClick={() => handleBlogClick(blog)}
                className="
                  group
                  cursor-pointer
                  overflow-hidden
                  rounded-[14px]
                  bg-[#130D10]
                  transition-all
                  duration-300
                  ease-out
                  hover:-translate-y-1
                  hover:scale-[1.025]
                  hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]
                "
              >
                <div className="relative h-[175px] overflow-hidden bg-[#F6F4EF]">
                  <span
                    className="
                      absolute
                      left-4
                      top-4
                      z-10
                      rounded-full
                      bg-[#5CC781]
                      px-3
                      py-1
                      text-[12px]
                      font-bold
                      leading-none
                      text-white
                    "
                  >
                    {blog.categoria_blog_id || "top"}
                  </span>

                  <img
                    src={imageUrl}
                    alt={blog.nombre_blog}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      ease-out
                      group-hover:scale-[1.07]
                    "
                  />
                </div>

                <div className="min-h-[90px] px-5 py-5">
                  <h3
                    className="text-white !font-[Montserrat] text-sm font-medium leading-snug group-hover:text-[#5CC781] transition-colors line-clamp-3"
                  >
                    {blog.nombre_blog}
                  </h3>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {pagination.total_pages > 1 && (
        <div className="flex justify-center py-10">
          <div
            className="
              flex
              items-center
              justify-center
              gap-1
              rounded-full
              bg-white/5
              border
              border-white/10
              px-2
              py-2
              backdrop-blur-md
            "
          >
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.current_page === 1 || loading}
              className="
                flex
                h-10
                w-8 md:w-10 
                items-center
                justify-center
                rounded-full
                bg-neutral-50
                text-neutral-900
                transition-all
                duration-300
                hover:bg-neutral-200
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <FaAnglesLeft />
            </button>

            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1 || loading}
              className="
                flex
                h-10
                w-8 md:w-10 
                items-center
                justify-center
                rounded-full
                bg-neutral-50
                text-neutral-900
                transition-all
                duration-300
                hover:bg-neutral-200
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <FaChevronLeft />
            </button>

            {getVisiblePages()[0] > 1 && (
              <span className="px-2 text-white/50">...</span>
            )}

            {getVisiblePages().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={loading}
                className={`
                  flex
                  h-10
                  w-8
                  md:w-10
                  items-center
                  justify-center
                  rounded-full
                  px-3
                  text-sm
                  font-bold
                  transition-all
                  duration-300
                  ${
                    page === pagination.current_page
                      ? "bg-[#5CC781] text-[#0F090D] shadow-[0_10px_30px_rgba(92,199,129,0.35)]"
                      : "bg-neutral-50 text-neutral-700 hover:bg-neutral-200"
                  }
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                `}
              >
                {page}
              </button>
            ))}

            {getVisiblePages()[getVisiblePages().length - 1] <
              pagination.total_pages && (
              <span className="px-2 text-white/50">...</span>
            )}

            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.total_pages || loading}
              className="
                flex
                h-10
                w-8 md:w-10 
                items-center
                justify-center
                rounded-full
                bg-neutral-50
                text-neutral-900
                transition-all
                duration-300
                hover:bg-neutral-200
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <FaChevronRight />
            </button>

            <button
              onClick={() => handlePageChange(pagination.total_pages)}
              disabled={pagination.current_page === pagination.total_pages || loading}
              className="
                flex
                h-10
                w-8 md:w-10 
                items-center
                justify-center
                rounded-full
                bg-neutral-50
                text-neutral-900
                transition-all
                duration-300
                hover:bg-neutral-200
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <FaAnglesRight />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogsGrid;
