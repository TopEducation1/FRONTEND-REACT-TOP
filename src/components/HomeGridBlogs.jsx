import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogsFetcher from '../services/BlogsFetcher';

const HomeGridBlogs = () => {
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

    const loadBlogs = useCallback(async (page = 1) => {
        setLoading(true);
        const pageSize = 3; 

        try {
            const fetchData = await BlogsFetcher.getAllBlogs(page, pageSize);

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

            //console.error('Error loading blogs:', error);
            setError('Error loading blogs');
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

            const path = `recursos/${blog.slug}`;
            navigate(path);

        } catch (error) {

            setError('Error al navegar hacia el blog');
        }
    };

    const handlePageChange = (newPage) => {

        if (newPage >= 1 && newPage <= pagination.total_pages) {

            setPagination((prev) => ({...prev, current_page: newPage}));

        }
    
    };

    if (!Array.isArray(blogs)) {

        return <div className="error-message">Error: No se pudieron cargar los blogs</div>;

    }

    return (

        <div id="wrapper-grid-blogs-home">
            <div id="grid-all-blogs-home">
                {blogs.map(blog => {
                    const imageUrl = blog.miniatura_blog || "/assets/Piezas/demo-blog.png";
                    return (
                        <div
                            onClick={() => handleBlogClick(blog)}
                            key={blog.id}
                            className='blog-card-home'
                        >
                            <div id="wrapper-image-card-blog-home">
                                <img src={imageUrl} alt={blog.nombre_blog} />
                            </div>
                            <div id="wrapper-title-card-blog-home">
                                <h2 className='text-white'>{blog.nombre_blog}</h2>
                            </div>
                        </div>
                    );
                })}
            </div>

            
        </div>
    );
};

export default HomeGridBlogs;