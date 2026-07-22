import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Seo from "../components/Seo";
import getBlogBySlug from "../services/getBlogBySlug";
import LatestBlogsGrid from "../components/cafam/LatestBlogsGrid";
import SuggestedCertifications from "../components/suggestedCertifications";
import ShareButtons from "../components/ShareButtons";
import RightPop from "../components/RightPop";
import { ArrowRight } from "lucide-react";

const SITE_URL = "https://www.top.education";
const DEFAULT_DESCRIPTION =
  "Explora artículos, guías y recursos educativos para fortalecer tu perfil profesional con Top Education.";

const BlogDetailSkeleton = () => {
  return (
    <main className="bg-white">
      <section className="relative overflow-visible bg-white px-4 pb-8 pt-10 md:pt-16 lg:pb-10 lg:pt-20">
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
    let isMounted = true;

    const loadBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        setBlog(null);
        setVisibleContainerPopUp(true);

        const data = await getBlogBySlug(slug);

        if (!isMounted) return;

        if (!data) {
          throw new Error("No se encontró el recurso solicitado.");
        }

        setBlog(data);
      } catch (loadError) {
        if (!isMounted) return;

        setError(
          loadError?.message ||
            "No se pudo cargar el recurso solicitado."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      loadBlog();
    } else {
      setError("No se especificó el recurso solicitado.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleClickButtonPopUp = () => {
    setVisibleContainerPopUp(false);
  };

  const handleExploreClick = () => {
    navigate("/explora");
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

  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date
      .toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(/\b\w/, (letter) => letter.toUpperCase());
  };

  const toIsoDate = (value) => {
    if (!value) return undefined;

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? undefined
      : date.toISOString();
  };

  const stripHtml = (value = "") => {
    if (!value) return "";

    const text = String(value);

    if (typeof document === "undefined") {
      return text
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;

    return (tempDiv.textContent || tempDiv.innerText || "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const truncateDescription = (value, maxLength = 157) => {
    const cleanValue = stripHtml(value);

    if (!cleanValue) return "";

    if (cleanValue.length <= maxLength) {
      return cleanValue;
    }

    const truncated = cleanValue
      .slice(0, maxLength)
      .replace(/\s+\S*$/, "")
      .trim();

    return `${truncated || cleanValue.slice(0, maxLength).trim()}...`;
  };

  const isSafeUrl = (value) => {
    if (!value) return false;

    try {
      const parsed = new URL(value, window.location.origin);

      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const sanitizeBlogHtml = (content) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    tempDiv
      .querySelectorAll("script, iframe, object, embed, form")
      .forEach((element) => element.remove());

    tempDiv.querySelectorAll("*").forEach((element) => {
      [...element.attributes].forEach((attribute) => {
        const attributeName = attribute.name.toLowerCase();
        const attributeValue = attribute.value;

        if (attributeName.startsWith("on")) {
          element.removeAttribute(attribute.name);
          return;
        }

        if (
          ["href", "src", "action", "formaction"].includes(attributeName) &&
          /^\s*javascript:/i.test(attributeValue)
        ) {
          element.removeAttribute(attribute.name);
        }
      });
    });

    return tempDiv;
  };

  const renderBlogContent = (content) => {
    if (!content || !blog) return null;

    const tempDiv = sanitizeBlogHtml(content);
    const links = tempDiv.querySelectorAll("a");

    links.forEach((link) => {
      const linkText = (link.textContent || "").trim();
      const url = link.getAttribute("href");

      if (
        linkText.startsWith("CTA") &&
        isValidValue(blog.url_img_cta) &&
        isSafeUrl(url)
      ) {
        const text =
          linkText.replace(/^CTA/i, "").trim() ||
          blog.nombre_blog ||
          "Ver más información";

        const ctaLink = document.createElement("a");
        ctaLink.href = url;
        ctaLink.target = "_blank";
        ctaLink.rel = "noopener noreferrer";

        const ctaImage = document.createElement("img");
        ctaImage.src = blog.url_img_cta;
        ctaImage.alt = text;
        ctaImage.loading = "lazy";
        ctaImage.decoding = "async";
        ctaImage.style.cursor = "pointer";

        ctaLink.appendChild(ctaImage);
        link.replaceWith(ctaLink);
        return;
      }

      if (isSafeUrl(url)) {
        const parsed = new URL(url, window.location.origin);
        const isExternal = parsed.origin !== window.location.origin;

        if (isExternal) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
      } else if (url) {
        link.removeAttribute("href");
      }
    });

    tempDiv.querySelectorAll("img").forEach((image) => {
      image.loading = "lazy";
      image.decoding = "async";

      if (!image.alt) {
        image.alt = blog.nombre_blog || "Imagen del recurso";
      }
    });

    return (
      <div
        className="blog-content max-w-none font-['Montserrat'] text-[14px] leading-[1.5em] text-neutral-700
          [&_h1]:font-['Montserrat'] [&_h2]:font-['Montserrat'] [&_h3]:font-['Montserrat'] [&_h4]:font-['Montserrat']
          [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h4]:font-bold
          [&_h2]:mt-10 [&_h2]:text-[1.8rem] [&_h2]:leading-[1.2em] [&_h3]:text-[1.35rem]
          [&_p]:my-0 [&_a]:font-bold [&_a]:text-[#1941cf] [&_a]:no-underline hover:[&_a]:underline
          [&_img]:rounded-[24px] [&_img]:border [&_img]:border-black/10 [&_img]:shadow-[0_18px_60px_rgba(0,0,0,0.06)]
          [&_ul]:my-2 [&_li]:my-1"
        dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }}
      />
    );
  };

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (error || !blog) {
    return (
      <>
        <Seo
          title="Recurso no encontrado"
          description="El recurso solicitado no se encuentra disponible."
          canonicalPath={`/recursos/${slug || ""}`}
          robots="noindex, nofollow"
        />

        <main className="flex min-h-screen items-center justify-center bg-white px-4 py-32">
          <div
            role="alert"
            className="max-w-[620px] rounded-[24px] border border-red-100 bg-red-50 px-6 py-6 text-center font-['Montserrat'] text-sm font-medium text-red-600"
          >
            <p className="font-bold">No se pudo cargar este recurso.</p>

            <p className="mt-2 text-red-500">
              {error || "El recurso solicitado no se encuentra disponible."}
            </p>

            <Link
              to="/recursos"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-black"
            >
              Volver a recursos
            </Link>
          </div>
        </main>
      </>
    );
  }

  const canonicalSlug = blog.slug || slug;
  const canonicalPath = `/recursos/${canonicalSlug}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  const seoTitle =
    blog.nombre_blog || "Recurso educativo";

  const seoDescription =
    truncateDescription(blog.metadescripcion_blog) ||
    truncateDescription(blog.contenido) ||
    DEFAULT_DESCRIPTION;

  const seoImage = isValidValue(blog.miniatura_blog)
    ? blog.miniatura_blog
    : undefined;

  const publishedTime = toIsoDate(blog.fecha_redaccion_blog);

  const modifiedTime = toIsoDate(
    blog.fecha_actualizacion_blog ||
      blog.fecha_blog_redaccion ||
      blog.updated_at
  );

  const authorName =
    blog.autor_blog_id ||
    blog.autor_blog?.nombre ||
    blog.autor_blog?.name ||
    "Top Education";

  const categoryName =
    blog.categoria_blog_id ||
    blog.categoria_blog?.nombre ||
    undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: seoTitle,
    description: seoDescription,
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    author: {
      "@type": authorName === "Top Education" ? "Organization" : "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Top Education",
      url: SITE_URL,
    },
    ...(seoImage ? { image: [seoImage] } : {}),
    ...(publishedTime ? { datePublished: publishedTime } : {}),
    ...(modifiedTime ? { dateModified: modifiedTime } : {}),
    ...(categoryName ? { articleSection: categoryName } : {}),
    ...(isValidValue(blog.palabra_clave_blog)
      ? { keywords: blog.palabra_clave_blog }
      : {}),
  };

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        canonicalPath={canonicalPath}
        image={seoImage}
        type="article"
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        author={authorName}
        jsonLd={jsonLd}
      />

      <main className="bg-white">
        <section className="relative overflow-hidden bg-white px-2 pb-8 pt-10 md:px-4 md:pb-8 md:pt-16 lg:pb-10 lg:pt-20">
          <div className="pointer-events-none absolute left-[-160px] top-20 h-[360px] w-[360px] rounded-full bg-[#1941cf]/5 blur-[110px]" />
          <div className="pointer-events-none absolute bottom-20 right-[-160px] h-[360px] w-[360px] rounded-full bg-[#5CC781]/8 blur-[110px]" />

          <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 gap-5 lg:grid-cols-12">
            <article className="lg:col-span-8">
              <div className="overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
                {seoImage && (
                  <div className="relative">
                    <img
                      src={seoImage}
                      alt={seoTitle}
                      className="h-[260px] w-full object-cover md:h-[420px]"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />

                    {categoryName && (
                      <span className="absolute left-5 top-5 rounded-full bg-[#1941cf] px-4 py-1.5 font-['Montserrat'] text-[12px] font-bold uppercase tracking-[0.05em] text-white shadow-[0_12px_30px_rgba(87,80,255,0.22)]">
                        {categoryName}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-4 lg:p-8">
                  <h1 className="!font-['Montserrat'] !text-[2rem] font-bold leading-[1.08em] text-[#111111] md:text-[2.7rem]">
                    {seoTitle}
                  </h1>

                  {isValidValue(blog.metadescripcion_blog) && (
                    <p className="mt-3 max-w-[760px] font-['Montserrat'] text-[1rem] font-medium leading-[1.5em] text-neutral-600 md:text-[1.08rem]">
                      {blog.metadescripcion_blog}
                    </p>
                  )}

                  <div className="mt-4 flex flex-col gap-5 border-y border-black/10 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      {isValidValue(blog.autor_blog?.auto_img) && (
                        <figure className="h-12 w-12 overflow-hidden rounded-full border border-black/10 bg-neutral-100">
                          <img
                            className="h-full w-full object-cover"
                            src={blog.autor_blog.auto_img}
                            alt={authorName}
                            loading="lazy"
                            decoding="async"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        </figure>
                      )}

                      <div className="flex flex-col">
                        <span className="font-['Montserrat'] text-[15px] font-bold leading-[1em] text-black">
                          {authorName}
                        </span>

                        {publishedTime && (
                          <time
                            dateTime={publishedTime}
                            className="font-['Montserrat'] text-[13px] text-neutral-500"
                          >
                            Publicado el {formatDate(blog.fecha_redaccion_blog)}
                          </time>
                        )}
                      </div>
                    </div>

                    <ShareButtons
                      url={canonicalUrl}
                      title={seoTitle}
                    />
                  </div>

                  {modifiedTime && (
                    <time
                      dateTime={modifiedTime}
                      className="mt-4 block font-['Montserrat'] text-[13px] text-neutral-400"
                    >
                      Actualizado:{" "}
                      {formatDate(
                        blog.fecha_actualizacion_blog ||
                          blog.fecha_blog_redaccion ||
                          blog.updated_at
                      )}
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
                      type="button"
                      onClick={handleClickButtonPopUp}
                      className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-black text-white shadow-lg"
                      aria-label="Cerrar recomendación"
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
                    className="aspect-video w-full rounded-[28px] bg-black object-cover"
                    src="/assets/video/main-video.mp4"
                    controls
                    preload="metadata"
                    aria-label="Video de presentación de Top Education"
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

                  <Link
                    to="/explora"
                    className="mt-5 flex w-full items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-center font-['Montserrat'] text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
                  >
                    Explora más certificaciones
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white px-4 pb-16 md:pb-24">
          <div className="pointer-events-none absolute left-[-160px] top-20 h-[360px] w-[360px] rounded-full bg-[#1941cf]/5 blur-[110px]" />
          <div className="pointer-events-none absolute bottom-20 right-[-160px] h-[360px] w-[360px] rounded-full bg-[#5CC781]/8 blur-[110px]" />

          <div className="relative z-10 mx-auto max-w-[1200px]">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#7B6E63]">
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
                className="mt-5 inline-flex items-center justify-center gap-3 rounded-full bg-[#2563EB] px-8 py-4 font-bold text-white shadow-[0_18px_45px_rgba(87,80,255,0.35)] transition-all duration-300 hover:bg-[#463FE8]"
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