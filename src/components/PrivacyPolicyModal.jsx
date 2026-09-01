import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  // Cerrar con ESC y bloquear scroll del body
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/35
        p-3 sm:p-5
        backdrop-blur-[2px]
      "
      onMouseDown={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div
        className="
          relative
          flex
          max-h-[92vh]
          w-full
          max-w-[900px]
          flex-col
          overflow-y-auto
          rounded-[28px]
          bg-[#F7F5F0]
          px-6
          pb-0
          pt-16
          shadow-[0_24px_80px_rgba(0,0,0,0.18)]

          sm:px-10
          sm:pt-20

          lg:min-h-[580px]
          lg:px-14
        "
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="
            absolute
            right-4
            top-4
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-black/10
            bg-white
            text-[#111111]
            shadow-[0_3px_10px_rgba(0,0,0,0.12)]
            transition-all
            duration-200
            hover:scale-105
            hover:bg-black
            hover:text-white

            sm:right-5
            sm:top-5
          "
        >
          <FiX size={25} />
        </button>

        {/* Contenido */}
        <div className="mx-auto w-full max-w-[790px] text-center">
          <h2
            id="privacy-modal-title"
            className="
              font-serif
              text-[1.8rem]
              font-medium
              leading-[1.08]
              text-[#111111]

              sm:text-[1.9rem]
              lg:text-[1.8rem]
            "
          >
            ¡Estamos preparando nuestro rincón de seguridad!
          </h2>

          <div
            className="
              mx-auto
              mt-5
              max-w-[780px]
              font-['Montserrat']
              text-[1rem]
              leading-[1.5]
              text-[#45413F]

              sm:text-[.9rem]
              lg:text-[1rem]
            "
          >
            <p>
              Estamos afinando los últimos detalles de nuestro{" "}
              <strong className="font-bold text-[#3D3937]">
                Aviso de Privacidad
              </strong>{" "}
              para asegurarnos de que tu experiencia con nosotros sea 100%
              segura y transparente.
            </p>

            <p className="mt-2">
              Muy pronto podrás consultar aquí todos los detalles sobre el
              cuidado de tus datos.
              <br />
              ¡Mantente atento!
            </p>
          </div>
        </div>

        {/* Imagen */}
        <div className="mt-auto flex w-full justify-center pt-7">
          <img
            src="/assets/content/resources/privacy-policies.webp"
            alt="Estamos preparando nuestro aviso de privacidad"
            className="
              h-auto
              w-[260px]
              max-w-full
              object-contain

              sm:w-[320px]
              lg:w-[350px]
            "
          />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;