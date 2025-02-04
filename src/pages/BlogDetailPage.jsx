import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import getBlogBySlug from "../services/getBlogBySlug";

const BlogDetailPage = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBlog = async () => {
            try {
                setLoading(true);
                const data = await getBlogBySlug(slug);
                setBlog(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            loadBlog();
        }
    }, [slug]);

    const parseBlogContent = (content) => {
        if (!content) return [];
        
        const elements = [];
        let currentList = [];
        
        content.split('\n').forEach((line, index) => {
            const trimmedLine = line.trim();
            
            // Si la línea está vacía o solo contiene el símbolo de viñeta, la ignoramos
            if (!trimmedLine || trimmedLine === '-' || trimmedLine === '•') {
                // Si hay una lista pendiente, la agregamos antes de continuar
                if (currentList.length > 0) {
                    elements.push(
                        <ul key={`ul-${elements.length}`} className="blog-list">
                            {currentList}
                        </ul>
                    );
                    currentList = [];
                }
                return;
            }

            // Detectar encabezados y remover los símbolos #
            if (trimmedLine.startsWith('#')) {
                // Si hay una lista pendiente, agregarla antes del encabezado
                if (currentList.length > 0) {
                    elements.push(
                        <ul key={`ul-${elements.length}`} className="blog-list">
                            {currentList}
                        </ul>
                    );
                    currentList = [];
                }

                const headerLevel = trimmedLine.match(/^#+/)[0].length;
                const headerText = trimmedLine.replace(/^#+\s*/, '').trim();

                // Solo procesar si hay texto después de los #
                if (headerText) {
                    const HeaderTag = `h${Math.min(headerLevel, 6)}`;
                    elements.push(
                        <HeaderTag key={`header-${index}`} className={`blog-subtitle blog-h${headerLevel}`}>
                            {headerText}
                        </HeaderTag>
                    );
                }
                return;
            }
            
            if (/^[A-ZÁÉÍÓÚÑ\s-]+$/.test(trimmedLine) && trimmedLine.length > 5) {
                if (currentList.length > 0) {
                    elements.push(
                        <ul key={`ul-${elements.length}`} className="blog-list">
                            {currentList}
                        </ul>
                    );
                    currentList = [];
                }
                elements.push(<h2 key={`h2-${index}`} className="blog-subtitle">{trimmedLine}</h2>);
                return;
            }
            
            // Detectar listas y asegurarse de que haya contenido después del símbolo
            if ((trimmedLine.startsWith('-') || trimmedLine.startsWith('•'))) {
                const listItemContent = trimmedLine.replace(/^[-•]\s*/, '').trim();
                if (listItemContent) {  // Solo agregar si hay contenido después del símbolo
                    currentList.push(
                        <li key={`li-${index}`} className="blog-list-item">
                            {listItemContent}
                        </li>
                    );
                }
                return;
            }
            
            // Si no es lista y hay lista pendiente
            if (currentList.length > 0) {
                elements.push(
                    <ul key={`ul-${elements.length}`} className="blog-list">
                        {currentList}
                    </ul>
                );
                currentList = [];
            }
            
            // Detectar imágenes
            const imageMatch = trimmedLine.match(/\[imagen:(.*?)\]/);
            if (imageMatch) {
                elements.push(
                    <div key={`img-${index}`} className="blog-image-container">
                        <img 
                            src={imageMatch[1]} 
                            alt="Ilustración del contenido" 
                            className="blog-content-image"
                        />
                    </div>
                );
                return;
            }
            
            // Párrafos normales (solo si tienen contenido)
            if (trimmedLine.length > 0) {
                elements.push(<p key={`p-${index}`} className="blog-paragraph">{trimmedLine}</p>);
            }
        });
        
        // Agregar cualquier lista pendiente al final
        if (currentList.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="blog-list">
                    {currentList}
                </ul>
            );
        }
        
        return elements;
    };

    return (
        <div id="body-blog">
            <div id="wrapper-content-blog">
                {loading && <p>Cargando contenido...</p>}
                
                {error && (
                    <div className="error-message">
                        Error al cargar el blog: {error}
                    </div>
                )}
                
                {blog && (
                    <article className="blog-article">
                        <h1 className="blog-main-title">{blog.titulo_blog}</h1>
                        
                        <div className="blog-meta">
                            {blog.fecha_blog_redaccion && (
                                <time className="blog-date">
                                    Actualizado: {new Date(blog.fecha_blog_redaccion).toLocaleDateString()}
                                </time>
                            )}
                        </div>
                        
                        <div className="blog-content">
                            {parseBlogContent(blog.contenido_blog)}
                        </div>
                    </article>
                )}
            </div>

            <div id="wrapper-right-content-blog">
                <h1>Contenido en trabajo</h1>
            </div>
        </div>
    );
};

export default BlogDetailPage;