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

  const pathname = location.pathname;

  const isAccountPage = pathname.startsWith("/account");
  const isStartNowPage = pathname.startsWith("/empieza-ahora");

  const hideHeader = isAccountPage;
  const hideFooter =
    isAccountPage ||
    pathname.startsWith("/certificacion");

  const hideMenuTop = isStartNowPage;

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const openIndexResponsiveMenu = () => setIsMenuOpen(true);
  const closeIndexResponsiveMenu = () => setIsMenuOpen(false);

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

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.remove("lenis-stopped");

    const lenis = lenisRef.current;
    if (lenis?.start) {
      lenis.start();
      if (lenis.scrollTo) lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis?.start || !lenis?.stop) return;

    if (isMenuOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isMenuOpen]);

  const pageKey = pathname.split("/").filter(Boolean)[0] || "home";

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.12,
        smoothWheel: true,
        smoothTouch: true,
        syncTouch: true,
        gestureOrientation: "vertical",
        touchMultiplier: 1.2,
        wheelMultiplier: 1,
      }}
    >
      <div className={`page page-${pageKey}`}>
        {!hideHeader && (
          <Header
            toggleMenu={toggleMenu}
            openIndexResponsiveMenu={openIndexResponsiveMenu}
            isMenuOpen={isMenuOpen}
            hideMenuTop={hideMenuTop}
          />
        )}

        <main>
          <Outlet
            context={{
              isMenuOpen,
              openIndexResponsiveMenu,
              closeIndexResponsiveMenu,
            }}
          />
        </main>

        {!hideFooter && <Footer />}
      </div>
    </ReactLenis>
  );
}

export default TopEducationLayout;