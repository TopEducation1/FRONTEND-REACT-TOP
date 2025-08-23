import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogsFetcher from '../../services/BlogsFetcher';

const LatestBlogsGrid = () => {

    const navigate = useNavigate();
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ blogs, setBlogs] = useState([]);


    const [pagination, setPagination] = useState({
        count: 0,
        current_page: 1,
        total_pages: 1
    });

    const loadBlogs = useCallback(async (page = 1, pageSize = 4) => {

        setLoading(true);
        try {
            let fetchData;
            fetchData = await BlogsFetcher.getAllBlogs(page, pageSize);
            if (fetchData && Array.isArray(fetchData.results)) {
                setBlogs(fetchData.results);
                setPagination({
                    count: fetchData.count || 0, 
                    current_page: 
                    page, total_pages: 
                    Math.ceil(fetchData.count / pageSize) || 1,
                });

            } else {
                setBlogs([]);
            }
        } catch (error) {

            console.error('Error loading blogs', error);
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

            const path = `/recursos/${blog.slug}`;
            navigate(path);
        } catch (error) {
            setError('Error al navegar hacia el blog');
        }
    };

    if (!Array.isArray(blogs)) {

        return <div className="error-message">Error: No se pudieron cargar los blogs</div>;
    }
    return (
        <>
            <ul className="m-0 p-0 after:content-[''] after:block after:h-0 after:clear-both after:invisible">
                {blogs.map(blog => {

                    const imageUrl = blog.miniatura_blog || "/assets/Piezas/demo-blog.png";
                    return (
                        <li onClick={() => handleBlogClick(blog)} key={blog.id} className="cursor-pointer clear-both block overflow-hidden mb-2 hover:opacity-75">
                            <figure className="!rounded-[.4rem] float-left w-16 mt-1 h-[3rem] md:h-[4rem] lg:h-[3rem]">
                                <img className="!rounded-[.4rem] border-neutral border-2" src={imageUrl} alt={blog.nombre_blog} />
                            </figure>
                            <div className='!relative !ml-[4.5rem] !mb-0'>
                                <h6 className="text-1xl font-semibold font-[Lora] leading-[1.2em]">{blog.nombre_blog}</h6>
                            </div>
                        </li>

                    )

                })}
            </ul>
        </>
    )
}

export default LatestBlogsGrid;