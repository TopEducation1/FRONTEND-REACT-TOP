import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogsFetcher from "../../services/BlogsFetcher";

const LatestBlogsGrid = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);

  const [pagination, setPagination] = useState({
    count: 0,
    current_page: 1,
    total_pages: 1,
  });

  const loadBlogs = useCallback(async (page = 1, pageSize = 4) => {
    setLoading(true);
    setError(null);

    try {
      const fetchData = await BlogsFetcher.getAllBlogs(page, pageSize);

      if (fetchData && Array.isArray(fetchData.results)) {
        setBlogs(fetchData.results);

        setPagination({
          count: fetchData.count || 0,
          current_page: page,
          total_pages: Math.ceil((fetchData.count || 0) / pageSize) || 1,
        });
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error loading blogs", error);
      setError("Error loading blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs(pagination.current_page);
  }, [pagination.current_page, loadBlogs]);

  const handleBlogClick = (blog) => {
    try {
      if (!blog) throw new Error("No blog data provided");

      navigate(`/recursos/${blog.slug}`);
    } catch (error) {
      setError("Error al navegar hacia el blog");
    }
  };

  if (!Array.isArray(blogs)) {
    return (
      <div className="rounded-[18px] bg-red-50 px-4 py-3 font-['Montserrat'] text-sm font-medium text-red-600">
        Error: No se pudieron cargar los blogs
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse gap-3 rounded-[18px] border border-black/10 bg-white p-2"
          >
            <div className="h-[64px] w-[74px] shrink-0 rounded-[14px] bg-neutral-200" />

            <div className="flex flex-1 flex-col justify-center gap-2">
              <div className="h-3 w-[85%] rounded bg-neutral-200" />
              <div className="h-3 w-[60%] rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-3 rounded-[18px] bg-red-50 px-4 py-2 font-['Montserrat'] text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {blogs.map((blog) => {
          const imageUrl = blog.miniatura_blog || "/assets/Piezas/demo-blog.png";

          return (
            <li key={blog.id}>
              <button
                type="button"
                onClick={() => handleBlogClick(blog)}
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-[18px]
                  border
                  border-black/10
                  bg-white
                  p-2
                  text-left
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-black/15
                  hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)]
                "
              >
                <div className="h-[64px] w-[74px] shrink-0 overflow-hidden rounded-[14px] bg-neutral-100">
                  <img
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                    src={imageUrl}
                    alt={blog.nombre_blog}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/Piezas/demo-blog.png";
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  {blog.categoria_blog_id && (
                    <span className="mb-1 inline-flex rounded-full bg-[#1941cf] px-2.5 py-0.5 font-['Montserrat'] text-[10px] font-bold tracking-[0.04em] text-[#FFFFFF]">
                      {blog.categoria_blog_id}
                    </span>
                  )}

                  <h6
                    className="
                      line-clamp-2
                      font-['Montserrat']
                      text-[13px]
                      font-bold
                      leading-[1.25em]
                      tracking-[-0.02em]
                      text-[#111111]
                      transition-colors
                      duration-300
                      group-hover:text-[#1941cf]
                    "
                  >
                    {blog.nombre_blog}
                  </h6>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default LatestBlogsGrid;