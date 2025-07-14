import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import MenuTop from "./MenuTop";

const Header = ({ toggleMenu,onTagSelect, openIndexResponsiveMenu, isMenuOpen }) => {

  const navigate = useNavigate();

  // ✅ Función de transición segura
  const navigateWithTransition = (url) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(url));
    } else {
      navigate(url);
    }
  };
  return (
    <header>
      <nav className="nav-main relative m-auto w-[90vw] lg:w-[55vw] rounded-[36px]  bg-[#1c1c1c] px-4 py-2 backdrop-blur-md md:flex md:items-center md:justify-between md:px-6 md:py-0 lg:px-8 xl:mx-auto">
        <div className="wrapper-logo-nav">
          <button onClick={() => navigateWithTransition('/inicio')}>
            <img src="/assets/logos/TOPEDUCATIONLOGONAV.png" alt="Logo Top.education" className="logo-nav"></img>
          </button>
        </div>
        <div className={`navigation-menu ${isMenuOpen ? "open" : ""}`}>
          <MenuTop/>
        </div>
        <div className="container-burguer-button" onClick={() => {
              toggleMenu();
            }}>
          <span className="burguer-bar" ></span>
        </div>
      </nav>
        
    </header>
  );
};
export default Header;
