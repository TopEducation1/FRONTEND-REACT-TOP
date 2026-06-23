import React from "react";

const RightPop = () => {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.05)]">
      <div className="pointer-events-none absolute -right-16 -top-16 h-[180px] w-[180px] rounded-full bg-[#1941cf]/10 blur-[60px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-[180px] w-[180px] rounded-full bg-[#5CC781]/10 blur-[60px]" />

      <div className="relative z-10">
        <span className="mb-4 inline-flex rounded-full bg-[#F3F1EC] px-4 py-1.5 font-['Montserrat'] text-[12px] font-bold uppercase tracking-[0.06em] text-neutral-700">
          Membresía top.education
        </span>

        <h2 className="!font-['Montserrat'] text-[1.65rem] font-bold leading-[1.08em] tracking-[-0.04em] text-[#111111]">
          ¿Aún no eres miembro de top.education?
        </h2>

        <p className="mt-4 font-['Montserrat'] text-[14px] leading-[1.7em] text-neutral-600">
          Con una membresía, tendrás acceso a esta certificación y a cientos más
          para seguir construyendo tu ruta de aprendizaje.
        </p>

        <a
          /*href="/empieza-ahora"*/
          href="/"
          className="mt-6 flex w-full items-center justify-center rounded-full bg-[#111111] px-5 py-3 font-['Montserrat'] text-sm font-bold text-white transition-all duration-300 hover:bg-black hover:shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
        >
          ¡Haz la prueba ahora!
        </a>

        <div className="mt-6 border-t border-black/10 pt-5">
          <p className="font-['Montserrat'] text-[13px] leading-[1.5em] text-neutral-500">
            ¿Te interesa contratar nuestros servicios para tu empresa?
          </p>

          <a
            href="/para-equipos"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-center font-['Montserrat'] text-sm font-bold leading-[1.2em] text-[#111111] transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:bg-[#F8F7F4] hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
          >
            Conoce nuestra solución para equipos
          </a>
        </div>
      </div>
    </div>
  );
};

export default RightPop;