// src/components/account/CareerTab.jsx
import React, { useEffect, useMemo, useState } from "react";

const PLAN_ORDER = ["free", "basic", "x", "plus"];

const cloneLevels = (providers, coursesPerLevel, footerTitle, footerBenefit) => [
  {
    id: 1,
    number: "01",
    title: "Fundamentos",
    level: "Principiante",
    status: "En progreso",
    providers,
    description: "Construye las bases esenciales de las habilidades que seleccionaste.",
    skills: ["Liderazgo", "Comunicación", "Pensamiento crítico", "Análisis"],
    coursesLabel: `${coursesPerLevel} disponibles`,
    catalogLabel: providers.join(" · "),
    courses: [
      { provider: providers[0], title: "Pensamiento Crítico", institution: "Duke", duration: "10h", url: "#" },
      { provider: providers[0], title: "Comunicación Efectiva", institution: "Yale", duration: "8h", url: "#" },
    ],
    footer: { title: footerTitle, benefit: footerBenefit, analysis: "Análisis del mapa" },
  },
  {
    id: 2,
    number: "02",
    title: "Aplicación práctica",
    level: "Intermedio",
    status: "Disponible",
    providers,
    description: "Aplica lo aprendido en situaciones reales y contextos profesionales.",
    skills: ["Liderazgo", "Comunicación", "Negocios", "Colaboración"],
    coursesLabel: `${coursesPerLevel} disponibles`,
    catalogLabel: providers.join(" · "),
    courses: [],
    emptyMessage: "No encontramos cursos para tus dominios en este nivel.",
    emptyAction: "Ver catálogo completo",
    emptyUrl: "#",
    footer: { title: footerTitle, benefit: footerBenefit, analysis: "Análisis del mapa" },
  },
  {
    id: 3,
    number: "03",
    title: "Especialización",
    level: "Avanzado",
    status: "Disponible",
    providers,
    description: "Profundiza y consolida tu perfil con herramientas más avanzadas.",
    skills: ["Estrategia", "Innovación", "Tecnología", "Toma de decisiones"],
    coursesLabel: `${coursesPerLevel} disponibles`,
    catalogLabel: providers.join(" · "),
    courses: [],
    emptyMessage: "No encontramos cursos para tus dominios en este nivel.",
    emptyAction: "Ver catálogo completo",
    emptyUrl: "#",
    footer: { title: footerTitle, benefit: footerBenefit, analysis: "Análisis del mapa" },
  },
];

const DOMAINS = [
  { name: "Artes y humanidades", value: 35, inRoute: true },
  { name: "Negocios", value: 68, inRoute: true },
  { name: "Ciencias de la computación", value: 15 },
  { name: "Ciencia de datos", value: 10 },
  { name: "Salud y ciencias de la vida", value: 0 },
  { name: "Tecnologías de la información", value: 20, inRoute: true },
  { name: "Idiomas", value: 0 },
  { name: "Matemáticas y lógica", value: 5 },
  { name: "Desarrollo personal", value: 55, inRoute: true },
  { name: "Ciencias físicas e ingeniería", value: 10 },
  { name: "Ciencias sociales", value: 45, inRoute: true },
];

export const CAREER_PLANS = {
  free: {
    key: "free",
    selectorLabel: "Gratis",
    intro: {
      title: "Tu ruta siempre avanza en 3 niveles",
      description:
        "El plan que elijas define cuántos cursos, proveedores y beneficios estarán disponibles dentro de tu ruta.",
      highlight:
        "Explora contenidos gratuitos y conoce cómo Top Education puede acompañar tu desarrollo.",
    },
    stats: [
      { value: "3 niveles", label: "siempre" },
      { value: "6 cursos", label: "disponibles" },
      { value: "1 proveedor", label: "Cursos gratuitos" },
    ],
    levels: [
      {
        id: 1,
        number: "01",
        title: "Fundamentos",
        level: "Principiante",
        status: "En progreso",
        providers: ["Coursera", "edX"],
        description: "Construye las bases esenciales de las habilidades que seleccionaste.",
        skills: ["Liderazgo", "Comunicación", "Comunicación", "Pensamiento crítico"],
        coursesLabel: "2 disponibles",
        catalogLabel: "Cursos gratuitos",
        courses: [
          { provider: "Coursera", title: "Pensamiento Crítico", institution: "Duke", duration: "10h", url: "#" },
          { provider: "Coursera", title: "Comunicación Efectiva", institution: "Yale", duration: "8h", url: "#" },
        ],
        footer: {
          title: "Por tu cuenta con el proveedor",
          benefit: "CV: 2 de por vida",
          action: "Ver 150 cursos gratuitos",
          url: "#",
        },
      },
      {
        id: 2,
        number: "02",
        title: "Aplicación práctica",
        level: "Intermedio",
        status: "Disponible",
        providers: ["Coursera", "edX"],
        description: "Aplica lo aprendido en situaciones reales y contextos profesionales.",
        skills: ["Liderazgo", "Comunicación", "Negocios", "Colaboración"],
        coursesLabel: "1 disponible",
        catalogLabel: "Cursos gratuitos",
        courses: [
          { provider: "edX", title: "Productividad Personal", institution: "Rochester", duration: "6h", url: "#" },
        ],
        footer: {
          title: "Por tu cuenta con el proveedor",
          benefit: "CV: 2 de por vida",
          action: "Ver 150 cursos gratuitos",
          url: "#",
        },
      },
      {
        id: 3,
        number: "03",
        title: "Especialización",
        level: "Avanzado",
        status: "Disponible",
        providers: ["Coursera", "edX"],
        description: "Profundiza y consolida tu perfil con herramientas más avanzadas.",
        skills: ["Estrategia", "Innovación", "Tecnología", "Toma de decisiones"],
        coursesLabel: "0 disponibles",
        catalogLabel: "Cursos gratuitos",
        courses: [],
        emptyMessage: "No encontramos cursos gratuitos para tus dominios en este nivel.",
        emptyAction: "Ver catálogo completo",
        emptyUrl: "#",
        footer: {
          title: "Por tu cuenta con el proveedor",
          benefit: "CV: 2 de por vida",
          action: "Ver 150 cursos gratuitos",
          url: "#",
        },
      },
    ],
    potential: {
      scaleMaxHours: 60,
      title: "Tu potencial con este plan",
      description:
        "Cada curso aporta horas de aprendizaje a las habilidades que elegiste. Al mejorar tu plan, accedes a más contenidos y puedes alcanzar niveles más avanzados.",
      skills: [
        { name: "Liderazgo", badge: "Nivel 1 · Explorador", currentHours: 4, targetHours: 18, nextText: "Con Básico puedes alcanzar 18h — Nivel 2 · En desarrollo", gain: "+14h" },
        { name: "Comunicación", badge: "Nivel 1 · Explorador", currentHours: 3, targetHours: 16, nextText: "Con Básico puedes alcanzar 16h — Nivel 2 · En desarrollo", gain: "+13h" },
        { name: "Negocios", badge: "Nivel 1 · Explorador", currentHours: 2, targetHours: 14, nextText: "Con Básico puedes alcanzar 14h — Nivel 2 · En desarrollo", gain: "+12h" },
      ],
      cta: {
        title: "Convierte tu exploración en una ruta completa",
        description: "Con Básico accedes a los tres niveles, el catálogo completo de Coursera y seguimiento de tu avance.",
        button: "Comenzar mi ruta completa",
        secondary: "Comparar planes",
        targetPlan: "basic",
      },
    },
    includes: {
      title: "¿Qué incluye este plan?",
      subtitle: "Gratis — Cursos gratuitos",
      items: ["Cursos gratuitos del proveedor", "2 análisis de CV de por vida", "Explora una muestra del ecosistema"],
      primaryButton: "Comenzar gratis",
      secondaryButton: "Comparar planes",
    },
    domains: DOMAINS,
  },

  basic: {
    key: "basic",
    selectorLabel: "Básico",
    intro: {
      title: "Tu ruta siempre avanza en 3 niveles",
      description:
        "El plan que elijas define cuántos cursos, proveedores y beneficios estarán disponibles dentro de tu ruta.",
      highlight: "Desarrolla tu ruta completa con el catálogo de Coursera.",
    },
    stats: [
      { value: "3 niveles", label: "siempre" },
      { value: "18 cursos", label: "disponibles" },
      { value: "1 proveedor", label: "Coursera" },
    ],
    levels: cloneLevels(["Coursera"], 6, "Ilimitados · Coursera", "CV: 1 / mes (12 anuales)"),
    potential: {
      scaleMaxHours: 60,
      title: "Tu potencial con este plan",
      description:
        "Cada curso aporta horas de aprendizaje a las habilidades que elegiste. Al mejorar tu plan, accedes a más contenidos y puedes alcanzar niveles más avanzados.",
      skills: [
        { name: "Liderazgo", badge: "Nivel 2 · En desarrollo", currentHours: 18, targetHours: 32, nextText: "Con X puedes alcanzar 32h — Nivel 3 · Competente", gain: "+14h" },
        { name: "Comunicación", badge: "Nivel 2 · En desarrollo", currentHours: 16, targetHours: 28, nextText: "Con X puedes alcanzar 28h — Nivel 3 · Competente", gain: "+12h" },
        { name: "Negocios", badge: "Nivel 2 · En desarrollo", currentHours: 14, targetHours: 24, nextText: "Con X puedes alcanzar 24h — Nivel 3 · Competente", gain: "+10h" },
      ],
      cta: {
        title: "Avanza más en tus habilidades",
        description: "Con X agregas MasterClass, más cursos y nuevas oportunidades para subir de nivel.",
        button: "Alcanzar mi siguiente nivel con X",
        secondary: "Comparar planes",
        targetPlan: "x",
      },
    },
    includes: {
      title: "¿Qué incluye este plan?",
      subtitle: "Básico — Coursera",
      items: ["Ruta completa", "Catálogo completo Coursera", "Certificados ilimitados · Coursera", "Topo — análisis del mapa", "1 análisis de CV / mes (12 anuales)", "Seguimiento de tu avance"],
      primaryButton: "Elegir Básico",
      secondaryButton: "Comparar planes",
    },
    domains: DOMAINS,
  },

  x: {
    key: "x",
    selectorLabel: "X",
    intro: {
      title: "Tu ruta siempre avanza en 3 niveles",
      description: "El plan que elijas define cuántos cursos, proveedores y beneficios estarán disponibles dentro de tu ruta.",
      highlight: "Amplía tu ruta con Coursera y MasterClass.",
    },
    stats: [
      { value: "3 niveles", label: "siempre" },
      { value: "24 cursos", label: "disponibles" },
      { value: "2 proveedores", label: "Coursera · MasterClass" },
    ],
    levels: cloneLevels(["Coursera", "MasterClass"], 8, "Ilimitados · 2 proveedores", "CV: 2 / mes"),
    potential: {
      scaleMaxHours: 60,
      title: "Tu potencial con este plan",
      description: "Aumenta tu cobertura con contenidos de dos proveedores.",
      skills: [],
      cta: { title: "Lleva tu ruta al siguiente nivel", description: "Con Plus agregas edX y beneficios avanzados.", button: "Conocer Plus", secondary: "Comparar planes", targetPlan: "plus" },
    },
    includes: {
      title: "¿Qué incluye este plan?",
      subtitle: "X — Coursera y MasterClass",
      items: ["Ruta completa", "Dos proveedores", "Certificaciones", "Seguimiento de progreso"],
      primaryButton: "Elegir X",
      secondaryButton: "Comparar planes",
    },
    domains: DOMAINS,
  },

  plus: {
    key: "plus",
    selectorLabel: "Plus",
    intro: {
      title: "Tu ruta siempre avanza en 3 niveles",
      description: "El plan que elijas define cuántos cursos, proveedores y beneficios estarán disponibles dentro de tu ruta.",
      highlight: "Accede a la experiencia completa con Coursera, edX y MasterClass.",
    },
    stats: [
      { value: "3 niveles", label: "siempre" },
      { value: "30 cursos", label: "disponibles" },
      { value: "3 proveedores", label: "Coursera · edX · MasterClass" },
    ],
    levels: cloneLevels(["Coursera", "edX", "MasterClass"], 10, "Ilimitados · 3 proveedores", "CV ilimitados"),
    potential: {
      scaleMaxHours: 60,
      title: "Tu potencial con este plan",
      description: "Desbloquea el máximo alcance de tu ruta, seguimiento avanzado e IA personalizada.",
      skills: [],
      cta: { title: "Tu ruta completa", description: "Disfruta de todos los proveedores y beneficios.", button: "Elegir Plus", secondary: "Comparar planes", targetPlan: "plus" },
    },
    includes: {
      title: "¿Qué incluye este plan?",
      subtitle: "Plus — Experiencia completa",
      items: ["Todos los proveedores", "Todas las certificaciones", "Seguimiento avanzado", "IA Topo avanzada"],
      primaryButton: "Elegir Plus",
      secondaryButton: "Comparar planes",
    },
    domains: DOMAINS,
  },
};

function safePlanKey(value) {
  return PLAN_ORDER.includes(value) ? value : "free";
}

function PlanSelector({ selectedPlan, onChange }) {
  return (
    <section className="rounded-[20px] border border-black/10 bg-white p-4 shadow-[0_10px_28px_rgba(0,0,0,0.06)] md:p-5">
      <span className="!font-['Montserrat'] text-[11px] font-black uppercase tracking-[0.16em] text-[#7A6252]">
        Elige un plan para ver tu ruta
      </span>
      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        {PLAN_ORDER.map((key) => {
          const active = selectedPlan === key;
          return (
            <button key={key} type="button" onClick={() => onChange(key)}
              className={`rounded-[16px] border px-4 py-3 !font-['Montserrat'] text-sm font-black transition ${
                active ? "border-[#100A0D] bg-[#100A0D] text-white" : "border-black/10 bg-white text-[#6E5B4E] hover:border-[#1941CF]/40 hover:text-[#1941CF]"
              }`}>
              {CAREER_PLANS[key].selectorLabel}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TopoMessage({ title, description, highlight }) {
  return (
    <section className="relative mt-4 rounded-[20px] border border-[#1941CF]/20 bg-[#EEF1F8] px-5 py-5 pl-16 md:ml-12 md:pl-5">
      <div className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[linear-gradient(135deg,#3159E8,#145C5B)] text-white shadow-[0_10px_28px_rgba(25,65,207,0.35)] md:-left-12">★</div>
      <h2 className="!font-['Montserrat'] text-base font-black text-[#111111]">{title}</h2>
      <p className="mt-1 !font-['Montserrat'] text-sm leading-relaxed text-neutral-500">{description}</p>
      {highlight && <p className="mt-1 !font-['Montserrat'] text-sm font-bold text-[#1941CF]">{highlight}</p>}
    </section>
  );
}

function StatsGrid({ stats }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
      {stats.map((stat) => (
        <article key={`${stat.value}-${stat.label}`} className="rounded-[18px] border border-black/10 bg-white px-5 py-5 text-center shadow-[0_8px_22px_rgba(0,0,0,0.05)]">
          <strong className="block !font-['Montserrat'] text-xl font-black text-[#111111]">{stat.value}</strong>
          <span className="mt-1 block !font-['Montserrat'] text-xs text-[#806B5F]">{stat.label}</span>
        </article>
      ))}
    </div>
  );
}

function ProviderBadge({ children }) {
  return <span className="rounded-full border border-[#0458FF] px-2 py-0.5 !font-['Montserrat'] text-[10px] font-bold text-[#0458FF]">{children}</span>;
}

function CareerTimeline({ levels, selectedLevelId, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-6 md:grid-cols-3 md:px-12">
      {levels.map((level, index) => {
        const active = selectedLevelId === level.id;
        return (
          <button key={level.id} type="button" onClick={() => onSelect(level.id)} className="group relative flex min-w-0 flex-col items-center text-center">
            {index < levels.length - 1 && <span className="absolute left-[64%] top-6 hidden h-px w-[72%] bg-[#AFC0FF] md:block" />}
            <span className={`relative z-10 grid h-12 w-12 place-items-center rounded-full border-2 !font-['Montserrat'] text-sm font-black transition ${
              active ? "border-[#1941CF] bg-[#1941CF] text-white shadow-[0_10px_24px_rgba(25,65,207,0.25)]" : "border-neutral-200 bg-white text-[#76675D]"
            }`}>{level.number}</span>
            <strong className="mt-2 !font-['Montserrat'] text-sm font-black text-[#111111]">{level.title}</strong>
            <span className="!font-['Montserrat'] text-xs text-[#806B5F]">{level.level}</span>
            <span className={`mt-1 rounded-full px-3 py-1 !font-['Montserrat'] text-[10px] font-bold ${
              level.status === "En progreso" ? "bg-[#E8ECFF] text-[#1941CF]" : "bg-[#EAF8EF] text-[#4BBF72]"
            }`}>{level.status}</span>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {level.providers.map((provider) => <ProviderBadge key={provider}>{provider}</ProviderBadge>)}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <article className="rounded-[16px] border border-black/10 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-[#EEF2FF] px-2 py-1 !font-['Montserrat'] text-[9px] font-black text-[#0458FF]">{course.provider}</span>
        <span className="!font-['Montserrat'] text-[10px] text-neutral-400">{course.duration}</span>
      </div>
      <h4 className="mt-2 !font-['Montserrat'] text-sm font-black text-[#111111]">{course.title}</h4>
      <p className="!font-['Montserrat'] text-[11px] text-[#806B5F]">{course.institution}</p>
      <a href={course.url || "#"} className="mt-3 inline-flex !font-['Montserrat'] text-xs font-black text-[#1941CF]">Ver curso →</a>
    </article>
  );
}

function LevelDetail({ level }) {
  if (!level) return <div className="border-t border-black/10 p-8 text-center !font-['Montserrat'] text-neutral-500">Agrega los niveles de este plan en CAREER_PLANS.</div>;
  return (
    <div className="border-t border-black/10 px-5 py-6 md:px-7">
      <h3 className="!font-['Montserrat'] text-base font-black text-[#111111]">
        {level.number} · {level.title} <span className="font-normal text-[#806B5F]">— {level.level}</span>
      </h3>
      <p className="mt-1 !font-['Montserrat'] text-sm text-[#806B5F]">{level.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {level.skills.map((skill, index) => <span key={`${skill}-${index}`} className="rounded-full border border-black/10 bg-white px-3 py-1.5 !font-['Montserrat'] text-xs text-[#806B5F]">{skill}</span>)}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <h4 className="!font-['Montserrat'] text-xs font-black uppercase tracking-[0.08em] text-[#111111]">Cursos en este nivel — {level.coursesLabel}</h4>
        <ProviderBadge>{level.catalogLabel}</ProviderBadge>
      </div>
      {level.courses.length ? (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {level.courses.map((course, index) => <CourseCard key={`${course.title}-${index}`} course={course} />)}
        </div>
      ) : (
        <div className="mt-4 rounded-[16px] border border-black/10 bg-white px-5 py-5 text-center">
          <span className="!font-['Montserrat'] text-sm text-[#806B5F]">{level.emptyMessage}</span>{" "}
          {level.emptyAction && <a href={level.emptyUrl || "#"} className="!font-['Montserrat'] text-base font-black text-[#1941CF]">{level.emptyAction} →</a>}
        </div>
      )}
      {level.footer && (
        <div className="mt-4 flex flex-col gap-3 rounded-[14px] border border-black/10 bg-white px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <strong className="!font-['Montserrat'] text-xs text-[#111111]">{level.footer.title}</strong>
            {level.footer.analysis && <span className="!font-['Montserrat'] text-[11px] text-[#4BBF72]">★ {level.footer.analysis}</span>}
            <span className="!font-['Montserrat'] text-[11px] text-[#806B5F]">{level.footer.benefit}</span>
          </div>
          {level.footer.action && <a href={level.footer.url || "#"} className="!font-['Montserrat'] text-xs font-black text-[#1941CF]">{level.footer.action} →</a>}
        </div>
      )}
    </div>
  );
}

function PotentialSection({ potential, onPlanAction, onComparePlans }) {
  if (!potential) return null;

  const skills = Array.isArray(potential.skills)
    ? potential.skills
    : [];

  return (
    <section className="mt-5 rounded-[20px] border border-[#1941CF]/20 bg-[#F1F2F6] p-5 md:p-6">
      <TopoMessage
        title={potential.title}
        description={potential.description}
      />

      <div className="mt-5 space-y-5">
        {skills.map((skill) => {
          const currentHours = Math.max(
            0,
            Number(skill.currentHours) || 0
          );

          const nextPlanHours = Math.max(
            currentHours,
            Number(skill.targetHours) || currentHours
          );

          /*
           * scaleMaxHours controla el ancho total de la barra.
           * Puede definirse globalmente en potential o individualmente
           * dentro de cada skill.
           */
          const scaleMaxHours = Math.max(
            nextPlanHours,
            Number(skill.scaleMaxHours) ||
              Number(potential.scaleMaxHours) ||
              nextPlanHours ||
              1
          );

          const currentPercent = Math.min(
            100,
            Math.max(
              0,
              (currentHours / scaleMaxHours) * 100
            )
          );

          const nextPlanPercent = Math.min(
            100 - currentPercent,
            Math.max(
              0,
              ((nextPlanHours - currentHours) /
                scaleMaxHours) *
                100
            )
          );

          return (
            <div key={skill.name}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="!font-['Montserrat'] text-sm text-[#111111]">
                    {skill.name}
                  </strong>

                  <span className="rounded-full bg-[#E2E7FA] px-2 py-1 !font-['Montserrat'] text-[10px] font-bold text-[#1941CF]">
                    {skill.badge}
                  </span>
                </div>

                <strong className="!font-['Montserrat'] text-xs text-[#1941CF]">
                  {currentHours}h de aprendizaje
                </strong>
              </div>

              {/*
               * Azul sólido: lo incluido en el plan seleccionado.
               * Azul rayado: lo que podría alcanzar con el siguiente plan.
               * Gris: capacidad restante de la escala.
               */}
              <div
                className="mt-2 flex h-3 overflow-hidden rounded-full bg-[#DADBDF]"
                role="progressbar"
                aria-label={`Progreso de ${skill.name}`}
                aria-valuemin={0}
                aria-valuemax={scaleMaxHours}
                aria-valuenow={currentHours}
              >
                <div
                  className="h-full shrink-0 bg-[#1941CF]"
                  style={{
                    width: `${currentPercent}%`,
                  }}
                />

                {nextPlanPercent > 0 && (
                  <div
                    className="h-full shrink-0 border-l border-white/50"
                    style={{
                      width: `${nextPlanPercent}%`,
                      backgroundColor: "#DCE5FF",
                      backgroundImage:
                        "repeating-linear-gradient(135deg, rgba(25,65,207,0.38) 0px, rgba(25,65,207,0.38) 4px, transparent 4px, transparent 8px)",
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>

              <p className="mt-1 !font-['Montserrat'] text-[11px] text-[#806B5F]">
                {skill.nextText}{" "}
                <strong className="text-[#1941CF]">
                  ({skill.gain})
                </strong>
              </p>
            </div>
          );
        })}
      </div>

      {potential.cta && (
        <div className="mt-5 flex flex-col gap-4 rounded-[16px] border border-[#1941CF]/15 bg-white p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="!font-['Montserrat'] text-base font-black text-[#111111]">
              {potential.cta.title}
            </h3>

            <p className="mt-1 !font-['Montserrat'] text-sm text-[#806B5F]">
              {potential.cta.description}
            </p>
          </div>

          <div className="shrink-0 text-center">
            <button
              type="button"
              onClick={() =>
                onPlanAction?.(
                  potential.cta.targetPlan
                )
              }
              className="rounded-[16px] bg-[#1941CF] px-5 py-3 !font-['Montserrat'] text-sm font-black text-white"
            >
              {potential.cta.button}
            </button>

            <button
              type="button"
              onClick={onComparePlans}
              className="mt-2 block w-full !font-['Montserrat'] text-sm text-[#6E5B4E]"
            >
              {potential.cta.secondary}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}


function IncludesCard({ includes, onPlanAction, onComparePlans, planKey }) {
  return (
    <section className="rounded-[20px] border border-black/10 bg-white p-5 shadow-[0_8px_22px_rgba(0,0,0,0.05)]">
      <h3 className="!font-['Montserrat'] text-lg font-black text-[#111111]">{includes.title}</h3>
      <p className="!font-['Montserrat'] text-sm text-[#806B5F]">{includes.subtitle}</p>
      <ul className="mt-5 space-y-3">
        {includes.items.map((item) => <li key={item} className="flex gap-3 !font-['Montserrat'] text-sm text-[#6E5B4E]"><span className="font-black text-[#4BBF72]">✓</span>{item}</li>)}
      </ul>
      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button type="button" onClick={() => onPlanAction?.(planKey)} className="rounded-[15px] bg-[#1941CF] px-4 py-3 !font-['Montserrat'] text-sm font-black text-white">{includes.primaryButton}</button>
        <button type="button" onClick={onComparePlans} className="rounded-[15px] border border-black/10 bg-white px-4 py-3 !font-['Montserrat'] text-sm font-black text-[#111111]">{includes.secondaryButton}</button>
      </div>
    </section>
  );
}

function DomainsCard({ domains }) {
  return (
    <section className="rounded-[20px] border border-black/10 bg-white p-5 shadow-[0_8px_22px_rgba(0,0,0,0.05)]">
      <h3 className="!font-['Montserrat'] text-lg font-black text-[#111111]">🗺️ Mapa de Dominios</h3>
      <p className="!font-['Montserrat'] text-sm text-[#806B5F]">Tu cobertura actual en los 11 dominios</p>
      <div className="mt-5 max-h-[420px] space-y-3 overflow-y-auto pr-2">
        {domains.map((domain) => (
          <div key={domain.name} className="grid grid-cols-[minmax(0,1fr)_64px_34px] items-center gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate !font-['Montserrat'] text-xs text-[#111111]">{domain.name}</span>
              {domain.inRoute && <span className="shrink-0 rounded-full bg-[#E7EAFE] px-2 py-0.5 !font-['Montserrat'] text-[9px] font-bold text-[#1941CF]">• ruta</span>}
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200"><div className="h-full rounded-full bg-[#1941CF]" style={{ width: `${domain.value}%` }} /></div>
            <span className="!font-['Montserrat'] text-[10px] font-bold text-[#1941CF]">{domain.value}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CareerTab({ learningRoute, currentPlanKey = "free", onPlanAction, onComparePlans }) {
  const normalizedCurrentPlan = safePlanKey(currentPlanKey);
  const [selectedPlanKey, setSelectedPlanKey] = useState(normalizedCurrentPlan);
  const [selectedLevelId, setSelectedLevelId] = useState(1);

  useEffect(() => setSelectedPlanKey(normalizedCurrentPlan), [normalizedCurrentPlan]);

  const plan = useMemo(() => CAREER_PLANS[selectedPlanKey] || CAREER_PLANS.free, [selectedPlanKey]);

  useEffect(() => setSelectedLevelId(plan.levels?.[0]?.id || 1), [selectedPlanKey, plan.levels]);

  const personalizedTopics = Array.isArray(learningRoute?.topics) ? learningRoute.topics.filter(Boolean) : [];
  const visiblePlan = useMemo(() => {
    if (!personalizedTopics.length || !plan.levels?.length) return plan;
    return {
      ...plan,
      levels: plan.levels.map((level, index) => ({
        ...level,
        skills: index === 0
          ? Array.from(new Set([...personalizedTopics.slice(0, 3), ...level.skills])).slice(0, 4)
          : level.skills,
      })),
    };
  }, [plan, personalizedTopics]);

  const selectedLevel = visiblePlan.levels.find((level) => level.id === selectedLevelId);

  return (
    <div className="w-full pb-8">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="!font-['Montserrat'] text-[2rem] font-bold leading-[1.05em] text-[#111111]">Plan de Carrera</h1>
          <p className="mt-1 !font-['Montserrat'] text-sm text-[#806B5F]">Tu hoja de ruta profesional personalizada por Topo</p>
        </div>
        <span className="w-fit rounded-full bg-[#E9ECF8] px-4 py-2 !font-['Montserrat'] text-xs font-black text-[#1941CF]">★ Análisis de Topo</span>
      </div>

      <PlanSelector selectedPlan={selectedPlanKey} onChange={setSelectedPlanKey} />
      <TopoMessage {...visiblePlan.intro} />
      <StatsGrid stats={visiblePlan.stats} />

      <section className="mt-4 overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
        <CareerTimeline levels={visiblePlan.levels} selectedLevelId={selectedLevelId} onSelect={setSelectedLevelId} />
        <LevelDetail level={selectedLevel} />
      </section>

      <PotentialSection potential={visiblePlan.potential} onPlanAction={onPlanAction} onComparePlans={onComparePlans} />

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <IncludesCard includes={visiblePlan.includes} planKey={visiblePlan.key} onPlanAction={onPlanAction} onComparePlans={onComparePlans} />
        <DomainsCard domains={visiblePlan.domains || []} />
      </div>
    </div>
  );
}