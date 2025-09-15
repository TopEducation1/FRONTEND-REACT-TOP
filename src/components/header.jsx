import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import MenuTop from "./MenuTop";
import { FaAnglesLeft } from "react-icons/fa6";

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
  const handleAtras = () => {
    navigateWithTransition(-1); // -1 significa ir una página atrás en el historial
  };
  return (
    <header>
      <nav className="nav-main relative m-auto w-[90vw]  md:w-[60vw] rounded-[36px]  bg-[#1c1c1c] px-4 py-2 backdrop-blur-md md:flex md:items-center md:justify-between md:px-6 md:py-0 lg:px-8 xl:mx-auto">
        <div className="wrapper-logo-nav">
          <button className="!hidden !lg:flex btn-atras items-center text-[#F6F4EF] ml-[-1rem] pr-2 z-50" onClick={handleAtras} title="Volver atrás"><FaAnglesLeft className=" text-[2.3rem]" /></button>
          <button onClick={() => navigateWithTransition('/inicio')}>
            <img src="/assets/logos/TOPEDUCATIONLOGONAV.png" alt="Logo Top.education" className="logo-nav"></img>
          </button>
        </div>
        <div className={`navigation-menu ${isMenuOpen ? "open" : ""}`}>
          <MenuTop toggleMenu={toggleMenu}/>
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
