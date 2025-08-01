import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import getBlogBySlug from "../services/getBlogBySlug";
import { Helmet } from "react-helmet";
import LatestBlogsGrid from "../components/cafam/LatestBlogsGrid";
import GridMasterclass from "../components/GridMasterclass";
import ShareButtons from '../components/ShareButtons';
import RightPop from "../components/RightPop";


const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToolTip, setShowTooltip] = useState(false);
  const [visibleContainerPopUp, setVisibleContainerPopUp] = useState(true);
  const [positionPopUp, SetPositionPopUp] = useState(false);
  const urlActual = window.location.href;
  

  useEffect(() => {
  if (window.lenis) {
    window.lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0); // fallback
  }
}, [slug]);

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


  const renderBlogContent = (content) => {
    console.log("Content to render:", content); // Debug log

    if (!content) {
      return null;
    }

    // Verifica si el contenido ya está en el campo contenido_blog o solo contenido
    


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
          <meta name="description" content={blog.metadescripcion_blog}/>
          <meta property="og:title" content={blog.metadescripcion_blog}/>
          <meta name="keywords" content={blog.palabra_clave_blog} />
          <meta name="author" content="Top Education" />
          <meta name="robots" content="index, follow" />
          <meta property="og:description" content={blog.metadescripcion_blog} />
          <meta property="og:type" content="website" />
        </Helmet>
      )}
    
      <section className="wrapper bg-[#F6F4EF]">
        <div className="container m-auto py-[4.5rem] xl:!py-24 lg:!py-24 md:!py-24">
          <div className="flex flex-wrap mx-[-15px] xl:mx-[-35px] lg:mx-[-20px]">
            <div className="xl:w-8/12 lg:w-8/12 w-full flex-[0_0_auto] !px-[15px] max-w-full md:!px-[20px] lg:!px-[20px] xl:!px-[35px]">
              <div className="blog single">
                <div className="card"></div>
              </div>
              {loading && <div className="flex justify-center items-center w-full h-screen py-4">
                <svg
                  className="animate-spin h-6 w-6 text-neutral-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span className="ml-2 text-neutral-700">Cargando...</span>
              </div>}
              {error && (
                <div className="error-message">
                  Error al cargar el blog: {error}
                </div>
              )}

              {blog && (
                  <div className="card-body flex-[1_1_auto] p-[40px] xl:!p-[0rem_3rem_2.8rem] lg:!p-[0rem_3rem_2.8rem] md:!p-[0rem_3rem_2.8rem]">
                    <img src={blog.miniatura_blog} alt="Miniatura" className="w-full rounded-lg" />
                    <span className="text-[1.3rem] font-normal block !w-auto max-w-[30%] bg-[#F6F4EF] rounded-full ml-2 mt-[-45px] text-[#D33B3E] relative top-italic w-full py-1 px-4" >{blog.categoria_blog_id}</span>
                    <h1 className="text-[2rem] leading-[1.1em] mt-3 font-normal !font-[Lora] w-full">{blog.nombre_blog}</h1>
                    <p>{blog.metadescripcion_blog}</p>
                    <div className="author-info xl:!flex lg:!flex md:!flex items-center !mb-3 mt-2 pb-2 border-b-2 border-[#D33B3E]">
                      <div className="flex items-center">
                        <figure className="w-12 h-12 !relative !mr-4 rounded-[100%]">
                          <img className="rounded-[50%]" src={blog.autor_blog.auto_img} alt="" />
                        </figure>
                        <div>
                          <h6 className="font-bold text-2xl mb-[-10px]">{blog.autor_blog_id}</h6>
                          <span className="!text-[0.9rem] p-0 list-none">  Publicado el {new Date(blog.fecha_redaccion_blog).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/\b\w/, l => l.toUpperCase())}</span>
                        </div>
                      </div>
                      <div className="!mt-3 xl:!mt-0 lg:!mt-0 md:!mt-0 !ml-auto">
                          <ShareButtons url={urlActual} title={blog.titulo} />
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
                  <div className="post !mb-8">
                    <div dangerouslySetInnerHTML={{ __html: blog.contenido }} />
                  </div>                  
                </div>
              )}
            </div>
            <aside className="xl:w-4/12 lg:w-4/12 w-full flex-[0_0_auto] xl:!px-[35px] lg:!px-[20px] !px-[15px] max-w-full sidebar">
              <div className="widget">
                <div className="video-container">
                  <video className="w-full" src="/assets/video/main-video.mp4" controls="true"></video> 
                </div>
              </div>
              <div className="widget !mt-[40px]">
                <h2 className="text-4xl font-normal font-[Lora] w-full top-italic !mb-3">Te puede interesar</h2>
                < LatestBlogsGrid/>
                <a href="/explora" className="btn py-2 px-5 rounded-full btn-col-1 text-lg font-semibold">Explora más de 13.000 certificaciones</a>
              </div>
              {visibleContainerPopUp && (
                  positionPopUp ? (
                      // Posición dentro del contenedor responsive
                      <div className="container-pop-up-responsive mt-10">
                          <button onClick={handleClickButtonPopUp} id="close-pop">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x">
                                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                  <path d="M18 6l-12 12" />
                                  <path d="M6 6l12 12" />
                              </svg>
                          </button>
                          <RightPop />
                      </div>
                  ) : (
                      // Posición original
                      <div className="sticky top-25 lg:col-start-9 lg:col-span-4 br-15 mt-10 border-1 border-[#ECECEC] overflow-hidden rounded-[15px] z-1">
                        <RightPop />
                      </div>
                      
                  )
              )}
              
            </aside>
          </div>
        </div>
      </section>
      < GridMasterclass/>
    </>
  );
};

export default BlogDetailPage;