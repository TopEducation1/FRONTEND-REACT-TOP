const path = require("path");
const express = require("express");
const compression = require("compression");
const prerender = require("prerender-node");

const app = express();

const PORT = Number(process.env.PORT || 3000);
const BUILD_PATH = path.join(__dirname, "build");

app.disable("x-powered-by");
app.use(compression());

/*
 * ============================================================
 * PRERENDER.IO
 * ============================================================
 *
 * Si no hay token, React seguirá funcionando normalmente.
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
 *
 * Se usa app.use en lugar de app.get("*") para mantener
 * compatibilidad con Express 4 y Express 5.
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