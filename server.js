const path = require("path");
const express = require("express");
const compression = require("compression");
const prerender = require("prerender-node");

const app = express();

const PORT = Number(process.env.PORT || 3000);
const BUILD_PATH = path.join(__dirname, "build");

const DJANGO_URL =
  process.env.DJANGO_URL || "https://app.top.education";

app.disable("x-powered-by");
app.use(compression());

/*
 * ============================================================
 * PRERENDER.IO
 * ============================================================
 */
const prerenderToken = String(
  process.env.PRERENDER_TOKEN || ""
).trim();

if (prerenderToken) {
  app.use(
    prerender
      .set("prerenderToken", prerenderToken)
      .set("protocol", "https")
  );

  console.log("[SEO] Prerender.io habilitado.");
} else {
  console.warn(
    "[SEO] PRERENDER_TOKEN no configurado. " +
      "La aplicación funcionará sin prerendering."
  );
}

/*
 * ============================================================
 * HEALTHCHECK
 * ============================================================
 */
app.get("/health", (_request, response) => {
  response.status(200).json({
    ok: true,
    service: "frontend-react-top",
  });
});

/*
 * ============================================================
 * PROXY DE SITEMAPS
 * ============================================================
 *
 * Django genera los XML en app.top.education.
 * Express los expone públicamente en www.top.education.
 */
const proxySitemap = async (request, response) => {
  try {
    const sitemapUrl =
      `${DJANGO_URL}${request.originalUrl}`;

    const djangoResponse = await fetch(sitemapUrl, {
      headers: {
        Accept: "application/xml,text/xml,*/*",
      },
    });

    if (!djangoResponse.ok) {
      const body = await djangoResponse.text();

      console.error("[SEO] Error obteniendo sitemap", {
        url: sitemapUrl,
        status: djangoResponse.status,
        body: body.slice(0, 500),
      });

      return response
        .status(djangoResponse.status)
        .type("text/plain")
        .send("No se pudo obtener el sitemap.");
    }

    let xml = await djangoResponse.text();

    /*
     * El índice generado por Django puede contener enlaces hacia:
     *
     * https://app.top.education/sitemap-pages.xml
     *
     * Los reemplazamos para que apunten al dominio público.
     */
    xml = xml.replaceAll(
      "https://app.top.education",
      "https://www.top.education"
    );

    return response
      .status(200)
      .set({
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control":
          "public, max-age=300, s-maxage=300",
      })
      .send(xml);
  } catch (error) {
    console.error("[SEO] Error cargando sitemap", {
      url: request.originalUrl,
      message: error?.message,
    });

    return response
      .status(502)
      .type("text/plain")
      .send("Error al consultar el sitemap.");
  }
};

app.get("/sitemap.xml", proxySitemap);
app.get("/sitemap-:section.xml", proxySitemap);

/*
 * ============================================================
 * ARCHIVOS ESTÁTICOS
 * ============================================================
 */
app.use(
  express.static(BUILD_PATH, {
    index: false,
    maxAge: "1d",
  })
);

/*
 * ============================================================
 * CATCH-ALL DE REACT
 * ============================================================
 */
app.use((request, response, next) => {
  if (request.method !== "GET") {
    return next();
  }

  return response.sendFile(
    path.join(BUILD_PATH, "index.html"),
    (error) => {
      if (error) {
        next(error);
      }
    }
  );
});

/*
 * ============================================================
 * MANEJO DE ERRORES
 * ============================================================
 */
app.use((error, request, response, _next) => {
  console.error("[Frontend server error]", {
    method: request.method,
    url: request.originalUrl,
    message: error?.message,
  });

  if (response.headersSent) {
    return;
  }

  response
    .status(500)
    .type("text/plain")
    .send("Internal Server Error");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Frontend React escuchando en 0.0.0.0:${PORT}`
  );
});