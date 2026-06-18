import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useNavigate, Link } from "react-router-dom";

import getBlogBySlug from "../services/getBlogBySlug";
import LatestBlogsGrid from "../components/cafam/LatestBlogsGrid";
import SuggestedCertifications from "../components/suggestedCertifications";
import ShareButtons from "../components/ShareButtons";
import RightPop from "../components/RightPop";
import { ArrowRight } from "lucide-react";

const BlogDetailSkeleton = () => {
    return (
      <main className="bg-white">
        <section className="relative overflow-visible bg-white px-4 pt-10 pb-8 md:pt-16 lg:pt-20 lg:pb-10">
          <div className="pointer-events-none absolute left-[-160px] top-20 h-[360px] w-[360px] rounded-full bg-[#1941cf]/5 blur-[110px]" />
          <div className="pointer-events-none absolute bottom-20 right-[-160px] h-[360px] w-[360px] rounded-full bg-[#5CC781]/8 blur-[110px]" />

          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 lg:grid-cols-12">
            <article className="lg:col-span-8">
              <div className="overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
                <div className="h-[260px] animate-pulse bg-neutral-200 md:h-[420px]" />

                <div className="p-3 lg:p-8">
                  <div className="h-12 w-[90%] animate-pulse rounded-full bg-neutral-200" />
                  <div className="mt-3 h-12 w-[70%] animate-pulse rounded-full bg-neutral-200" />

                  <div className="mt-5 space-y-3">
                    <div className="h-5 w-full animate-pulse rounded-full bg-neutral-100" />
                    <div className="h-5 w-[85%] animate-pulse rounded-full bg-neutral-100" />
                  </div>

                  <div className="mt-5 flex flex-col gap-5 border-y border-black/10 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-200" />
                      <div>
                        <div className="h-4 w-[120px] animate-pulse rounded-full bg-neutral-200" />
                        <div className="mt-2 h-3 w-[180px] animate-pulse rounded-full bg-neutral-100" />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-8 w-8 animate-pulse rounded-full bg-neutral-200"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="h-8 w-[70%] animate-pulse rounded-full bg-neutral-200" />
                    <div className="h-4 w-full animate-pulse rounded-full bg-neutral-100" />
                    <div className="h-4 w-full animate-pulse rounded-full bg-neutral-100" />
                    <div className="h-4 w-[92%] animate-pulse rounded-full bg-neutral-100" />
                    <div className="h-4 w-[85%] animate-pulse rounded-full bg-neutral-100" />

                    <div className="mt-8 h-[220px] animate-pulse rounded-[24px] bg-neutral-200" />

                    <div className="h-4 w-full animate-pulse rounded-full bg-neutral-100" />
                    <div className="h-4 w-[90%] animate-pulse rounded-full bg-neutral-100" />
                    <div className="h-4 w-[70%] animate-pulse rounded-full bg-neutral-100" />
                  </div>
                </div>
              </div>
            </article>

            <aside className="lg:col-span-4">
              <div className="space-y-6">
                <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.05)]">
                  <div className="aspect-video animate-pulse bg-neutral-200" />
                  <div className="p-5">
                    <div className="h-5 w-[70%] animate-pulse rounded-full bg-neutral-200" />
                    <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-neutral-100" />
                    <div className="mt-2 h-4 w-[80%] animate-pulse rounded-full bg-neutral-100" />
                  </div>
                </div>

                <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.05)]">
                  <div className="mb-4 h-7 w-[70%] animate-pulse rounded-full bg-neutral-200" />

                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-[16px] border border-black/10 p-2"
                      >
                        <div className="h-16 w-20 animate-pulse rounded-[12px] bg-neutral-200" />
                        <div className="flex-1">
                          <div className="h-4 w-[80%] animate-pulse rounded-full bg-neutral-200" />
                          <div className="mt-2 h-4 w-[60%] animate-pulse rounded-full bg-neutral-100" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 h-12 animate-pulse rounded-full bg-neutral-200" />
                </div>

                <div className="h-[260px] animate-pulse rounded-[28px] border border-black/10 bg-neutral-100" />
              </div>
            </aside>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white px-4 pb-16 md:pb-24">
          <div className="relative z-10 mx-auto max-w-[1200px]">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="h-3 w-[210px] animate-pulse rounded-full bg-neutral-200" />
                <div className="mt-4 h-12 w-[320px] animate-pulse rounded-full bg-neutral-200" />
                <div className="mt-3 h-5 w-[560px] max-w-full animate-pulse rounded-full bg-neutral-100" />
              </div>

              <div className="h-14 w-[240px] animate-pulse rounded-full bg-[#2563EB]/25" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[18px] border border-black/10 bg-white"
                >
                  <div className="h-[150px] animate-pulse bg-neutral-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-[90px] animate-pulse rounded-full bg-neutral-200" />
                    <div className="h-5 w-[85%] animate-pulse rounded-full bg-neutral-200" />
                    <div className="h-5 w-[65%] animate-pulse rounded-full bg-neutral-100" />
                    <div className="mt-4 flex items-center justify-between">
                      <div className="h-8 w-[90px] animate-pulse rounded-full bg-neutral-200" />
                      <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  };
const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [visibleContainerPopUp, setVisibleContainerPopUp] = useState(true);
  const [positionPopUp, setPositionPopUp] = useState(false);

  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [slug]);

  useEffect(() => {
    const handleResize = () => {
      setPositionPopUp(window.innerWidth < 1200);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    if (slug) loadBlog();
  }, [slug]);

  const handleClickButtonPopUp = () => {
    setVisibleContainerPopUp(false);
  };

  const isValidValue = (value) => {
    if (!value) return false;

    const clean = String(value).trim().toLowerCase();

    return (
      clean !== "" &&
      clean !== "none" &&
      clean !== "null" &&
      clean !== "undefined" &&
      clean !== "x"
    );
  };

  const formatDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date)
        .toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
        .replace(/\b\w/, (letter) => letter.toUpperCase());
    } catch {
      return "";
    }
  };
  
  const handleExploreClick = () => {
    navigate("/explora");
  };
  
  const renderBlogContent = (content) => {
    if (!content || !blog) return null;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    const links = tempDiv.querySelectorAll("a");

    links.forEach((link) => {
      const linkText = link.textContent.trim();

      if (linkText.startsWith("CTA") && blog.url_img_cta) {
        const url = link.getAttribute("href");
        const text = linkText.replace("CTA", "").trim();

        link.outerHTML = `
          <a href="${url}" target="_blank" rel="noopener noreferrer">
            <img src="${blog.url_img_cta}" alt="${text}" style="cursor:pointer;" />
          </a>
        `;
      }
    });

    return (
      <div
        className=" blog-content max-w-none font-['Montserrat'] text-[14px] leading-[1.5em] text-neutral-700
 [&_h1]:font-['Montserrat'] [&_h2]:font-['Montserrat'] [&_h3]:font-['Montserrat'] [&_h4]:font-['Montserrat']
 [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h4]:font-bold
 [&_h2]:mt-10 [&_h2]:text-[1.8rem] [&_h2]:leading-[1.2em] [&_h3]:text-[1.35rem]
 [&_p]:my-0 [&_a]:font-bold [&_a]:text-[#1941cf] [&_a]:no-underline hover:[&_a]:underline
 [&_img]:rounded-[24px] [&_img]:border [&_img]:border-black/10 [&_img]:shadow-[0_18px_60px_rgba(0,0,0,0.06)]
 [&_ul]:my-2 [&_li]:my-1
        "
        dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }}
      />
    );
  };

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  return (
    <>
      {blog && (
        <Helmet>
          <title>{blog.nombre_blog} | Top Education</title>
          <meta name="description" content={blog.metadescripcion_blog || ""} />
          <meta name="keywords" content={blog.palabra_clave_blog || ""} />
          <meta name="author" content="Top Education" />
          <meta name="robots" content="index, follow" />

          <meta property="og:title" content={blog.nombre_blog} />
          <meta
            property="og:description"
            content={blog.metadescripcion_blog || ""}
          />
          <meta property="og:type" content="article" />
          <meta
            property="og:url"
            content={`https://top.education/recursos/${blog.slug}`}
          />
          <meta property="og:site_name" content="Top Education" />
          <meta property="og:image" content={blog.miniatura_blog || ""} />
          <meta
            property="og:image:secure_url"
            content={blog.miniatura_blog || ""}
          />
          <meta property="og:image:alt" content={blog.nombre_blog} />

          {blog.fecha_redaccion_blog && (
            <meta
              property="article:published_time"
              content={new Date(blog.fecha_redaccion_blog).toISOString()}
            />
          )}

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={blog.nombre_blog} />
          <meta
            name="twitter:description"
            content={blog.metadescripcion_blog || ""}
          />
          <meta name="twitter:image" content={blog.miniatura_blog || ""} />
          <meta name="twitter:site" content="@TopEducation" />

          <link
            rel="canonical"
            href={`https://top.education/recursos/${blog.slug}`}
          />
        </Helmet>
      )}

      <main className="bg-white">
        <section className="relative overflow-hidden bg-white px-2 md:px-4 pt-10 pb-8 md:pt-16 md:pb-8 lg:pt-20 lg:pb-10">
          <div className="pointer-events-none absolute left-[-160px] top-20 h-[360px] w-[360px] rounded-full bg-[#1941cf]/5 blur-[110px]" />
          <div className="pointer-events-none absolute bottom-20 right-[-160px] h-[360px] w-[360px] rounded-full bg-[#5CC781]/8 blur-[110px]" />

          <div className="z-10">
            {error && (
              <div className="rounded-[24px] border border-red-100 bg-red-50 px-6 py-5 text-center font-['Montserrat'] text-sm font-medium text-red-600">
                Error al cargar el blog: {error}
              </div>
            )}

            {blog && (
              <div className="grid grid-cols-1 mx-auto max-w-[1200px] gap-5 lg:grid-cols-12">
                <article className="lg:col-span-8">
                  <div className="overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
                    {blog.miniatura_blog && (
                      <div className="relative">
                        <img
                          src={blog.miniatura_blog}
                          alt={blog.nombre_blog}
                          className="h-[260px] w-full object-cover md:h-[420px]"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />

                        {blog.categoria_blog_id && (
                          <span className="absolute left-5 top-5 rounded-full bg-[#1941cf] px-4 py-1.5 font-['Montserrat'] text-[12px] font-bold uppercase tracking-[0.05em] text-white shadow-[0_12px_30px_rgba(87,80,255,0.22)]">
                            {blog.categoria_blog_id}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-4 lg:p-8">
                      <h1 className="!font-['Montserrat'] !text-[2rem] font-bold leading-[1.08em] text-[#111111] md:text-[2.7rem]">
                        {blog.nombre_blog}
                      </h1>

                      {isValidValue(blog.metadescripcion_blog) && (
                        <p className="mt-3 max-w-[760px] font-['Montserrat'] text-[1rem] font-medium leading-[1.5em] text-neutral-600 md:text-[1.08rem]">
                          {blog.metadescripcion_blog}
                        </p>
                      )}

                      <div className="mt-4 flex flex-col gap-5 border-y border-black/10 py-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          {blog.autor_blog?.auto_img && (
                            <figure className="h-12 w-12 overflow-hidden rounded-full border border-black/10 bg-neutral-100">
                              <img
                                className="h-full w-full object-cover"
                                src={blog.autor_blog.auto_img}
                                alt={blog.autor_blog_id || "Autor"}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </figure>
                          )}

                          <div className="flex flex-col">
                            <h6 className="font-['Montserrat'] leading-[1em] text-[15px] font-bold text-black">
                              {blog.autor_blog_id || "top.education"}
                            </h6>

                            {blog.fecha_redaccion_blog && (
                              <span className="font-['Montserrat'] text-[13px] text-neutral-500">
                                Publicado el{" "}
                                {formatDate(blog.fecha_redaccion_blog)}
                              </span>
                            )}
                          </div>
                        </div>

                        <ShareButtons
                          url={`https://top.education/recursos/${blog.slug}`}
                          title={blog.nombre_blog}
                        />
                      </div>

                      {blog.fecha_blog_redaccion && (
                        <time className="mt-4 block font-['Montserrat'] text-[13px] text-neutral-400">
                          Actualizado: {formatDate(blog.fecha_blog_redaccion)}
                        </time>
                      )}

                      <div className="mt-2">
                        {renderBlogContent(blog.contenido)}
                      </div>
                    </div>
                  </div>
                </article>

                <aside className="lg:col-span-4 lg:self-stretch">
                  {visibleContainerPopUp &&
                    (positionPopUp ? (
                      <div className="relative mt-8">
                        <button
                          onClick={handleClickButtonPopUp}
                          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-black text-white shadow-lg"
                          aria-label="Cerrar"
                        >
                          ×
                        </button>

                        <RightPop />
                      </div>
                    ) : (
                      <div className="mb-6">
                        <RightPop />
                      </div>
                    ))}
                  <div className="space-y-6">
                    <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.05)]">
                      <video
                        className="aspect-video w-full bg-black object-cover rounded-[28px]"
                        src="/assets/video/main-video.mp4"
                        controls
                      />

                      <div className="p-5">
                        <h2 className="!font-['Montserrat'] text-[1.2rem] font-bold tracking-[-0.03em] text-[#111111]">
                          Conoce top.education
                        </h2>

                        <p className="mt-1 font-['Montserrat'] text-sm leading-[1.2em] text-neutral-600">
                          Explora certificaciones, rutas y recursos para seguir creciendo profesionalmente.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.05)]">
                      <h2 className="mb-2 !font-['Montserrat'] text-[1.35rem] font-bold tracking-[-0.03em] text-[#111111]">
                        Te puede interesar
                      </h2>

                      <LatestBlogsGrid />

                      <a
                        href="/explora"
                        className="mt-5 flex w-full items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-center font-['Montserrat'] text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
                      >
                        Explora más certificaciones
                      </a>
                    </div>
                  </div>

                  
                </aside>
              </div>
            )}
          </div>
        </section>
        <section className="relative overflow-hidden bg-white px-4 pb-16 md:pb-24">
          <div className="pointer-events-none absolute left-[-160px] top-20 h-[360px] w-[360px] rounded-full bg-[#1941cf]/5 blur-[110px]" />
          <div className="pointer-events-none absolute bottom-20 right-[-160px] h-[360px] w-[360px] rounded-full bg-[#5CC781]/8 blur-[110px]" />
    
          <div className="relative z-10 mx-auto max-w-[1200px]">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="uppercase tracking-[0.35em] text-[11px] text-[#7B6E63] font-medium">
                  Certificaciones sugeridas
                </span>
    
                <h2 className="!font-['Montserrat'] text-[2.2rem] font-bold leading-[1.05em] text-[#111111] md:text-[2.8rem]">
                  Sigue explorando
                </h2>
    
                <p className="mt-2 max-w-[620px] font-['Montserrat'] text-[1rem] leading-[1.5em] text-neutral-600">
                  Descubre más certificaciones seleccionadas para seguir avanzando en tu ruta de aprendizaje.
                </p>
              </div>
    
              <button
                type="button"
                onClick={handleExploreClick}
                className="inline-flex gap-3 mt-5 items-center justify-center rounded-full bg-[#2563EB] hover:bg-[#463FE8] text-white font-bold px-8 py-4 shadow-[0_18px_45px_rgba(87,80,255,0.35)] transition-all duration-300"
              >
                Ver más certificaciones
                <ArrowRight
                  size={20}
                  strokeWidth={2}
                  className="translate-y-[1px]"
                />
              </button>
            </div>
            <SuggestedCertifications />
          </div>
        </section>
      </main>
    </>
  );
};

export default BlogDetailPage;