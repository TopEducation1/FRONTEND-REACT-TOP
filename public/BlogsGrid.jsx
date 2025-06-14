import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogsFetcher from '../services/BlogsFetcher';

const BlogsGrid = () => {

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);

    // Estados para la paginación
    const [pagination, setPagination] = useState({
        count: 0,
        current_page: 1,
        total_pages: 1,
    });

    const loadBlogs = useCallback(async (page = 1, pageSize = 16) => {
        setLoading(true);

        try {
            let fetchData;
            fetchData = await BlogsFetcher.getAllBlogs(page, pageSize);

            console.log(fetchData.results);

            if (fetchData && Array.isArray(fetchData.results)) {
                setBlogs(fetchData.results);

                setPagination({
                    count: fetchData.count || 0,
                    current_page: page,
                    total_pages: Math.ceil(fetchData.count / pageSize) || 1,
                });
            } else {
                setBlogs([]);
            }
        } catch (error) {
            console.error('Error loading blogs:', error);
            setError('Error loading certifications');
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
            if (!blog) {
                throw new Error("No blog data provided");
            }

            const path = `/recursos/${blog.slug}`;
            navigate(path);
        } catch (error) {
            setError('Error al navegar hacia el blog');
        }
    };

    const handlePageChange = (newPage) => {

        if (newPage => 1 && newPage <= pagination.total_pages) {
            setPagination((prev) =>({...prev, current_page: newPage}));
        }
    };  

    if (!Array.isArray(blogs)) {
        return <div className="error-message">Error: No se puedieron cargar los blogs</div>;
    }

    return (
        <>
        <div id="wrapper-grid-blogs">
            <div className='grid grid-cols-3 gap-4'>
                {blogs.map(blog => {
                    // Usar la URL de miniatura_blog si está disponible, de lo contrario usar una imagen por defecto
                    const imageUrl = blog.miniatura_blog || "/assets/Piezas/demo-blog.png";
                    return (
                        <div onClick={() => handleBlogClick(blog)} key={blog.id} className='blog-card'>
                            <div id="wrapper-image-card-blog">
                                <img src={imageUrl} alt={blog.nombre_blog} />
                            </div>
                            <div id="wrapper-title-card-blog">
                                <h2 className='text-white'>{blog.nombre_blog}</h2>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/*Controles para la paginación de los blogs */}
            <div id="pagination-controls">
                <button onClick={() => handlePageChange(pagination.current_page -1)} disabled={pagination.current_page === 1}>Anterior</button>
                <span>Página {pagination.current_page} de {pagination.total_pages} </span>
                <button onClick={() => handlePageChange(pagination.current_page +1)} disabled={pagination.current_page === pagination.total_pages}>Siguiente</button>
            </div>
        </div>
        </>
    );
};

export default BlogsGrid;