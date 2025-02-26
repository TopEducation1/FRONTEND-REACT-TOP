import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import getBlogBySlug from "../services/getBlogBySlug";
import { Helmet } from "react-helmet";
import LatestBlogsGrid from "../components/cafam/LatestBlogsGrid";
import GridMasterclass from "../components/GridMasterclass";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToolTip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("Copiar link");

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlogBySlug(slug);
        console.log("Blog data received:", data); 
        setBlog(data);
      } catch (error) {
        console.error("Error loading blog:", error); 
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlog();
    }
  }, [slug]);

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setTooltipMessage("Link copiado"); // Cambia el mensaje del tooltip
        setTimeout(() => {
          setTooltipMessage("Copiar link"); // Restaura el mensaje después de 2 segundos
        }, 2000);
      })
      .catch((err) => {
        console.error("Error al copiar el link: ", err);
      });
  };

  const renderBlogContent = (content) => {
    console.log("Content to render:", content); // Debug log

    if (!content) {
      return null;
    }

    // Verifica si el contenido ya está en el campo contenido_blog o solo contenido
    const htmlContent = content.contenido_blog || content;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;


    const links = tempDiv.querySelectorAll("a");

    links.forEach((link) => {
      const linkText = link.textContent.trim();
      if (linkText.startsWith("CTA")) {
        const url = link.getAttribute("href");
        const text = linkText.replace("CTA", "").trim()
        
        
        const newContent = `
          <a href="${url}" target="_blank" rel="noopener noreferrer">
            <img src="${blog.url_img_cta}" alt="${text}" style="cursor: pointer;" />
          </a>
        `;

        link.outerHTML = newContent;  
      }
    });


    return (
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }}
      />
    );
  };

  return (
    <>
      {/**SEO ELEMENTS WITH REACT -HELMET */}
      {blog && (
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
            content={blog.metadescripcion_blog}
          />
          <meta property="og:type" content="website" />
        </Helmet>
      )}

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
              <span id="category-blog">{blog.categoria_blog_id}</span>
              <h1 className="blog-main-title">{blog.nombre_blog}</h1>
              <p id="metadescription-blog">{blog.metadescripcion_blog}</p>
              
              <div id="author-share">
                <div id="wrapper-author">
                  <div id="wrapper-icon-author">
                    <img id="icon-author-img" src={blog.url_img_autor} alt="" />
                  </div>
                  <div id="wrapper-name-date">
                    <span id="span-author">{blog.autor_blog_id}</span>
                    <span id="span-date">{blog.fecha_redaccion_blog}</span>
                  </div>
                </div>

                <div id="wrapper-button-share"
                  onClick={copyToClipboard}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  {showToolTip && <span id="tooltip-clipboard">{tooltipMessage}</span>}
                  <img src="/assets/Piezas/share.png" alt="Share icon" />
                </div>
              </div>

              <div className="blog-meta">
                {blog.fecha_blog_redaccion && (
                  <time className="blog-date">
                    Actualizado:{" "}
                    {new Date(blog.fecha_blog_redaccion).toLocaleDateString()}
                  </time>
                )}
              </div>

              {/* Renderizar el contenido HTML */}
              {renderBlogContent(blog.contenido_blog || blog.contenido)}
            </article>
          )}
          <div id="wrapper-interest-links">
            <h2>Te puede interesar</h2>
            < LatestBlogsGrid/>
            <a href="/explora"><button id="explore-13000">Explora más de 13000 certificaciones</button></a>
          </div>
        </div>

        


      </div>

      < GridMasterclass/>
    </>
  );
};

export default BlogDetailPage;