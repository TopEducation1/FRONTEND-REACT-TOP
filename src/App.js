import React, { useEffect } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from "react-router-dom";
import CertificationPage from "./pages/certificationPage";
import LibraryPage from "./pages/library";
import CertificationPageCafam from "./pages/cafam/certificationPageCafam.js";
import HomePage from "./pages/home";
import HomeCafam from "./pages/cafam/homeCafam.jsx";
import Blog from "./pages/blog.jsx";
import TopEducationLayout from "./layouts/topeducation/topEducationLayout.js";
import CafamLayout from "./layouts/cafam/cafamLayout.js";
import ParaEquipos from "./pages/paraEquipos.jsx";
import StartNow from "./pages/startNow.jsx";
import EdxCertificationPage from "./pages/EdxCertificationPage.jsx";
import MasterclassCertificationPage from "./pages/MasterclassCertificationPage.jsx";


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
                  <Route path="certificacion/:id" element={<CertificationPageCafam />} />
                  {/* Capturar todas las subrutas de cafam no definidas */}
                  <Route path="*" element={<Navigate to="/cafam" replace />} />
              </Route>

              {/* Rutas principales */}
              <Route element={<TopEducationLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/certificacion/masterclass/:id" element={<MasterclassCertificationPage />} />
                  <Route path="/certificacion/edx/:id" element={<EdxCertificationPage />} />
                  <Route path="/certificacion/coursera/:id" element={<CertificationPage />} />
                  <Route path="/certificacion/:id" element={<CertificationPage />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/para-equipos" element={<ParaEquipos />} />
                  <Route path="/empieza-ahora" element={<StartNow />} />
              </Route>

              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </Router>
  );
}

export default App;