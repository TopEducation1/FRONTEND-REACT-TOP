import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Top Education";
const SITE_URL = "https://www.top.education";

const DEFAULT_TITLE =
  "Top Education | Certificaciones y rutas de aprendizaje";

const DEFAULT_DESCRIPTION =
  "Descubre certificaciones, cursos y rutas de aprendizaje de universidades y plataformas reconocidas para impulsar tu crecimiento profesional.";

const DEFAULT_IMAGE =
  `${SITE_URL}/assets/seo/top-education-og.jpg`;

const TWITTER_SITE = "@TopEducation";

const normalizePath = (path = "/") => {
  if (!path || path === "/") {
    return "/";
  }

  return `/${String(path).replace(/^\/+|\/+$/g, "")}`;
};

const buildAbsoluteUrl = (
  value,
  fallback = SITE_URL
) => {
  if (!value) {
    return fallback;
  }

  const cleanValue = String(value).trim();

  if (/^https?:\/\//i.test(cleanValue)) {
    return cleanValue;
  }

  return `${SITE_URL}${normalizePath(cleanValue)}`;
};

const cleanDescription = (
  value = "",
  maxLength = 160
) => {
  const cleanValue = String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (cleanValue.length <= maxLength) {
    return cleanValue;
  }

  const truncated = cleanValue
    .slice(0, maxLength)
    .replace(/\s+\S*$/, "")
    .trim();

  return truncated || cleanValue.slice(0, maxLength);
};

const buildPageTitle = (title) => {
  if (!title) {
    return DEFAULT_TITLE;
  }

  const cleanTitle = String(title).trim();

  const alreadyContainsSiteName =
    cleanTitle
      .toLowerCase()
      .includes(SITE_NAME.toLowerCase()) ||
    cleanTitle
      .toLowerCase()
      .includes("top.education");

  return alreadyContainsSiteName
    ? cleanTitle
    : `${cleanTitle} | ${SITE_NAME}`;
};

const normalizeDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date.toISOString();
};

const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = "/",
  image = DEFAULT_IMAGE,
  imageAlt,
  imageWidth = 1200,
  imageHeight = 630,
  type = "website",
  robots = "index, follow",
  noindex = false,
  jsonLd = null,
  publishedTime = null,
  modifiedTime = null,
  author = SITE_NAME,
  section = null,
  keywords = null,
}) => {
  const pageTitle = buildPageTitle(title);

  const pageDescription =
    cleanDescription(description) ||
    DEFAULT_DESCRIPTION;

  const canonicalUrl =
    buildAbsoluteUrl(canonicalPath);

  const imageUrl =
    buildAbsoluteUrl(image, DEFAULT_IMAGE);

  const finalImageAlt =
    imageAlt || pageTitle;

  const robotsContent = noindex
    ? "noindex, nofollow"
    : robots;

  const normalizedPublishedTime =
    normalizeDate(publishedTime);

  const normalizedModifiedTime =
    normalizeDate(modifiedTime);

  const structuredData = Array.isArray(jsonLd)
    ? jsonLd.filter(Boolean)
    : jsonLd
      ? [jsonLd]
      : [];

  const isArticle = type === "article";

  return (
    <Helmet prioritizeSeoTags>
      <html lang="es-CO" />

      <title>{pageTitle}</title>

      <meta
        name="description"
        content={pageDescription}
      />

      <meta
        name="robots"
        content={robotsContent}
      />

      <meta
        name="googlebot"
        content={robotsContent}
      />

      <meta
        name="author"
        content={author || SITE_NAME}
      />

      {keywords && (
        <meta
          name="keywords"
          content={
            Array.isArray(keywords)
              ? keywords.join(", ")
              : keywords
          }
        />
      )}

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

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:image"
        content={imageUrl}
      />

      <meta
        property="og:image:secure_url"
        content={imageUrl}
      />

      <meta
        property="og:image:alt"
        content={finalImageAlt}
      />

      {imageWidth && (
        <meta
          property="og:image:width"
          content={String(imageWidth)}
        />
      )}

      {imageHeight && (
        <meta
          property="og:image:height"
          content={String(imageHeight)}
        />
      )}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:site"
        content={TWITTER_SITE}
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

      <meta
        name="twitter:image:alt"
        content={finalImageAlt}
      />

      {isArticle && normalizedPublishedTime && (
        <meta
          property="article:published_time"
          content={normalizedPublishedTime}
        />
      )}

      {isArticle && normalizedModifiedTime && (
        <meta
          property="article:modified_time"
          content={normalizedModifiedTime}
        />
      )}

      {isArticle && author && (
        <meta
          property="article:author"
          content={author}
        />
      )}

      {isArticle && section && (
        <meta
          property="article:section"
          content={section}
        />
      )}

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