import React, { useState, memo } from "react";
import { useNavigate } from "react-router-dom";

const CertificationsList = memo(({ certifications }) => {
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

      const plataformaSlug =
        certification?.plataforma_certificacion?.nombre?.toLowerCase() || "certificacion";

      const path = `/certificacion/${plataformaSlug}/${certification.slug}`;
      navigateWithTransition(path);
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Error al navegar a la certificación");
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    return url;
  };

  const getPrimaryTheme = (certification) => {
    return certification?.tema_certificacion || null;
  };

  const getPrimarySkill = (certification) => {
    if (certification?.primary_skill) return certification.primary_skill;

    if (!Array.isArray(certification?.skills) || certification.skills.length === 0) {
      return null;
    }

    return certification.skills[0];
  };

  if (!Array.isArray(certifications)) {
    return <div className="error-message">Error: No se pudieron cargar las certificaciones</div>;
  }

  return (
    <>
      {error && <div className="error-message">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-2">
        {certifications.map((certification) => {
          const primaryTheme = getPrimaryTheme(certification);
          const primarySkill = getPrimarySkill(certification);

          const certificationImage =
            certification.imagen_final ||
            certification.universidad_certificacion?.univ_img ||
            certification.empresa_certificacion?.empr_img;

          const institutionImage =
            certification.universidad_certificacion?.univ_img ||
            certification.empresa_certificacion?.empr_img;

          const platformImage = certification.plataforma_certificacion?.plat_img;

          if (certification.plataforma_certificacion_id === 3) {
            return (
              <div
                onClick={() => handleCertificationClick(certification)}
                key={certification.id}
                className="certification-card grid grid-cols-1 content-between bg-[#f6f4ef] rounded-xl cursor-pointer overflow-hidden"
              >
                <div className="container-img-card">
                  <img
                    src={getImageUrl(certificationImage)}
                    alt={certification.nombre || "imagen-certificacion"}
                    onError={handleImageError}
                  />
                </div>

                <div className="tags-card flex flex-wrap gap-2 p-3 pb-0">
                  {primarySkill ? (
                    <div className={`tag-category ${primarySkill?.skill_col || "tag-verde"}`}>
                      {primarySkill.translate || primarySkill.nombre}
                    </div>
                  ) : primaryTheme ? (
                    <div className={`tag-category ${primaryTheme?.tem_col || "tag-verde"}`}>
                      {primaryTheme?.translate || primaryTheme?.nombre}
                    </div>
                  ) : null}
                </div>

                <div className="title-certification p-3">
                  <h3>{certification.nombre}</h3>
                  <p className="masterclass-description">
                    {certification.descripcion || ""}
                  </p>
                </div>

                <div className="flex justify-between items-center px-3 pb-3 gap-2">
                  <div className="tag-uem">
                    {institutionImage && (
                      <img
                        src={getImageUrl(institutionImage)}
                        alt="institucion"
                        onError={handleImageError}
                      />
                    )}
                  </div>

                  <div className="tag-platform">
                    {platformImage && (
                      <img
                        src={platformImage}
                        alt={certification.plataforma_certificacion?.nombre || "plataforma"}
                        onError={handleImageError}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              onClick={() => handleCertificationClick(certification)}
              key={certification.id}
              className="certification-card grid grid-cols-1 content-between bg-[#F2F0E8] border-1 border-[#ECECEC] rounded-[15px] rounded-xl cursor-pointer overflow-hidden"
            >
              <div>
              <div className="container-img-card !rounded-xl min-h-[200px] !max-h-[200px] overflow-hidden relative">
                <img
                  className="w-full h-full object-cover"
                  src={getImageUrl(certificationImage)}
                  alt={certification.nombre || "imagen-certificacion"}
                  onError={handleImageError}
                />
                <div className="absolute top-1 right-0 rounded-[25px_0px_0px_25px] text-[14px] font-bold text-black bg-[#F6F4EF] px-2 py-0.5 text-xs">
                  {certification.tipo_certificacion === "Curso"
                    ? "Certificación"
                    : certification.tipo_certificacion}
                </div>
              </div>

              <div className="tags-card relative flex flex-wrap gap-2 py-1 px-3 pb-0">
                {primarySkill ? (
                  <div className={`tag-category  ${primarySkill?.skill_col || "tag-verde"}`}>
                    {primarySkill.translate || primarySkill.nombre}
                  </div>
                ) : primaryTheme ? (
                  <div className={`tag-category  ${primaryTheme?.tem_col || "tag-verde"}`}>
                    {primaryTheme?.translate || primaryTheme?.nombre}
                  </div>
                ) : null}
              </div>
              </div>

              <div className="title-certification p-3">
                <h3>{certification.nombre}</h3>
              </div>

              <div className="flex justify-between w-full items-end px-3 pb-3 gap-2">
                <div className="w-auto  flex items-center rounded-xl max-h-[30px]">
                  {institutionImage && (
                    <img
                      className="max-w-[120px] max-h-[35px] w-full"
                      src={getImageUrl(institutionImage)}
                      alt="institucion"
                      onError={handleImageError}
                    />
                  )}
                </div>

                <div className="w-auto !bg-[#e3e1dce6] rounded-xl px-3 py-2">
                  {platformImage && (
                    <img
                      className="max-w-[80px] max-h-[20px]"
                      src={platformImage}
                      alt={certification.plataforma_certificacion?.nombre || "plataforma"}
                      onError={handleImageError}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
});

export default CertificationsList;