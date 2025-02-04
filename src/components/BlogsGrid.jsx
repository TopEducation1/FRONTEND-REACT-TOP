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

            console.log(fetchData.results)

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

            console.error('Error loading certifications:', error);
            setError('Error loading certifications');
            setBlogs([]);

        } finally {

            setLoading(false);
        }

    }, []);

    useEffect(() => {
        loadBlogs();
    }, [loadBlogs]);


    if (!Array.isArray(blogs)) {
        
        return <div className="error-message">Error: No se pudieron cargar las certificaciones</div>;

    }

    return (
        <>
            <div id="wrapper-grid-blogs">
                <div id="grid-all-blogs">
                    {blogs.map(blog => {

                        return (
                            <div
                                key={blog.id}
                                className='blog-card'
                            >
                                <div id="wrapper-image-card-blog">
                                    <img src="/assets/Piezas/demo-blog.png" alt="imagen de prueba blog" />
                                </div>
                                <div id="wrapper-title-card-blog">
                                    <h1>{blog.titulo_blog}</h1>
                                </div>
                                
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default BlogsGrid;