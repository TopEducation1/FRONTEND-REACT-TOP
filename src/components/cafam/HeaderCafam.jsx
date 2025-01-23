import SearchBarCafam from './searchBarCafam'
import React, { useState, useEffect, useCallback } from "react";


const HeaderCafam = () => {

    const [isMobileView, setIsMobileView] = useState(false); // Tracks mobile view state


    return (
        <>

                <nav id="nav-cafam">
                    <div id="wrapper-logo-cafam">
                        <img src="/assets/cafam/logos/logo-nav.png"/>
                    </div>
                    <div id="wrapper-search-cafam">
                        <SearchBarCafam />
                    </div>
                </nav>

        </>


    );
};

export default HeaderCafam;