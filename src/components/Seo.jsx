import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Top Education";
const SITE_URL = "https://www.top.education";

const DEFAULT_TITLE =
  "Top Education | Certificaciones y rutas de aprendizaje";

const DEFAULT_DESCRIPTION =
  "Descubre certificaciones, cursos y rutas de aprendizaje de universidades y plataformas reconocidas para impulsar tu crecimiento profesional.";

const DEFAULT_IMAGE =
  `${SITE_URL}/assets/logo192.png`;

const normalizePath = (path = "/") => {
  if (!path || path === "/") {
    return "/";
  }

  return `/${String(path).replace(/^\/+|\/+$/g, "")}`;
};

const buildAbsoluteUrl = (value, fallback = SITE_URL) => {
  if (!value) {
    return fallback;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${SITE_URL}${normalizePath(value)}`;
};

const cleanDescription = (value = "") => {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
};

const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  robots = "index, follow",
  noindex = false,
  jsonLd = null,
}) => {
  const pageTitle = title
    ? `${title} | ${SITE_NAME}`
    : DEFAULT_TITLE;

  const pageDescription =
    cleanDescription(description) || DEFAULT_DESCRIPTION;

  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const imageUrl = buildAbsoluteUrl(image, DEFAULT_IMAGE);

  const robotsContent = noindex
    ? "noindex, nofollow"
    : robots;

  const structuredData = Array.isArray(jsonLd)
    ? jsonLd
    : jsonLd
      ? [jsonLd]
      : [];

  return (
    <Helmet prioritizeSeoTags>
      <html lang="es" />

      <title>{pageTitle}</title>

      <meta
        name="description"
        content={pageDescription}
      />

      <meta
        name="robots"
        content={robotsContent}
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      <meta
        property="og:locale"
        content="es_CO"
      />

      <meta
        property="og:type"
        content={type}
      />

      <meta
        property="og:site_name"
        content={SITE_NAME}
      />

      <meta
        property="og:title"
        content={pageTitle}
      />

      <meta
        property="og:description"
        content={pageDescription}
      />
      <meta name="author" content="Top Education" />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:image"
        content={imageUrl}
      />

      <meta
        property="og:image:alt"
        content={pageTitle}
      />

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={pageTitle}
      />

      <meta
        name="twitter:description"
        content={pageDescription}
      />

      <meta
        name="twitter:image"
        content={imageUrl}
      />

      {structuredData.map((schema, index) => (
        <script
          key={`json-ld-${index}`}
          type="application/ld+json"
        >
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;