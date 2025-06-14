import React, { useEffect, useState } from "react";
import MenuTop from "./MenuTop";

const Header = ({ toggleMenu,onTagSelect, openIndexResponsiveMenu, isMenuOpen }) => {

  const host = window.location.hostname;

  return (
    <header className="hidden">
      <nav className="nav-main relative mx-2 w-full rounded-[36px] border border-white/80 bg-[#0F090B] px-4 py-3 backdrop-blur-md dark:border-white-700/80 dark:bg-[#0F090B]/80 dark:backdrop-blur-md md:flex md:items-center md:justify-between md:px-6 md:py-0 lg:px-8 xl:mx-auto">
        <div className="wrapper-logo-nav">
          <a href="/">
            <img src="/assets/logos/TOPEDUCATIONLOGONAV.png" alt="Logo Top.education" className="logo-nav"></img>
          </a>
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
