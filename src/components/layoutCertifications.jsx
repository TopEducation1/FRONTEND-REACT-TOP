import React, { useState, memo } from "react";
import { useNavigate } from "react-router-dom";

const CertificationsList = memo(({ certifications }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [hiddenImages, setHiddenImages] = useState({});

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(path));
    } else {
      navigate(path);
    }
  }

  const handleCertificationClick = (certification) => {
    try {
      if (!certification) throw new Error("No certification data provided");

      const plataformaSlug =
        certification?.plataforma_certificacion?.nombre?.toLowerCase() ||
        "certificacion";

      navigateWithTransition(`/certificacion/${plataformaSlug}/${certification.slug}`);
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Error al navegar a la certificación");
    }
  };

  const hideImage = (key) => {
    setHiddenImages((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const isValidValue = (value) => {
    if (!value) return false;

    const clean = String(value).trim().toLowerCase();

    return clean !== "none" && clean !== "null" && clean !== "undefined";
  };

  const isValidImage = (url) => {
    if (!isValidValue(url)) return false;
    return true;
  };

  const shouldShowBadge = (value) => {
    if (!isValidValue(value)) return false;

    const clean = String(value).trim().toLowerCase();

    return clean !== "none" && clean !== "uncategorized";
  };

  const getCertificationTypeLabel = (tipo) => {
    if (!shouldShowBadge(tipo)) return null;
    if (tipo === "Curso") return "Certificación";
    return tipo;
  };

  const getPrimaryTheme = (certification) => {
    const theme = certification?.tema_certificacion;
    if (!theme) return null;

    const label = theme?.translate || theme?.nombre;
    if (!shouldShowBadge(label)) return null;

    return theme;
  };

  const getPrimarySkill = (certification) => {
    const skill = certification?.primary_skill;

    if (skill && shouldShowBadge(skill?.translate || skill?.nombre)) {
      return skill;
    }

    if (Array.isArray(certification?.skills) && certification.skills.length > 0) {
      const firstSkill = certification.skills.find((item) =>
        shouldShowBadge(item?.translate || item?.nombre)
      );

      if (firstSkill) return firstSkill;
    }

    return null;
  };

  const getPlatformInitial = (certification) => {
    const name = certification?.plataforma_certificacion?.nombre || "";
    return name.charAt(0).toUpperCase();
  };

  const getCardVisualColor = (certification) => {
    const platformName = certification?.plataforma_certificacion?.nombre
      ?.toLowerCase()
      ?.trim();

    if (platformName?.includes("coursera")) return "bg-[#1E4264]";
    if (platformName?.includes("edx")) return "bg-[#994B13]";
    if (platformName?.includes("masterclass")) return "bg-[#6B4CE6]";

    const colors = [
      "bg-[#1B1A31]",
      "bg-[#27551B]",
      "bg-[#EF443A]",
      "bg-[#0E1F2E]",
      "bg-[#6B4CE6]",
    ];

    return colors[certification?.id % colors.length];
  };

  const getWatermarkText = (certification) => {
    return (
      certification?.plataforma_certificacion?.nombre ||
      certification?.empresa_certificacion?.nombre ||
      certification?.universidad_certificacion?.nombre ||
      "top"
    );
  };

  const tagColorClass = (color) => {
    const map = {
      "tag-verde": "bg-[#5CC781]",
      "tag-azul": "bg-[#034694]",
      "tag-rojo": "bg-[#D33B3E]",
    };

    return map[color] || "bg-[#5CC781]";
  };

  if (!Array.isArray(certifications)) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center text-red-500">
        Error: No se pudieron cargar las certificaciones
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-2xl bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {certifications.map((certification) => {
          const primaryTheme = getPrimaryTheme(certification);
          const primarySkill = getPrimarySkill(certification);

          const certificationImage =
            certification.imagen_final ||
            certification.universidad_certificacion?.univ_img ||
            certification.empresa_certificacion?.empr_img;

          const institutionImage =
            certification.universidad_certificacion?.univ_ico ||
            certification.universidad_certificacion?.univ_img ||
            certification.empresa_certificacion?.empr_ico ||
            certification.empresa_certificacion?.empr_img;

          const platformImage =
            certification.plataforma_certificacion?.plat_ico ||
            certification.plataforma_certificacion?.plat_img;

          const institutionName =
          certification.universidad_certificacion?.nombre ||
          certification.empresa_certificacion?.nombre ||
          certification.plataforma_certificacion?.nombre ||
          "";
          
          const typeLabel = getCertificationTypeLabel(
            certification.tipo_certificacion
          );

          const skillLabel =
            primarySkill?.translate ||
            primarySkill?.nombre ||
            primaryTheme?.translate ||
            primaryTheme?.nombre;

          const skillColor =
            primarySkill?.skill_col || primaryTheme?.tem_col || "tag-verde";

          const imageKey = `cert-${certification.id}`;
          const institutionKey = `inst-${certification.id}`;
          const platformKey = `platform-${certification.id}`;

          const showMainImage =
            isValidImage(certificationImage) && !hiddenImages[imageKey];

          const showInstitutionImage =
            isValidImage(institutionImage) && !hiddenImages[institutionKey];

          const showPlatformImage =
            isValidImage(platformImage) && !hiddenImages[platformKey];

          return (
            <article
              key={certification.id}
              onClick={() => handleCertificationClick(certification)}
              className="
                group
                cursor-pointer
                overflow-hidden
                rounded-[18px]
                border
                border-black/10
                bg-white
                shadow-[0_12px_35px_rgba(0,0,0,0.04)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]
              "
            >
              <div
                className={`
                  relative
                  h-[145px]
                  overflow-hidden
                  ${getCardVisualColor(certification)}
                `}
              >
                {showMainImage ? (
                  <img
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-[1.06]
                    "
                    src={certificationImage}
                    alt={certification.nombre || "certificación"}
                    onError={() => hideImage(imageKey)}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="
                        select-none
                        text-[3.4rem]
                        font-semibold
                        font-te-it
                        leading-none
                        text-white/20
                      "
                    >
                      {getWatermarkText(certification)}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/5" />


                {typeLabel && (
                  <span
                    className="
                      absolute
                      right-2
                      top-3
                      z-10
                      max-w-[110px]
                      truncate
                      rounded-full
                      bg-[#1941cf]
                      px-3
                      py-1
                      text-[11px]
                      font-bold
                      leading-none
                      text-white
                    "
                    title={typeLabel}
                  >
                    {typeLabel}
                  </span>
                )}
              </div>
                <div className="pt-2 pb-1 min-h-[40px] px-4">
                  {skillLabel && shouldShowBadge(skillLabel) && (
                    <span
                      className={`
                        relative
                        w-auto
                        truncate
                        rounded-full
                        px-3
                        py-1
                        text-[10px]
                        font-bold
                        leading-none
                        text-white
                        ${tagColorClass(skillColor)}
                      `}
                      title={skillLabel}
                    >
                      {skillLabel}
                    </span>
                  )}
                </div>
              <div className="flex min-h-[80px] flex-col justify-between pb-3 px-4">
                
                <h3
                  className="
                    line-clamp-2
                    !font-[Montserrat]
                    text-[15px]
                    font-medium
                    leading-[1.1em]
                    tracking-[-0.01em]
                    text-black
                    transition-colors
                    duration-300
                    group-hover:text-[#1941cf]
                  "
                >
                  {certification.nombre}
                </h3>
                
                <div className="mt-1 flex items-end justify-between gap-3">
                  <div className="flex min-h-[34px] max-w-[80%] items-center gap-2 overflow-hidden">
  <div className="flex h-[24px] w-[36px] shrink-0 items-center justify-center">
    {showInstitutionImage ? (
      <img
        className="
          max-h-[22px]
          max-w-[36px]
          object-contain
          mix-blend-multiply
        "
        src={institutionImage}
        alt={institutionName}
        onError={() => hideImage(institutionKey)}
        loading="lazy"
        decoding="async"
      />
    ) : (
      <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#F3F1EC] text-[9px] font-bold text-[#1941CF]">
        {institutionName.charAt(0)}
      </div>
    )}
  </div>

  <span
  className="
    line-clamp-2
    overflow-hidden
    !font-[Montserrat]
    text-[9px]
    font-medium
    leading-[1.15em]
    text-[#686868]
  "
  title={institutionName}
>
  {institutionName}
</span>
</div>

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F3F1EC]
                      
                      ring-1
                      ring-black/5
                    "
                  >
                    {showPlatformImage ? (
                      <img
                        className="max-h-[25px] max-w-[54px] object-contain"
                        src={platformImage}
                        alt={
                          certification.plataforma_certificacion?.nombre ||
                          "plataforma"
                        }
                        onError={() => hideImage(platformKey)}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className="text-xs font-bold text-neutral-500">
                        {getPlatformInitial(certification)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
});

export default CertificationsList;