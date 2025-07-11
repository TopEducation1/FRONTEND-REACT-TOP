import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogsFetcher from '../services/BlogsFetcher';

const BlogsGrid = () => {
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

    const loadBlogs = useCallback(async (page = 1, pageSize = 16, query = '') => {
        setLoading(true);
        try {
            const data = await BlogsFetcher.getAllBlogs(page, pageSize, query);

            setBlogs(data.results);
            setPagination({
                count: data.count || 0,
                current_page: page,
                total_pages: Math.ceil(data.count / pageSize) || 1,
            });
        } catch (error) {
            console.error('Error loading blogs:', error);
            setError('Error al cargar los blogs');
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Efecto para cargar blogs al cambiar página o búsqueda
    useEffect(() => {
        const delay = setTimeout(() => {
            loadBlogs(pagination.current_page, 16, searchQuery);
        }, 300);
        return () => clearTimeout(delay);
    }, [pagination.current_page, searchQuery, loadBlogs]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            setPagination((prev) => ({ ...prev, current_page: newPage }));
        }
    };

    const handleBlogClick = (blog) => {
        if (!blog) return;
        navigate(`/recursos/${blog.slug}`);
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
                return <span key={`ellipsis-${index}`} className="text-white px-2">...</span>;
            }
            return (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-[25px] ${page === current_page ? 'bg-neutral-700 text-white' : 'bg-neutral-200'}`}
                >
                    {page}
                </button>
            );
        });
    };

    return (
        <section className="wrapper px-4">
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Buscar blogs por título..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPagination((prev) => ({ ...prev, current_page: 1 }));
                    }}
                    className="px-4 py-2 w-full max-w-md border rounded-[25px]"
                />
            </div>

            {error && <div className="text-red-500 text-center">{error}</div>}
            {loading ? (
                <div className="text-white text-center">Cargando blogs...</div>
            ) : (
                <div className="container m-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {blogs.map((blog) => {
                        const imageUrl = blog.miniatura_blog || "/assets/Piezas/demo-blog.png";
                        return (
                            <div
                                key={blog.id}
                                onClick={() => handleBlogClick(blog)}
                                className="blog-card cursor-pointer border border-white rounded-xl hover:scale-[1.02] transition"
                            >
                                <img src={imageUrl} alt={blog.nombre_blog} className="w-full rounded-t-xl" />
                                <div className="px-3 py-4">
                                    <h3 className="text-white text-center text-lg font-bold">{blog.nombre_blog}</h3>
                                </div>
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

export default BlogsGrid;
