// src/components/TeamsPricing.jsx

import React from "react";

const plans = [
  {
    id: "starter",
    eyebrow: "Starter",
    members: "1-10 personas",
    title: "Para equipos pequeños",
    price: "Desde $29 / miembro",
    featured: false,
    buttonStyle: "light",
    features: [
      "Acceso a 500+ cursos seleccionados",
      "Rutas de aprendizaje básicas",
      "Dashboard del manager",
      "Soporte por email",
    ],
  },
  {
    id: "business",
    eyebrow: "Business",
    members: "11-200 personas",
    title: "Para equipos en crecimiento",
    price: "Desde $19 / miembro",
    featured: true,
    buttonStyle: "blue",
    badge: "Más popular",
    features: [
      "Todo lo de Starter",
      "Acceso ilimitado a 9,000+ cursos",
      "Rutas personalizadas por IA",
      "Reportes de progreso avanzados",
      "Soporte dedicado",
      "Certificaciones de Harvard, MIT y Stanford",
    ],
  },
  {
    id: "enterprise",
    eyebrow: "Enterprise",
    members: "200+ personas",
    title: "Para grandes organizaciones",
    price: "Precio personalizado",
    featured: false,
    buttonStyle: "dark",
    features: [
      "Todo lo de Business",
      "Integraciones con HR systems",
      "SLA garantizado",
      "Account manager dedicado",
      "Capacitación personalizada",
    ],
  },
];

const PlanCheck = ({ featured }) => (
  <span
    className={`mt-[2px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full ${
      featured
        ? "bg-[#5CC781]/20 text-[#5CC781]"
        : "bg-[#EAF0FF] text-[#1941CF]"
    }`}
  >
    <svg
      width="11"
      height="11"
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

function PricingCard({ plan, onRequestInformation }) {
  const buttonClasses = {
    light:
      "border border-black/15 bg-white text-[#0F090B] hover:border-black/30 hover:bg-[#F8F7F4]",
    blue:
      "border border-[#1941CF] bg-[linear-gradient(90deg,#1941CF,#1E19D7)] text-white hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(25,65,207,0.28)]",
    dark:
      "border border-[#0F090B] bg-[#0F090B] text-white hover:-translate-y-0.5 hover:bg-black",
  };

  return (
    <article
      className={`relative flex min-h-[460px] flex-col overflow-hidden rounded-[24px] border p-7 transition-all duration-300 md:min-h-[500px] md:p-8 ${
        plan.featured
          ? "border-[#0F090B] bg-[#0F090B] text-white shadow-[0_28px_70px_rgba(15,9,11,0.18)] lg:-translate-y-1"
          : "border-black/[0.08] bg-white text-[#0F090B] shadow-[0_18px_55px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(0,0,0,0.10)]"
      }`}
    >
      {plan.featured && (
        <>
          <div className="absolute left-0 top-0 h-[3px] w-full bg-[linear-gradient(90deg,#1941CF,#5CC781)]" />

          <span className="absolute right-5 top-5 rounded-full bg-[#1941CF] px-3 py-1 !font-['Montserrat'] text-[9px] font-bold uppercase text-white">
            {plan.badge}
          </span>
        </>
      )}

      <span
        className={`!font-['Montserrat'] text-[10px] font-bold uppercase tracking-[0.2em] ${
          plan.featured ? "text-[#817A7F]" : "text-[#756D68]"
        }`}
      >
        {plan.eyebrow}
      </span>

      <p
        className={`mt-2 !font-['Montserrat'] text-[13px] ${
          plan.featured ? "text-[#B2AAAE]" : "text-[#665E59]"
        }`}
      >
        {plan.members}
      </p>

      <h3 className="mt-2 !font-['Montserrat'] text-[1.18rem] font-bold leading-[1.25em] md:text-[1.3rem]">
        {plan.title}
      </h3>

      <ul className="mt-7 space-y-4">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className={`flex items-start gap-3 !font-['Montserrat'] text-[13px] leading-[1.45em] md:text-[14px] ${
              plan.featured ? "text-[#D3CDD0]" : "text-[#6A625E]"
            }`}
          >
            <PlanCheck featured={plan.featured} />

            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-10">
        <p
          className={`mb-4 !font-['Montserrat'] text-[12px] ${
            plan.featured ? "text-[#8F878B]" : "text-[#766E69]"
          }`}
        >
          {plan.price}
        </p>

        <button
          type="button"
          onClick={() => onRequestInformation(plan)}
          className={`flex min-h-[50px] w-full items-center justify-center rounded-[13px] px-5 py-3 !font-['Montserrat'] text-[13px] font-bold transition-all duration-300 ${buttonClasses[plan.buttonStyle]}`}
        >
          Solicitar información
        </button>
      </div>
    </article>
  );
}

function TeamsPricing() {
  const handleRequestInformation = (plan) => {
    const planData = {
      id: plan.id,
      name: plan.eyebrow,
      members: plan.members,
      title: plan.title,
      price: plan.price,
    };

    try {
      localStorage.setItem(
        "selectedTeamPlan",
        JSON.stringify(planData)
      );
    } catch (error) {
      console.warn(
        "No fue posible guardar el plan seleccionado:",
        error
      );
    }

    window.dispatchEvent(
      new CustomEvent("topeducation:team-plan-selected", {
        detail: planData,
      })
    );

    scrollToSection("demo-equipos");
  };

  return (
    <section
      id="precios"
      className="relative scroll-mt-24 overflow-hidden bg-[#F5F3EE] px-4 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute left-1/2 top-[200px] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#1941CF]/[0.025] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-[1120px]">
        <div className="mx-auto max-w-[860px] text-center">
          <span className="!font-['Montserrat'] text-[10px] font-bold uppercase tracking-[0.28em] text-[#1941CF] md:text-[11px]">
            Planes para equipos
          </span>

          <h2 className="mt-5 font-te text-[2.7rem] font-normal leading-[1em] tracking-[-0.02em] text-[#0F090B] md:text-[3.5rem] lg:text-[4rem]">
            Elige el plan que se adapta a tu equipo.
          </h2>

          <p className="mx-auto mt-5 max-w-[600px] !font-['Montserrat'] text-[0.95rem] leading-[1.55em] text-[#766D68]">
            Todos los planes incluyen acceso a 9,000+ cursos, certificaciones
            reconocidas y soporte en español.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onRequestInformation={handleRequestInformation}
            />
          ))}
        </div>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 text-center">
          <p className="mx-auto max-w-[820px] !font-['Montserrat'] text-[11px] leading-[1.5em] text-[#AAA2A0] md:text-[12px]">
            Los precios se definen según el tamaño del equipo y el plan elegido.
            Un asesor te contactará con una propuesta personalizada.
          </p>
        </div>
      </div>
    </section>
  );
}

export default TeamsPricing;