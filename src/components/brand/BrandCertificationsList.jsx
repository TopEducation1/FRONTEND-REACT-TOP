import React, { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";

// Uso de memo => Evita re-render innecesario si las props no cambian
const BrandCertificationsList = memo(({ certifications }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(path);
      });
    } else {
      navigate(path);
    }
  }

  const handleImageError = (e) => {
    console.error("Error loading image:", e.target.src);
    e.target.style.opacity = "0.5";
    e.target.style.backgroundColor = "#f0f0f0";
  };

  const handleCertificationClick = (certification) => {
    try {
      if (!certification) {
        throw new Error("No certification data provided");
      }
      const path = `/certificacion/${certification.plataforma_certificacion.nombre.toLowerCase()}/${certification.slug}`;
      navigateWithTransition(path);
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Error al navegar a la certificación");
    }
  };

  const getImageUrl = useCallback((url) => {
    if (!url) return null;
    return url.startsWith("/") ? url : `/${url}`;
  }, []);

  if (!Array.isArray(certifications)) {
    return (
      <div className="error-message">
        Error: No se pudieron cargar las certificaciones
      </div>
    );
  }

  return (
    <>
      {error && <div className="error-message">{error}</div>}

      {/* 
        👇 wrapper específico para marca blanca.
        Puedes usar esta clase para que ocupe TODA la fila sin dejar espacio para sidebar.
      */}
      <div className="wrapper-certifications brand-wrapper-certifications">
        {certifications.map((certification) => {
          const isMasterclass =
            certification.plataforma_certificacion_id === 3;

          const cardClass = isMasterclass
            ? "certification-card brand-certification-card brand-card-masterclass"
            : "certification-card brand-certification-card";

          return (
            <div
              onClick={() => handleCertificationClick(certification)}
              key={certification.id}
              className={cardClass}
            >
              <div className="container-img-card brand-container-img-card">
                <img
                  src={getImageUrl(
                    certification.universidad_certificacion?.univ_img ||
                      certification.empresa_certificacion?.empr_img ||
                      certification.imagen_final
                  )}
                  alt="imagen-certificacion"
                  onError={handleImageError}
                />
              </div>

              <div className="tags-card brand-tags-card">
                <div
                  className={`tag-category ${
                    certification.tema_certificacion?.tem_col || "tag-verde"
                  }`}
                >
                  {certification.tema_certificacion?.nombre ||
                    "Sin categoría"}
                </div>
              </div>

              <div className="title-certification brand-title-certification">
                <h3>{certification.nombre}</h3>
                {isMasterclass && (
                  <p className="masterclass-description">
                    {certification.descripcion || ""}
                  </p>
                )}
              </div>

              <div className="tag-platform brand-tag-platform">
                <img
                  src={certification.plataforma_certificacion.plat_img}
                  alt={certification.plataforma_certificacion.nombre}
                  onError={handleImageError}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
});

export default BrandCertificationsList;
