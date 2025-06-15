import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  
} from "react-router-dom";

import CertificationPage from "./pages/certificationPage";
import LibraryPage from "./pages/library";
import CertificationPageCafam from "./pages/cafam/certificationPageCafam";
import HomePage from "./pages/home";
import HomeCafam from "./pages/cafam/homeCafam.jsx";
import Blog from "./pages/blog.jsx";
import TopEducationLayout from "./layouts/topeducation/topEducationLayout.js";
import CafamLayout from "./layouts/cafam/cafamLayout.js";
import ParaEquipos from "./pages/paraEquipos.jsx";
import StartNow from "./pages/startNow.jsx";
import RutasConocimiento from "./pages/RutasConocimiento.jsx";
import BlogDetailPage from "./pages/BlogDetailPage.jsx";

function App() {
  useEffect(() => {
    document.title = "Top Education";
  }, []);

  return (
    <Router>
      <Routes>
        {/* Rutas de Cafam - Con mejor manejo de subrutas */}
        <Route path="/cafam" element={<CafamLayout />}>
          <Route index element={<HomeCafam />} />
          <Route path="certificacion">
            <Route path="edx/:slug" element={<CertificationPageCafam />} />
            <Route path="coursera/:slug" element={<CertificationPageCafam />} />
            <Route
              path="masterclass/:slug"
              element={<CertificationPageCafam />}
            />
          </Route>
          <Route path="/cafam/certificacion/:slug" element={<CertificationPageCafam />} />
          {/* Capturar todas las subrutas de cafam no definidas */}
          <Route path="*" element={<Navigate to="/cafam" replace />} />
        </Route>

        {/* Rutas principales */}
        <Route element={<TopEducationLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explora" element={<LibraryPage />} />
          <Route path="/explora/filter" element={<LibraryPage />} />
          <Route path="/recursos/:slug" element={<BlogDetailPage />} />
          <Route
            path="/certificacion/masterclass/:slug"
            element={<CertificationPage/>}
          />
          <Route
            path="/certificacion/edx/:slug"
            element={<CertificationPage />}
          />
          <Route
            path="/certificacion/coursera/:slug"
            element={<CertificationPage />}
          />
          <Route path="/certificacion/:slug" element={<CertificationPage />} />
          <Route path="/recursos" element={<Blog />} />
          <Route path="/para-equipos" element={<ParaEquipos />} />
          <Route path="/empieza-ahora" element={<StartNow />} />
          <Route
            path="/rutas-del-conocimiento"
            element={<RutasConocimiento />}
          />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
