// src/components/account/AvailableCoursesTab.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Search,
  Star,
} from "lucide-react";


function getLabel(value) {
  if (value == null) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }

  if (typeof value === "object") {
    return String(
      value.name ||
        value.nombre ||
        value.label ||
        value.title ||
        value.value ||
        ""
    ).trim();
  }

  return "";
}

function uniqueLabels(values = []) {
  return Array.from(
    new Set(
      values
        .flatMap((value) => {
          if (Array.isArray(value)) return value;
          if (typeof value === "string" && value.includes(",")) {
            return value.split(",");
          }
          return value == null ? [] : [value];
        })
        .map(getLabel)
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

function formatCompactNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;

  try {
    return new Intl.NumberFormat("es-CO").format(number);
  } catch {
    return String(Math.round(number));
  }
}

function formatDecimal(value, maximumFractionDigits = 1) {
  const rounded = Number(value);
  if (!Number.isFinite(rounded)) return "";

  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits,
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 1,
  }).format(rounded);
}

/**
 * Convierte la duración que llega desde el backend a una lectura humana.
 *
 * El payload puede traer la duración como:
 * - número de segundos: 324000
 * - string numérico: "324000"
 * - string con unidad: "324000s", "86400 sec", "108000 segundos"
 * - horas/días/semanas ya expresados como texto
 *
 * Ejemplos:
 *  7.200 s     -> 2 horas
 *  86.400 s    -> 1 día
 *  108.000 s   -> 1 día 6 horas
 *  324.000 s   -> 3 días 18 horas
 *  604.800 s   -> 1 semana
 */
function pluralize(value, singular, plural) {
  return `${value} ${value === 1 ? singular : plural}`;
}

function parseNumericValue(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") return null;

  const normalized = value.trim().replace(/\s+/g, "").replace(",", ".");

  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return null;

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function formatSeconds(seconds) {
  const parsed = parseNumericValue(seconds);

  if (parsed == null || parsed <= 0) {
    return "Duración flexible";
  }

  // Redondeamos al minuto más cercano para no mostrar segundos residuales.
  const totalMinutes = Math.max(1, Math.round(parsed / 60));

  if (totalMinutes < 60) {
    return pluralize(totalMinutes, "minuto", "minutos");
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (totalHours < 24) {
    if (remainingMinutes === 0) {
      return pluralize(totalHours, "hora", "horas");
    }

    return `${pluralize(totalHours, "hora", "horas")} ${pluralize(
      remainingMinutes,
      "minuto",
      "minutos"
    )}`;
  }

  const totalDays = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  if (totalDays < 7) {
    if (remainingHours === 0) {
      return pluralize(totalDays, "día", "días");
    }

    return `${pluralize(totalDays, "día", "días")} ${pluralize(
      remainingHours,
      "hora",
      "horas"
    )}`;
  }

  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  if (remainingDays === 0 && remainingHours === 0) {
    return pluralize(totalWeeks, "semana", "semanas");
  }

  const parts = [pluralize(totalWeeks, "semana", "semanas")];

  if (remainingDays > 0) {
    parts.push(pluralize(remainingDays, "día", "días"));
  }

  if (remainingHours > 0 && totalWeeks < 2) {
    parts.push(pluralize(remainingHours, "hora", "horas"));
  }

  return parts.join(" ");
}

function formatMinutes(minutes) {
  const value = parseNumericValue(minutes);
  if (value == null || value <= 0) return "";
  return formatSeconds(value * 60);
}

function formatHours(hours) {
  const value = parseNumericValue(hours);
  if (value == null || value <= 0) return "";
  return formatSeconds(value * 3600);
}

function formatDays(days) {
  const value = parseNumericValue(days);
  if (value == null || value <= 0) return "";
  return formatSeconds(value * 86400);
}

function formatWeeks(weeks) {
  const value = parseNumericValue(weeks);
  if (value == null || value <= 0) return "";
  return formatSeconds(value * 604800);
}

function formatDurationString(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  // Si viene solamente el número, en este contrato lo interpretamos como segundos.
  if (/^\d+(?:[.,]\d+)?$/.test(raw)) {
    return formatSeconds(raw.replace(",", "."));
  }

  const match = raw.match(
    /^\s*(\d+(?:[.,]\d+)?)\s*(ms|milliseconds?|milisegundos?|s|sec|secs|seconds?|seg|segs|segundos?|m|min|mins|minutes?|minutos?|h|hr|hrs|hours?|horas?|d|day|days|d[ií]a|d[ií]as|w|wk|wks|week|weeks|semana|semanas)\s*$/i
  );

  if (!match) {
    // Ya es un texto legible del backend, por ejemplo "A tu ritmo".
    return raw;
  }

  const amount = match[1].replace(",", ".");
  const unit = match[2].toLowerCase();

  if (/^(ms|millisecond|milliseconds|milisegundo|milisegundos)$/.test(unit)) {
    return formatSeconds(Number(amount) / 1000);
  }

  if (/^(s|sec|secs|second|seconds|seg|segs|segundo|segundos)$/.test(unit)) {
    return formatSeconds(amount);
  }

  if (/^(m|min|mins|minute|minutes|minuto|minutos)$/.test(unit)) {
    return formatMinutes(amount);
  }

  if (/^(h|hr|hrs|hour|hours|hora|horas)$/.test(unit)) {
    return formatHours(amount);
  }

  if (/^(d|day|days|día|días|dia|dias)$/.test(unit)) {
    return formatDays(amount);
  }

  if (/^(w|wk|wks|week|weeks|semana|semanas)$/.test(unit)) {
    return formatWeeks(amount);
  }

  return raw;
}

function formatCourseDuration(item = {}) {
  const explicitSeconds =
    item.duration_seconds ??
    item.durationSeconds ??
    item.duration_in_seconds ??
    item.durationInSeconds ??
    item.total_duration_seconds ??
    item.totalDurationSeconds ??
    item.estimated_duration_seconds ??
    item.estimatedDurationSeconds;

  if (explicitSeconds != null && explicitSeconds !== "") {
    // Algunos endpoints incluso agregan la "s" al campo de segundos.
    const formatted = formatDurationString(explicitSeconds);
    if (formatted) return formatted;
  }

  const rawDuration =
    item.duration ??
    item.tiempo ??
    item.course_duration ??
    item.courseDuration ??
    item.estimated_duration ??
    item.estimatedDuration;

  if (rawDuration != null && rawDuration !== "") {
    const formatted = formatDurationString(rawDuration);
    if (formatted) return formatted;
  }

  if (item.minutes != null && item.minutes !== "") {
    const formattedMinutes = formatMinutes(item.minutes);
    if (formattedMinutes) return formattedMinutes;
  }

  if (item.hours != null && item.hours !== "") {
    const formattedHours = formatHours(item.hours);
    if (formattedHours) return formattedHours;
  }

  if (item.days != null && item.days !== "") {
    const formattedDays = formatDays(item.days);
    if (formattedDays) return formattedDays;
  }

  if (item.weeks != null && item.weeks !== "") {
    const formattedWeeks = formatWeeks(item.weeks);
    if (formattedWeeks) return formattedWeeks;
  }

  return "Duración flexible";
}

function normalizeLevel(value) {
  const raw = getLabel(value).toLowerCase();
  if (!raw) return "";

  if (
    ["beginner", "basic", "principiante", "introductory", "introductorio"].includes(
      raw
    )
  ) {
    return "Principiante";
  }

  if (
    ["intermediate", "intermedio", "medium", "medio"].includes(raw)
  ) {
    return "Intermedio";
  }

  if (
    ["advanced", "avanzado", "expert", "experto"].includes(raw)
  ) {
    return "Avanzado";
  }

  return getLabel(value);
}

function normalizeRating(item = {}) {
  const raw =
    item.rating ??
    item.average_rating ??
    item.averageRating ??
    item.avg_rating ??
    item.avgRating ??
    item.stars ??
    null;

  const value = Number(raw);

  if (!Number.isFinite(value) || value <= 0 || value > 5) {
    return null;
  }

  return Math.round(value * 10) / 10;
}

function normalizeEnrollmentCount(item = {}) {
  const raw =
    item.students_enrolled ??
    item.studentsEnrolled ??
    item.enrollment_count ??
    item.enrollmentCount ??
    item.enrolled_count ??
    item.enrolledCount ??
    item.learners_count ??
    item.learnersCount ??
    null;

  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function normalizeCourse(item = {}) {
  const topic =
    item.topic?.name ||
    item.topic?.nombre ||
    item.topicName ||
    item.topic_name ||
    "";

  const skills = uniqueLabels([
    item.skills,
    item.habilidades,
    item.skill_names,
    item.skillNames,
    item.topics,
    topic,
  ]);

  return {
    id:
      item.routeItemId ??
      item.route_item_id ??
      item.id ??
      item.idInterno ??
      item.id_interno,
    idInterno: item.idInterno || item.id_interno || "",
    title: item.title || item.nombre || "Curso disponible",
    provider: item.provider || item.platform || item.plataforma || "Top Education",
    institution:
      item.institution ||
      item.university?.name ||
      item.university?.nombre ||
      item.company?.name ||
      item.company?.nombre ||
      "",
    duration: formatCourseDuration(item),
    rating: normalizeRating(item),
    level: normalizeLevel(
      item.level ||
        item.nivel ||
        item.difficulty ||
        item.difficulty_level ||
        item.difficultyLevel ||
        item.course_level ||
        item.courseLevel ||
        item.level_name ||
        item.levelName
    ),
    language: item.language || item.lenguaje || "",
    image: item.image || item.imagen || item.image_url || item.imageUrl || "",
    url:
      item.url ||
      item.previewUrl ||
      item.preview_url ||
      item.originalUrl ||
      item.original_url ||
      item.detailUrl ||
      item.detail_url ||
      "#",
    topic,
    skills,
    enrollmentCount: normalizeEnrollmentCount(item),
    available: item.available !== false && item.is_available !== false,
  };
}

function CourseImage({ course }) {
  const fallbackInitial = String(
    course.institution || course.title || "T"
  )
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="relative h-[160px] overflow-hidden bg-[linear-gradient(135deg,#BF2834_0%,#F34349_100%)]">
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 !font-['Montserrat'] text-base font-bold backdrop-blur-sm">
          {fallbackInitial}
        </span>
        <span className="mt-3 line-clamp-2 !font-['Montserrat'] text-[12px] font-medium leading-snug text-white/95">
          {course.title}
        </span>
      </div>

      {course.image && (
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}

      {course.level && (
        <span className="absolute right-4 top-3 z-10 rounded-full border border-black/5 bg-white px-3.5 py-1 !font-['Montserrat'] text-[11px] font-semibold text-[#172033] shadow-[0_4px_14px_rgba(15,23,42,0.08)]">
          {course.level}
        </span>
      )}
    </div>
  );
}

function CourseCard({ course }) {
  const canOpen = course.available && course.url && course.url !== "#";
  const visibleSkills = course.skills.slice(0, 2);
  const hiddenSkills = Math.max(0, course.skills.length - visibleSkills.length);
  const studentsLabel =
    course.enrollmentCount != null
      ? `${formatCompactNumber(course.enrollmentCount)} estudiantes inscritos`
      : "Incluido en tu ruta de aprendizaje";

  return (
    <article className="group flex h-full min-h-[424px] flex-col overflow-hidden rounded-[17px] border border-[#E1E6EF] bg-white shadow-[0_7px_22px_rgba(17,29,49,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#CFD8E7] hover:shadow-[0_18px_38px_rgba(17,29,49,0.09)]">
      <CourseImage course={course} />

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <span className="!font-['Montserrat'] text-[11px] font-semibold uppercase tracking-[0.02em] text-[#768197]">
          {course.provider}
        </span>

        <h2 className="mt-2 line-clamp-2 min-h-[44px] !font-['Montserrat'] text-[15px] font-medium leading-[1.45] text-[#111A2B]">
          {course.title}
        </h2>

        {course.institution && (
          <p className="mt-1 line-clamp-1 min-h-[16px] !font-['Montserrat'] text-[11px] text-[#8A94A6]">
            {course.institution}
          </p>
        )}

        <div className="mt-3 flex min-h-[22px] flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-1.5 !font-['Montserrat'] text-[11px] text-[#6E788B]">
            <Clock3 size={14} strokeWidth={1.8} />
            {course.duration}
          </span>

          <span
            className={`inline-flex min-w-[42px] items-center gap-1 !font-['Montserrat'] text-[11px] font-medium ${
              course.rating != null ? "text-[#172033]" : "text-[#AEB6C3]"
            }`}
            title={
              course.rating != null
                ? `Calificación ${formatDecimal(course.rating)}/5`
                : "Calificación aún no disponible"
            }
          >
            <Star
              size={14}
              strokeWidth={1.8}
              className={
                course.rating != null
                  ? "fill-[#F9B400] text-[#F9B400]"
                  : "text-[#C9CFD9]"
              }
            />
            {course.rating != null ? formatDecimal(course.rating) : "—"}
          </span>
        </div>

        <div className="mt-4 min-h-[54px]">
          <span className="block !font-['Montserrat'] text-[10px] font-medium uppercase tracking-[0.08em] text-[#7C879A]">
            Habilidades
          </span>

          <div className="mt-2 flex flex-wrap gap-2">
            {visibleSkills.length ? (
              <>
                {visibleSkills.map((skill) => (
                  <span
                    key={skill}
                    className="max-w-full truncate rounded-full bg-[#F6F8FB] px-3 py-1.5 !font-['Montserrat'] text-[10px] font-medium text-[#3C4659]"
                    title={skill}
                  >
                    {skill}
                  </span>
                ))}

                {hiddenSkills > 0 && (
                  <span className="rounded-full bg-[#F6F8FB] px-3 py-1.5 !font-['Montserrat'] text-[10px] font-semibold text-[#687386]">
                    +{hiddenSkills}
                  </span>
                )}
              </>
            ) : (
              <span className="!font-['Montserrat'] text-[10px] text-[#A0A8B6]">
                Por definir
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex min-h-[21px] items-center gap-2 !font-['Montserrat'] text-[10.5px] text-[#7D8798]">
          <BookOpen size={14} strokeWidth={1.6} />
          <span className="line-clamp-1">{studentsLabel}</span>
        </div>

        <div className="mt-auto pt-4">
          {canOpen ? (
            <a
              href={course.url}
              target={course.url.startsWith("http") ? "_blank" : undefined}
              rel={
                course.url.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="flex h-[38px] w-full items-center justify-center gap-2 rounded-[11px] bg-[#111D31] px-4 !font-['Montserrat'] text-[12px] font-medium text-white transition hover:bg-[#1C2D4A]"
            >
              Ver detalles
              <ArrowRight
                size={15}
                strokeWidth={1.8}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          ) : (
            <div className="flex h-[38px] w-full items-center justify-center rounded-[11px] bg-[#E9EDF3] px-4 !font-['Montserrat'] text-[12px] font-semibold text-[#8B95A6]">
              Curso no disponible
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function AvailableCoursesTab({ backendBaseUrl = "" }) {
  const endpoint = `${String(backendBaseUrl || "").replace(
    /\/+$/,
    ""
  )}/api/account/available-courses/`;

  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ providers: [], topics: [] });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 18,
    total: 0,
    totalPages: 1,
  });

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchText.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const controller = new AbortController();

    const loadCourses = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          page_size: "18",
        });

        if (debouncedSearch) params.set("q", debouncedSearch);
        if (selectedProvider) params.set("provider", selectedProvider);
        if (selectedTopic) params.set("topic_id", selectedTopic);

        const response = await fetch(`${endpoint}?${params.toString()}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok || payload?.ok === false) {
          throw new Error(
            payload?.message ||
              payload?.error ||
              "No fue posible cargar los cursos."
          );
        }

        const data = payload?.data || payload;
        const rawItems = data?.items || data?.courses || [];

        setCourses(
          (Array.isArray(rawItems) ? rawItems : []).map(normalizeCourse)
        );

        setFilters({
          providers: Array.isArray(data?.filters?.providers)
            ? data.filters.providers
            : [],
          topics: Array.isArray(data?.filters?.topics)
            ? data.filters.topics
            : [],
        });

        setPagination({
          page: Number(data?.pagination?.page || page),
          pageSize: Number(
            data?.pagination?.pageSize || data?.pagination?.page_size || 18
          ),
          total: Number(data?.pagination?.total || rawItems.length),
          totalPages: Math.max(
            1,
            Number(
              data?.pagination?.totalPages ||
                data?.pagination?.total_pages ||
                1
            )
          ),
        });
      } catch (error) {
        if (error?.name === "AbortError") return;
        console.error("Error cargando cursos disponibles:", error);
        setErrorMsg(error?.message || "No fue posible cargar los cursos.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
    return () => controller.abort();
  }, [endpoint, page, debouncedSearch, selectedProvider, selectedTopic]);

  const providerOptions = useMemo(
    () =>
      filters.providers.map((provider) =>
        typeof provider === "string"
          ? { value: provider, label: provider }
          : {
              value: provider.value || provider.name || provider.nombre || "",
              label: provider.label || provider.name || provider.nombre || "",
            }
      ),
    [filters.providers]
  );

  const topicOptions = useMemo(
    () =>
      filters.topics.map((topic) =>
        typeof topic === "string"
          ? { value: topic, label: topic }
          : {
              value: topic.id ?? topic.value ?? topic.slug ?? "",
              label: topic.name || topic.nombre || topic.label || "",
            }
      ),
    [filters.topics]
  );

  return (
    <div className="w-full pb-10">
      <div>
        <h1 className="!font-['Montserrat'] text-[2rem] font-semibold leading-[1.05em] tracking-[-0.035em] text-[#121B2D]">
          Cursos disponibles
        </h1>
        <p className="mt-2 !font-['Montserrat'] text-sm text-[#7B8699]">
          Cursos que forman parte de tu ruta completa de aprendizaje ·{" "}
          <strong className="font-semibold text-[#465166]">
            {pagination.total} {pagination.total === 1 ? "curso" : "cursos"}
          </strong>
        </p>
      </div>

      <section className="mt-6 rounded-[20px] border border-[#E4E8EF] bg-white p-4 shadow-[0_7px_24px_rgba(17,29,49,0.035)] md:p-5">
        <div className="relative">
          <Search
            size={19}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8791A3]"
          />
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Buscar curso, institución o habilidad..."
            className="h-[50px] w-full rounded-[13px] border border-[#DEE3EB] bg-[#FBFCFD] pl-12 pr-5 !font-['Montserrat'] text-sm text-[#172033] outline-none transition placeholder:text-[#A3ACBA] focus:border-[#4569A7]/60 focus:bg-white focus:ring-4 focus:ring-[#4569A7]/[0.07]"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedTopic("");
              setPage(1);
            }}
            className={`rounded-full border px-4 py-2 !font-['Montserrat'] text-[11px] font-semibold transition ${
              !selectedTopic
                ? "border-transparent bg-[linear-gradient(135deg,#111D31_0%,#4266A4_100%)] text-white shadow-[0_7px_18px_rgba(48,79,134,0.16)]"
                : "border-[#E1E6ED] bg-white text-[#5F6A7D] hover:border-[#C9D2E0]"
            }`}
          >
            Todos ({pagination.total})
          </button>

          {topicOptions.map((topic) => (
            <button
              key={`${topic.value}-${topic.label}`}
              type="button"
              onClick={() => {
                setSelectedTopic(String(topic.value));
                setPage(1);
              }}
              className={`rounded-full border px-4 py-2 !font-['Montserrat'] text-[11px] font-semibold transition ${
                String(selectedTopic) === String(topic.value)
                  ? "border-transparent bg-[linear-gradient(135deg,#111D31_0%,#4266A4_100%)] text-white"
                  : "border-[#E1E6ED] bg-white text-[#5F6A7D] hover:border-[#C9D2E0]"
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>

        {providerOptions.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#EEF1F5] pt-4">
            <span className="mr-1 !font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A94A6]">
              Proveedor
            </span>

            <button
              type="button"
              onClick={() => {
                setSelectedProvider("");
                setPage(1);
              }}
              className={`rounded-full px-3 py-1.5 !font-['Montserrat'] text-[10px] font-semibold transition ${
                !selectedProvider
                  ? "bg-[#EAF0FA] text-[#31578F]"
                  : "bg-[#F7F9FB] text-[#7A8597] hover:text-[#42506A]"
              }`}
            >
              Todos
            </button>

            {providerOptions.map((provider) => (
              <button
                key={provider.value}
                type="button"
                onClick={() => {
                  setSelectedProvider(provider.value);
                  setPage(1);
                }}
                className={`rounded-full px-3 py-1.5 !font-['Montserrat'] text-[10px] font-semibold transition ${
                  selectedProvider === provider.value
                    ? "bg-[#EAF0FA] text-[#31578F]"
                    : "bg-[#F7F9FB] text-[#7A8597] hover:text-[#42506A]"
                }`}
              >
                {provider.label}
              </button>
            ))}
          </div>
        )}
      </section>

      {errorMsg && (
        <div className="mt-5 rounded-[15px] border border-red-100 bg-red-50 px-5 py-4 !font-['Montserrat'] text-sm font-medium text-red-600">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="h-[424px] animate-pulse rounded-[17px] border border-[#E7EBF1] bg-white"
            >
              <div className="h-[160px] bg-[#EEF2F6]" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-14 rounded-full bg-[#E9EDF2]" />
                <div className="h-4 w-5/6 rounded-full bg-[#E9EDF2]" />
                <div className="h-4 w-3/5 rounded-full bg-[#E9EDF2]" />
                <div className="h-3 w-2/5 rounded-full bg-[#F0F2F5]" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length ? (
        <>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id || course.idInterno || course.title}
                course={course}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
                className="rounded-full border border-[#DDE3EB] bg-white px-5 py-2.5 !font-['Montserrat'] text-xs font-semibold text-[#354156] transition hover:border-[#C6D0DE] disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Anterior
              </button>

              <span className="!font-['Montserrat'] text-xs font-medium text-[#7D8798]">
                Página {pagination.page} de {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(pagination.totalPages, current + 1)
                  )
                }
                className="rounded-full bg-[#111D31] px-5 py-2.5 !font-['Montserrat'] text-xs font-semibold text-white transition hover:bg-[#1B2D4B] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 rounded-[20px] border border-[#E3E7EE] bg-white p-10 text-center shadow-[0_7px_24px_rgba(17,29,49,0.03)]">
          <h2 className="!font-['Montserrat'] text-xl font-semibold text-[#172033]">
            No encontramos cursos
          </h2>
          <p className="mt-2 !font-['Montserrat'] text-sm text-[#7D8798]">
            Prueba con otra búsqueda, proveedor o dominio.
          </p>
        </div>
      )}
    </div>
  );
}