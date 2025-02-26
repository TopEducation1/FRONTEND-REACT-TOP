import ResponsiveMenuCafam from "./ResponsiveMenuCafam";
import SearchBarCafam from "./searchBarCafam";
import React, { useState, useEffect } from "react";

const HeaderCafam = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav id="nav-cafam">
        {/* Botón hamburguesa */}
        <div className="container-burguer-button">
          <svg
            onClick={() => setIsMenuOpen(true)}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 6l16 0" />
            <path d="M4 12l16 0" />
            <path d="M4 18l16 0" />
          </svg>
        </div>
        
        <div id="wrapper-logo-cafam">
          <a href="/cafam">
            <img src="/assets/cafam/logos/logo-nav.png" alt="Logo cafam nav bar"/>
          </a>
        </div>
        
        <div id="wrapper-search-cafam">
          <SearchBarCafam />
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