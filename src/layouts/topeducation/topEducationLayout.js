// Layout.jsx
import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/header.jsx";
import "../../index.css";
import Footer from "../../components/Footer.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { ReactLenis } from "@studio-freight/react-lenis";

function TopEducationLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const lenisRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const openIndexResponsiveMenu = () => setIsMenuOpen(true);
  const closeIndexResponsiveMenu = () => setIsMenuOpen(false);

  // HubSpot script (ok)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//js.hs-scripts.com/45381980.js";
    script.async = true;
    script.id = "hs-script-loader";
    document.body.appendChild(script);
    return () => {
      const s = document.getElementById("hs-script-loader");
      if (s) s.remove();
    };
  }, []);

  // Llevar al top en cambio de ruta (está bien)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 🔧 Clave: en cambio de ruta, asegúrate de que Lenis esté arrancado
  useEffect(() => {
    // quita cualquier lock residual
    document.documentElement.classList.remove("lenis-stopped");
    // si la ref existe, arranca y resetea al tope
    const lenis = lenisRef.current;
    if (lenis && lenis.start) {
      lenis.start();
      // reseteo inmediato para evitar saltos
      if (lenis.scrollTo) lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname]);

  // Opcional: si abres un menú/overlay que no debe scroll,
  // puedes parar/arrancar Lenis aquí:
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis || !lenis.start || !lenis.stop) return;
    if (isMenuOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isMenuOpen]);

  const excludedRoutes = ["/certificacion"];
  const shouldRenderFooter = !excludedRoutes.some((r) =>
    location.pathname.startsWith(r)
  );
  const pageKey = (location.pathname.split("/").filter(Boolean)[0] || "home");

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.12,
        smoothWheel: true,
        // 👇 habilita scroll táctil en mobile
        smoothTouch: true,
        syncTouch: true,             // sincroniza con scroll nativo
        gestureOrientation: "vertical",
        touchMultiplier: 1.2,        // sensibilidad
        wheelMultiplier: 1,          // rueda/trackpad
      }}
    >
      <div className={`page page-${pageKey}`}>
        <Header
          toggleMenu={toggleMenu}
          openIndexResponsiveMenu={openIndexResponsiveMenu}
          isMenuOpen={isMenuOpen}
        />
        <main>
          <Outlet
            context={{
              isMenuOpen,
              openIndexResponsiveMenu,
              closeIndexResponsiveMenu,
            }}
          />
        </main>
        {shouldRenderFooter && <Footer />}
      </div>
    </ReactLenis>
  );
}

export default TopEducationLayout;
