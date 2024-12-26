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

function App() {
  useEffect(() => {
    document.title = "Top Education";
  }, []);

  return (
    <Router>
      <Routes>
        {/* Routes using TopEducationLayout */}
        <Route element={<TopEducationLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/certificacion/:id" element={<CertificationPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/para-equipos" element={<ParaEquipos />} />
          <Route path="/empieza-ahora" element={<StartNow />} />
        </Route>

        {/* Routes using CafamLayout */}
        <Route path="/cafam" element={<CafamLayout />}>
          <Route index element={<HomeCafam />} />
          <Route path="certificacion/:id" element={<CertificationPageCafam />} />
        </Route>

        {/* Optional: Redirect to default route if no match */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;