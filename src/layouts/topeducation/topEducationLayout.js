import React, { useState, useEffect } from "react";
import Header from "../../components/header.jsx";
import "../../index.css";
import Footer from "../../components/Footer.jsx";
import { Outlet, useLocation } from "react-router-dom";



function TopEducationLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    //console.log("Toggle Menu llamado, estado actual:", !isMenuOpen); // Debug
    setIsMenuOpen(!isMenuOpen);
  };

  const openIndexResponsiveMenu = () => {
    //console.log("Abriendo menú, estado actual:", isMenuOpen);
    setIsMenuOpen(true);
    //console.log("Nuevo estado:", true);
  };

  const closeIndexResponsiveMenu = () => {
    //console.log("Cerrando menú"); // Debug
    setIsMenuOpen(false);
  };

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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Debug del estado
  useEffect(() => {
    //console.log("Estado del menú:", isMenuOpen);
  }, [isMenuOpen]);

  const excludedRoutes = ["/explora", "/certificacion"]

  const shouldRenderFooter = !excludedRoutes.some(route => location.pathname.startsWith(route));


  return (
    <>
    <Header
      toggleMenu={toggleMenu}
      openIndexResponsiveMenu={openIndexResponsiveMenu}
      isMenuOpen={isMenuOpen}
    />
    {/*<SmoothScrollProvider />*/}
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
    </>
  );
}

export default TopEducationLayout;
