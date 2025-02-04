import "../../cafam.css";
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import HeaderCafam from "../../components/cafam/HeaderCafam";

function CafamLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Agregar clase al body
        document.body.classList.add("cafam-layout");

        // Asegurar que estamos en una ruta de Cafam
        if (!location.pathname.startsWith('/cafam')) {
            navigate('/cafam', { replace: true });
        }

        return () => {
            document.body.classList.remove("cafam-layout");
        };
    }, [location, navigate]);

    // Prevenir la pérdida de contexto en recargas
    useEffect(() => {
        const handleBeforeUnload = () => {
            sessionStorage.setItem('lastCafamPath', location.pathname);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Restaurar la última ruta conocida de Cafam si existe
        const lastPath = sessionStorage.getItem('lastCafamPath');
        if (lastPath && location.pathname === '/') {
            navigate(lastPath, { replace: true });
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [location.pathname, navigate]);

    return (
        <div className="cafam-root-layout">
            <HeaderCafam />
            <Outlet />
        </div>
    );
}

export default CafamLayout;