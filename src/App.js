import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import CertificationPage from "./pages/certificationPage";


import { usePageLoading } from "./hooks/usePageLoading";


import Header from "./components/header.jsx"

import LoadingPage from "./components/LoadingPage.jsx";
// Componente del encabezado

// Página de la biblioteca
import LibraryPage from "./pages/library";

// Página de inicio
import HomePage from "./pages/home";

// Pagina de blog
import Blog from "./pages/blog.jsx";

// Componente footer
import Footer from "./components/Footer.jsx";


function App() {

  useEffect(() => {
    document.title = "Top Education";
  }, []);

  const isLoading = usePageLoading();
  return (
    <Router>
      {isLoading && <LoadingPage />}
      <div className={isLoading ? 'content-hidden' : 'content-visible'}>
          <Header />
          <Routes>
            
            <Route path="/" element={<HomePage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/certificacion/:id" element={<CertificationPage />} />
            <Route path="/blog/" element={<Blog />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;