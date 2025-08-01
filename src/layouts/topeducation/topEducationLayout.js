import React, { useState, useEffect } from "react";
import Header from "../../components/header.jsx";
import "../../index.css";
import Footer from "../../components/Footer.jsx";
import { Outlet, useLocation } from "react-router-dom";
import Lenis from "@studio-freight/lenis";

function TopEducationLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openIndexResponsiveMenu = () => {
    setIsMenuOpen(true);
  };

  const closeIndexResponsiveMenu = () => {
    setIsMenuOpen(false);
  };

  // Script externo
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//js.hs-scripts.com/45381980.js";
    script.async = true;
    script.id = "hs-script-loader";
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById("hs-script-loader");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);
  useEffect(() => {
  window.scrollTo(0, 0);
}, [location.pathname]); // Solo cuando cambia de ruta
  
  // Simulación de carga
  useEffect(() => {
    window.scrollTo(0,0);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // 🚀 Scroll suave con Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smooth: true,
      smoothTouch: true,
    });
    window.lenis = lenis; // ✅ accesible globalmente

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy(); // Limpieza al desmontar
    };
  }, []);

  const excludedRoutes = [ "/certificacion"];
  const shouldRenderFooter = !excludedRoutes.some(route =>
    location.pathname.startsWith(route)
  );
  const pathSegments = location.pathname.split("/").filter(Boolean); // elimina los vacíos
  const pageKey = pathSegments[0] || "home"; // fallback si es la raíz "/"

  return (
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
  );
}

export default TopEducationLayout;
