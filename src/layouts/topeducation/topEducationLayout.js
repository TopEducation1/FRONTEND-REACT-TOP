  import React, { useState, useEffect } from "react";
  import LoadingPage from "../../components/LoadingPage.jsx";
  import Header from "../../components/header.jsx";
  import Footer from "../../components/Footer.jsx";
  import { Outlet } from "react-router-dom";
  import "../../index.css";

  function TopEducationLayout() {
    // Estado para controlar si se está cargando
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false); 
      }, 3000);

      return () => clearTimeout(timer); 
    }, []);

    return (
      <>
        {isLoading && <LoadingPage />}
        <div className={isLoading ? "content-hidden" : "content-visible"}>
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      </>
    );
  }

  export default TopEducationLayout;
