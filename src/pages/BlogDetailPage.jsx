import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import getBlogBySlug from "../services/getBlogBySlug";
import { Helmet } from "react-helmet";

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
        console.log("Blog data received:", data); // Debug log
        setBlog(data);
      } catch (error) {
        console.error("Error loading blog:", error); // Debug log
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlog();
    }
  }, [slug]);

  const renderBlogContent = (content) => {
    console.log("Content to render:", content); // Debug log

    if (!content) {
      console.log("No content available"); // Debug log
      return null;
    }

    // Verifica si el contenido ya está en el campo contenido_blog o solo contenido
    const htmlContent = content.contenido_blog || content;
    console.log("HTML content to render:", htmlContent); // Debug log

    return (
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  // Debug log para ver el estado del blog
  console.log("Current blog state:", blog);

  return (
    <>
      {/**SEO ELEMENTS WITH REACT -HELMET */}
      <Helmet>
        <title>{blog.nombre_blog}</title>
        <meta
          name="description"
          content={blog.metadescripcion_blog}
        />
        <meta
          property="og:title"
          content={blog.metadescripcion_blog}
        />
        <meta
          name="keywords"
          content={blog.palabra_clave_blog}
        />
        <meta name="author" content="Top Education" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:description"
          content={certification.metadescripcion_blog}
        />
        <meta property="og:type" content="website" />
      </Helmet>

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
              <h1 className="blog-main-title">
                {blog.titulo_blog || blog.nombre_blog}
              </h1>

              <div className="blog-meta">
                {blog.fecha_blog_redaccion && (
                  <time className="blog-date">
                    Actualizado:{" "}
                    {new Date(blog.fecha_blog_redaccion).toLocaleDateString()}
                  </time>
                )}
              </div>

              {/* Mostrar el contenido sin procesar para debug */}
              <div style={{ display: "none" }}>
                Raw content:{" "}
                {JSON.stringify(blog.contenido_blog || blog.contenido)}
              </div>

              {/* Renderizar el contenido HTML */}
              {renderBlogContent(blog.contenido_blog || blog.contenido)}
            </article>
          )}
        </div>

        <div id="wrapper-right-content-blog">
          <h1>Contenido en trabajo</h1>
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;
