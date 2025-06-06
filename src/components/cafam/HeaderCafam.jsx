import ResponsiveMenuCafam from "./ResponsiveMenuCafam";
import SearchBarCafam from "./searchBarCafam";
import React, { useState, useEffect } from "react";

const HeaderCafam = () => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed w-full z-10">
        <div className="nav-plataforma bg-plataforma relative mx-2 w-[80%] mt-2 rounded-[36px] border border-white/80 px-4 py-3 backdrop-blur-md dark:border-white-700/80 dark:backdrop-blur-md md:flex md:items-center md:justify-between md:px-6 md:py-0 lg:px-8 xl:mx-auto">
          
          <div className="w-40">
            <a href="/cafam">
              <img src="/assets/cafam/logos/logo-nav.png" className="w-[130px]" alt="Logo Cafam"/>
            </a>
          </div>
          
          <div className="w-[40%]">
            <SearchBarCafam />
          </div>
          <div className="container-burguer-button" onClick={() => { toggleMenu(); }}>
            <span className="burguer-bar" ></span>
          </div>
        </div>
      </nav>
      <ResponsiveMenuCafam 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default HeaderCafam;