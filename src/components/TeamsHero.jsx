// src/components/TeamsHero.jsx

import React from "react";

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </svg>
);

const CheckIcon = () => (
  <span className="grid h-[20px] w-[20px] shrink-0 place-items-center rounded-full bg-[#5CC781]/15 text-[#5CC781]">
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  </span>
);

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);

  if (!section) return;

  section.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function TeamsHero() {
  const benefits = [
    "Acceso a 9,000+ cursos de Harvard, MIT y MasterClass",
    "Rutas de aprendizaje personalizadas por IA para cada miembro",
    "Reportes de progreso en tiempo real para el manager",
    "Precios flexibles según el tamaño de tu equipo",
    "Certificaciones reconocidas a nivel global",
  ];

  const handleDemoClick = () => {
    scrollToSection("demo-equipos");
  };

  const handlePlansClick = () => {
    scrollToSection("precios");
  };

  return (
    <section className="relative overflow-hidden bg-[#0F090B] text-white">
      {/* FONDO */}
      <div
        className="
          pointer-events-none absolute inset-0 opacity-[0.11]
          [background-image:radial-gradient(rgba(92,199,129,0.5)_1px,transparent_1px)]
          [background-size:26px_26px]
        "
      />

      <div className="pointer-events-none absolute left-1/2 top-[120px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#1941CF]/15 blur-[150px]" />

      <div className="pointer-events-none absolute -left-[180px] top-[260px] h-[420px] w-[420px] rounded-full bg-[#D33B3E]/10 blur-[150px]" />

      <div className="pointer-events-none absolute -right-[180px] bottom-[120px] h-[420px] w-[420px] rounded-full bg-[#5CC781]/10 blur-[150px]" />

      {/* HERO PRINCIPAL */}
      <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1280px] flex-col items-center justify-center px-5 pb-20 pt-32 text-center md:min-h-[800px] md:px-8 md:pb-24 md:pt-40">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 !font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B6AFB2] backdrop-blur-xl md:text-[11px]">
          ✦ Para empresas y equipos
        </span>

        <h1 className="mt-8 max-w-[900px] font-te text-[3.15rem] font-normal leading-[0.96em] tracking-[-0.025em] text-[#F9F7F4] sm:text-[4.2rem] md:text-[5rem] lg:text-[5.5rem]">
          Forma tu equipo,
          <br />

          <span className="font-te-it text-[#5CC781]">
            forma tu
          </span>

          <br />

          historia empresarial
        </h1>

        <p className="mx-auto mt-8 max-w-[620px] !font-['Montserrat'] text-[1rem] leading-[1.75em] text-[#9F979A] md:text-[1.08rem]">
          Conecta los puntos entre el talento de tu equipo y las habilidades
          del futuro. top.education optimiza tu capacitación, reduciendo
          costos y aumentando el desempeño de forma medible.
        </p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={handleDemoClick}
            className="group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(90deg,#1941CF_0%,#1D1DD7_100%)] px-8 py-4 !font-['Montserrat'] text-[15px] font-bold text-white shadow-[0_20px_55px_rgba(25,65,207,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(25,65,207,0.42)] sm:w-auto"
          >
            Reserva una demo

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          </button>

          <button
            type="button"
            onClick={handlePlansClick}
            className="inline-flex min-h-[54px] w-full items-center justify-center rounded-full border border-white/20 bg-transparent px-8 py-4 !font-['Montserrat'] text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/35 hover:bg-white/[0.05] sm:w-auto"
          >
            Ver planes
          </button>
        </div>
      </div>

      {/* FORMULARIO / DEMO */}
      <div
        id="demo-equipos"
        className="relative z-10 scroll-mt-24 border-t border-white/[0.03] bg-[#100C0F]/80"
      >
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[1fr_0.86fr] lg:gap-20">
          {/* TEXTO */}
          <div className="order-2 text-left lg:order-1">
            <span className="!font-['Montserrat'] text-[11px] font-bold uppercase tracking-[0.18em] text-[#797278]">
              Top.education
            </span>

            <h2 className="mt-6 max-w-[720px] font-te text-[2.6rem] font-normal leading-[1em] tracking-[-0.02em] text-[#F9F7F4] sm:text-[3.2rem] md:text-[3.8rem] lg:text-[4.1rem]">
              Capacita a tu equipo con{" "}

              <span className="text-[#5CC781]">
                los mejores del mundo.
              </span>
            </h2>

            <p className="mt-6 max-w-[680px] !font-['Montserrat'] text-[0.98rem] leading-[1.7em] text-[#9D9699] md:text-[1.05rem]">
              En 30 minutos te mostramos cómo top.education puede transformar
              el aprendizaje de tu equipo.
            </p>

            <ul className="mt-9 space-y-5">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 !font-['Montserrat'] text-[0.94rem] leading-[1.5em] text-[#C7C1C4] md:text-[1rem]"
                >
                  <CheckIcon />

                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <p className="mt-12 !font-['Montserrat'] text-[12px] leading-[1.5em] text-[#625B60]">
              Más de 500 empresas en LATAM ya capacitan a sus equipos con
              top.education.
            </p>
          </div>

          {/* AGENDADOR GOOGLE CALENDAR */}
          <div className="order-1 lg:order-2">
            <div
              id="teams-demo-form-container"
              className="relative min-h-[720px] w-full overflow-hidden rounded-[26px] bg-white shadow-[0_32px_90px_rgba(0,0,0,0.26)] md:min-h-[680px]"
            >
              <iframe
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ10Vy_lLuSUdtV-g55UJpr5FGOXR4qEdAiY7cSIz5bZC0pzbBCFsYQonlZIxQEKUXIT2fUujTQ9?gv=true"
                title="Agenda una demostración empresarial con Top Education"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeamsHero;