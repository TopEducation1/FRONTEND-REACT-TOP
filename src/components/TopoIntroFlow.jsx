import React, { useMemo, useState } from "react";

/**
 * TopoIntroFlow
 *
 * Flujo introductorio de Topo para StartNow.
 *
 * Props:
 * - onBackToWelcome(): vuelve al welcome principal de StartNow.
 * - onFinish(): termina la introducción y continúa con el flujo normal.
 */
export default function TopoIntroFlow({
  onBackToWelcome,
  onFinish,
}) {
  const [screen, setScreen] = useState(1);

  const steps = useMemo(
    () => [
      {
        eyebrow: "PASO 1 DE 3",
        title: "Conoce a Topo",
        subtitle: "¿Quién es Topo?",
        heading: "Topo IA",
        description:
          "Topo es la inteligencia artificial de Top Education. Te ayuda a armar tu ruta, interpretar tu avance y decirte cuál es tu próximo foco.",
        showRadar: false,
      },
      {
        eyebrow: "PASO 2 DE 3",
        title: "Conoce a Topo",
        subtitle: "¿Quién es Topo?",
        heading: "Analiza tu CV con Topo",
        description:
          "Topo revisa tu CV y te da retroalimentación clara para destacar lo que ya tienes y alcanzar tu meta.",
        showRadar: true,
      },
      {
        eyebrow: "PASO 3 DE 3",
        title: "Conoce a Topo",
        subtitle: "¿Quién es Topo?",
        heading: "Encuentra más oportunidades",
        description:
          "Con tu progreso, Topo te muestra oportunidades reales y te dice hacia dónde enfocarte después.",
        showRadar: false,
      },
    ],
    []
  );

  const currentStep = steps[Math.min(screen - 1, 2)];
  const isCompletion = screen === 4;

  const goBack = () => {
    if (screen <= 1) {
      onBackToWelcome?.();
      return;
    }

    setScreen((current) => Math.max(1, current - 1));
  };

  const goNext = () => {
    if (screen < 3) {
      setScreen((current) => current + 1);
      return;
    }

    setScreen(4);
  };

  if (isCompletion) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F7F8FA] px-5 py-10 md:py-16">
        <div className="w-full max-w-[780px]">
          <div className="mb-10 flex justify-center gap-3">
            {[1, 2, 3].map((item) => (
              <span
                key={item}
                className="h-[6px] w-[30px] rounded-full bg-[#4798B7]"
              />
            ))}
          </div>

          <div className="rounded-[22px] border border-[#DDE2E8] bg-white px-6 py-12 text-center shadow-[0_1px_2px_rgba(15,23,42,0.08)] md:px-14 md:py-20">
            <div className="mx-auto grid h-[120px] w-[120px] place-items-center rounded-full bg-[#CBF6FA] text-[#4897B6]">
              <svg
                width="58"
                height="58"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M16 33.5 27 44l21-23"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="mt-10 !font-['Montserrat'] text-[2rem] font-semibold leading-tight text-[#111D31] md:text-[2.6rem]">
              ¡Eres un experto en Topo!
            </h2>

            <p className="mx-auto mt-5 max-w-[560px] !font-['Montserrat'] text-[1rem] leading-[1.5] text-[#667085] md:text-[1.15rem]">
              Cuéntanos sobre tus intereses y metas. Topo creará un viaje de
              aprendizaje personalizado diseñado para tu crecimiento profesional.
            </p>

            <button
              type="button"
              onClick={onFinish}
              className="mt-10 inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full bg-[#CBF6FA] px-8 !font-['Montserrat'] text-[1rem] font-semibold text-[#4798B7] shadow-[0_14px_28px_rgba(15,23,42,0.14)] transition hover:-translate-y-0.5 hover:bg-[#BDF0F5] md:px-10"
            >
              Crear Mi Ruta de Aprendizaje
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F7F8FA] px-5 pt-9 md:pt-20">
      <div className="mx-auto w-full max-w-[640px]">
        <div className="text-center">
          <p className="!font-['Montserrat'] text-[13px] font-semibold uppercase text-[#98A2B3]">
            {currentStep.eyebrow}
          </p>

          <h1 className="mt-2 !font-['Montserrat'] text-[2rem] font-semibold leading-tight text-[#111D31] md:text-[2.15rem]">
            {currentStep.title}
          </h1>

          <p className="!font-['Montserrat'] text-[1rem] text-[#667085]">
            {currentStep.subtitle}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            {[1, 2, 3].map((item) => {
              const completed = item < screen;
              const active = item === screen;

              return (
                <span
                  key={item}
                  className={[
                    "h-[6px] rounded-full transition-all duration-300",
                    active
                      ? "w-[40px] bg-[#111D31]"
                      : completed
                      ? "w-[30px] bg-[#4798B7]"
                      : "w-[20px] bg-[#D0D5DD]",
                  ].join(" ")}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-10 rounded-[22px] border border-[#DDE2E8] bg-white px-6 py-10 shadow-[0_1px_2px_rgba(15,23,42,0.08)] md:px-12 md:py-14">
          <div className="mx-auto flex max-w-[590px] flex-col items-center text-center">
            <TopoMark />

            <h2 className="mt-8 !font-['Montserrat'] text-[1.45rem] font-semibold leading-tight text-[#111D31] md:text-[1.7rem]">
              {currentStep.heading}
            </h2>

            <p className="mt-4 max-w-[470px] !font-['Montserrat'] text-[0.98rem] leading-[1.5] text-[#667085] md:text-[1.05rem]">
              {currentStep.description}
            </p>

            {currentStep.showRadar && (
              <div className="mt-6">
                <TopoRadar />
              </div>
            )}
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[17px] border border-[#D0D5DD] bg-white px-7 !font-['Montserrat'] text-[0.95rem] font-semibold text-[#344054] transition hover:bg-[#F8FAFC]"
            >
              <ArrowLeftIcon />
              Atrás
            </button>

            <button
              type="button"
              onClick={goNext}
              className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-[17px] bg-[#111D31] px-8 !font-['Montserrat'] text-[0.95rem] font-semibold text-white shadow-[0_10px_24px_rgba(17,29,49,0.16)] transition hover:-translate-y-0.5 hover:bg-[#172A48]"
            >
              {screen === 3 ? "Finaliza" : "Siguiente"}
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TopoMark() {
  return (
    <div className="grid h-[66px] w-[66px] place-items-center overflow-hidden rounded-full bg-[#CBF6FA]">
      <img
        src="/assets/logos/topo-contenedor-claro.png"
        alt="Topo"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function TopoRadar() {
  const labels = [
    ["Liderazgo", 100, 11],
    ["Estrategia", 159, 36],
    ["Comunicación", 184, 82],
    ["Innovación", 172, 133],
    ["Gestión de Proyectos", 138, 169],
    ["Análisis de Datos", 95, 188],
    ["Transformación Digital", 44, 164],
    ["Finanzas", 18, 132],
    ["Negociación", 7, 83],
    ["Gestión del Cambio", 21, 43],
    ["Design Thinking", 55, 17],
  ];

  const center = 100;
  const rings = [25, 45, 65, 82];

  const points = [
    [100, 32],
    [140, 49],
    [157, 82],
    [149, 117],
    [127, 137],
    [93, 151],
    [76, 140],
    [69, 111],
    [42, 98],
    [42, 72],
    [80, 58],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  return (
    <div className="w-[260px] max-w-full" aria-label="Ejemplo de análisis de CV">
      <svg viewBox="0 0 200 200" className="h-auto w-full overflow-visible">
        {rings.map((radius) => (
          <circle
            key={radius}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}

        {labels.map(([label, x, y], index) => {
          const angle =
            -Math.PI / 2 + (index * Math.PI * 2) / labels.length;
          const x2 = center + Math.cos(angle) * 82;
          const y2 = center + Math.sin(angle) * 82;

          return (
            <React.Fragment key={label}>
              <line
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                className="fill-[#475467] text-[6px]"
              >
                {label}
              </text>
            </React.Fragment>
          );
        })}

        <polygon
          points="100,22 144,45 168,82 158,123 132,151 94,170 57,148 29,119 26,78 52,40 80,25"
          fill="rgba(71,152,183,0.04)"
          stroke="#4798B7"
          strokeWidth="1.2"
          strokeDasharray="3 2"
        />

        <polygon
          points={points}
          fill="rgba(17,29,49,0.55)"
          stroke="#111D31"
          strokeWidth="1.6"
        />
      </svg>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m13 5 7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M19 12H5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m11 5-7 7 7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
