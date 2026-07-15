// src/components/KnowledgeDomains.jsx

import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Code2,
  HeartPulse,
  Palette,
  Sparkles,
} from "lucide-react";

const KNOWLEDGE_DOMAINS = [
  {
    id: "technology-development",
    title: "Tecnología y Desarrollo",
    courses: "1,200+",
    certifications: "150+",
    accent: "#1941CF",
    softAccent: "#E9EEFF",
    borderAccent: "#1941CF",
    icon: Code2,
    skills: [
      {
        id: 4,
        name: "Software Development",
        icon: Code2,
      },
      {
        id: 27,
        name: "Cloud Computing",
        icon: Sparkles,
      },
      {
        id: 11798,
        name: "Python Programming",
        icon: Code2,
      },
      {
        id: 16,
        name: "Seguridad Digital",
        icon: Sparkles,
      },
      {
        id: 11267,
        name: "Automatización",
        icon: Sparkles,
      },
    ],
  },
  {
    id: "artificial-intelligence-data",
    title: "Inteligencia Artificial y Datos",
    courses: "900+",
    certifications: "120+",
    accent: "#5CC781",
    softAccent: "#E9F8EF",
    borderAccent: "#5CC781",
    icon: Bot,
    skills: [
      {
        id: 11223,
        name: "Inteligencia Artificial",
        icon: Bot,
      },
      {
        id: 11300,
        name: "IA Generativa",
        icon: Sparkles,
      },
      {
        id: 2,
        name: "Machine Learning",
        icon: Sparkles,
      },
      {
        id: 11335,
        name: "Prompt Engineering",
        icon: Code2,
      },
      {
        id: 14,
        name: "Análisis de Datos",
        icon: Sparkles,
      },
    ],
  },
  {
    id: "business-leadership",
    title: "Negocios y Liderazgo",
    courses: "800+",
    certifications: "100+",
    accent: "#F59E0B",
    softAccent: "#FFF3DB",
    borderAccent: "#F59E0B",
    icon: BriefcaseBusiness,
    skills: [
      {
        id: 11301,
        name: "Liderazgo",
        icon: Sparkles,
      },
      {
        id: 18,
        name: "Liderazgo y Gestión",
        icon: BriefcaseBusiness,
      },
      {
        id: 11261,
        name: "Estrategias de Negocio",
        icon: Sparkles,
      },
      {
        id: 15,
        name: "Emprendimiento",
        icon: Sparkles,
      },
      {
        id: 17,
        name: "Finanzas",
        icon: Sparkles,
      },
    ],
  },
  {
    id: "skills-methodologies",
    title: "Habilidades y Metodologías",
    courses: "700+",
    certifications: "80+",
    accent: "#EC4899",
    softAccent: "#FDEAF3",
    borderAccent: "#EC4899",
    icon: Sparkles,
    skills: [
      {
        id: 11736,
        name: "Diseño UX/UI",
        icon: Palette,
      },
      {
        id: 11272,
        name: "Innovación",
        icon: Sparkles,
      },
      {
        id: 11199,
        name: "Comunicación",
        icon: Sparkles,
      },
      {
        id: 12822,
        name: "Investigación",
        icon: Sparkles,
      },
      {
        id: 11299,
        name: "Toma de Decisiones",
        icon: Sparkles,
      },
    ],
  },/*
  {
    id: "creative-design",
    title: "Creatividad y Diseño",
    courses: "600+",
    certifications: "70+",
    accent: "#8B5CF6",
    softAccent: "#F0EAFE",
    borderAccent: "#8B5CF6",
    icon: Palette,
    skills: [
      {
        id: 501,
        name: "Diseño Gráfico",
        icon: Palette,
      },
      {
        id: 502,
        name: "Diseño de Producto",
        icon: Sparkles,
      },
      {
        id: 503,
        name: "Creatividad",
        icon: Sparkles,
      },
      {
        id: 504,
        name: "Experiencia de Usuario",
        icon: Palette,
      },
      {
        id: 505,
        name: "Innovación de Producto",
        icon: Sparkles,
      },
    ],
  },
  {
    id: "health-personal-development",
    title: "Salud y Desarrollo Personal",
    courses: "500+",
    certifications: "60+",
    accent: "#D33B3E",
    softAccent: "#FCEBEC",
    borderAccent: "#D33B3E",
    icon: HeartPulse,
    skills: [
      {
        id: 601,
        name: "Salud",
        icon: HeartPulse,
      },
      {
        id: 602,
        name: "Bienestar",
        icon: Sparkles,
      },
      {
        id: 603,
        name: "Desarrollo Personal",
        icon: Sparkles,
      },
      {
        id: 604,
        name: "Gestión del Tiempo",
        icon: Sparkles,
      },
      {
        id: 605,
        name: "Productividad",
        icon: Sparkles,
      },
    ],
  },*/
];

/**
 * Genera la URL de Explora usando uno o varios habilidad_id.
 *
 * Resultado para una habilidad:
 * /explora?habilidad_id=101
 *
 * Resultado para un dominio:
 * /explora?habilidad_id=101&habilidad_id=102&habilidad_id=103
 */
function buildExploreUrl(skillIds = []) {
  const params = new URLSearchParams();

  skillIds.forEach((skillId) => {
    if (skillId !== null && skillId !== undefined && skillId !== "") {
      params.append("habilidad_id", String(skillId));
    }
  });

  const queryString = params.toString();

  return queryString ? `/explora?idioma=en&idioma=es&${queryString}` : "/explora";
}

function KnowledgeDomainCard({ domain }) {
  const DomainIcon = domain.icon;

  const domainSkillIds = domain.skills.map((skill) => skill.id);
  const domainUrl = buildExploreUrl(domainSkillIds);

  return (
    <article
      className="knowledge-domain-card group relative flex min-h-[340px] flex-col overflow-hidden rounded-[26px] border border-black/[0.07] bg-white px-7 py-7 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-[var(--domain-accent)] hover:shadow-[0_28px_65px_rgba(15,9,11,0.12)] md:min-h-[360px] md:px-8 md:py-8"
      style={{
        "--domain-accent": domain.accent,
        "--domain-soft": domain.softAccent,
        "--domain-border": domain.borderAccent,
      }}
    >
      {/* Resplandor superior durante hover */}
      <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[var(--domain-accent)] opacity-0 blur-[90px] transition-opacity duration-500 group-hover:opacity-[0.12]" />

      <div className="relative z-10 flex h-full flex-1 flex-col">
        <div className="flex items-start justify-between gap-5">
          <div
            className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[18px] bg-[var(--domain-soft)] text-[var(--domain-accent)] transition-all duration-500 group-hover:-rotate-6 group-hover:scale-105 group-hover:bg-[var(--domain-accent)] group-hover:text-white group-hover:shadow-[0_16px_34px_color-mix(in_srgb,var(--domain-accent)_28%,transparent)]"
          >
            <DomainIcon
              size={34}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="rounded-full bg-[var(--domain-soft)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--domain-accent)] transition-all duration-500 group-hover:bg-[var(--domain-accent)] group-hover:text-white">
              {domain.courses} certificaciones
            </span>

            {/*<span className="rounded-full bg-[#F4F2F2] px-3.5 py-1.5 text-[12px] font-medium text-[#8A8480] transition-all duration-500 group-hover:bg-[var(--domain-soft)] group-hover:text-[var(--domain-accent)]">
              {domain.certifications} certs
            </span>*/}
          </div>
        </div>

        <h3 className="mt-5 font-['Montserrat'] text-[1.25rem] font-bold leading-[1.25em] text-[#151012] transition-colors duration-500 group-hover:text-[var(--domain-accent)] md:text-[1.35rem]">
          {domain.title}
        </h3>

        <div className="mt-5 flex flex-wrap gap-2">
          {domain.skills.map((skill) => {
            const SkillIcon = skill.icon;

            return (
              <Link
                key={`${domain.id}-${skill.id}`}
                to={buildExploreUrl([skill.id])}
                className="domain-skill-tag inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-transparent bg-[#F3F1F1] px-3.5 py-1.5 font-['Montserrat'] text-[12px] font-medium leading-none text-[#756F6B] transition-all duration-300 hover:!border-[var(--domain-accent)] hover:!bg-[var(--domain-accent)] hover:!text-white hover:shadow-[0_8px_18px_rgba(15,9,11,0.09)] group-hover:border-[color-mix(in_srgb,var(--domain-accent)_22%,transparent)] group-hover:bg-[var(--domain-soft)] group-hover:text-[var(--domain-accent)]"
                aria-label={`Explorar certificaciones de ${skill.name}`}
              >
                <SkillIcon
                  size={12}
                  strokeWidth={2}
                  aria-hidden="true"
                />

                <span>{skill.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pt-6">
          <div className="mb-5 h-px w-full bg-black/[0.08] transition-colors duration-500 group-hover:bg-[color-mix(in_srgb,var(--domain-accent)_22%,transparent)]" />

          <Link
            to={domainUrl}
            className="inline-flex items-center gap-3 font-['Montserrat'] text-[12px] font-bold uppercase tracking-[0.04em] text-[#595250] transition-colors duration-300 hover:text-[var(--domain-accent)] group-hover:text-[var(--domain-accent)]"
            aria-label={`Explorar el dominio ${domain.title}`}
          >
            <span>Explorar dominio</span>

            <ArrowRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

function KnowledgeDomains() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
      {KNOWLEDGE_DOMAINS.map((domain) => (
        <KnowledgeDomainCard
          key={domain.id}
          domain={domain}
        />
      ))}
    </div>
  );
}

export default KnowledgeDomains;