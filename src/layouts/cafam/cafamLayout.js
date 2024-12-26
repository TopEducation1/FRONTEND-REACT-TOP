import "../../cafam.css";
import React, { useEffect } from "react";
import HeaderCafam from "../../components/cafam/HeaderCafam";
import { Outlet } from "react-router-dom";


function CafamLayout({ children }) {
    useEffect(() => {
        document.body.classList.add("cafam-layout");

        return () => {
            document.body.classList.remove("cafam-layout");
        };
    }, []);

    return (
        <div>
            <HeaderCafam />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default CafamLayout;