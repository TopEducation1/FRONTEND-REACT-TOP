// src/components/account/AvailableCoursesTab.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Search, ExternalLink } from "lucide-react";

function normalizeCourse(item = {}) {
  return {
    id: item.routeItemId ?? item.route_item_id ?? item.id ?? item.idInterno ?? item.id_interno,
    idInterno: item.idInterno || item.id_interno || "",
    title: item.title || item.nombre || "Curso disponible",
    provider: item.provider || item.platform || "Top Education",
    institution: item.institution || item.university?.name || item.company?.name || "",
    duration: item.duration || item.hours || item.tiempo || "Duración flexible",
    language: item.language || item.lenguaje || "",
    image: item.image || item.imagen || "",
    url:
      item.url ||
      item.previewUrl ||
      item.preview_url ||
      item.originalUrl ||
      item.original_url ||
      item.detailUrl ||
      "#",
    topic:
      item.topic?.name ||
      item.topic?.nombre ||
      item.topicName ||
      item.topic_name ||
      "",
    available: item.available !== false && item.is_available !== false,
  };
}

export default function AvailableCoursesTab({ backendBaseUrl = "" }) {
  const endpoint = `${String(backendBaseUrl || "").replace(/\/+$/, "")}/api/account/available-courses/`;

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

        setCourses((Array.isArray(rawItems) ? rawItems : []).map(normalizeCourse));

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
            data?.pagination?.pageSize ||
              data?.pagination?.page_size ||
              18
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
    <div className="w-full pb-8">
      <div>
        <h1 className="!font-['Montserrat'] text-[2rem] font-bold leading-[1.05em] text-[#111111]">
          Cursos disponibles
        </h1>
        <p className="mt-1 !font-['Montserrat'] text-sm text-[#806B5F]">
          Cursos que forman parte de tu ruta completa de aprendizaje ·{" "}
          {pagination.total} {pagination.total === 1 ? "curso" : "cursos"}
        </p>
      </div>

      <div className="relative mt-6">
        <Search
          size={20}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Buscar curso, institución o habilidad..."
          className="h-[54px] w-full rounded-[18px] border border-black/10 bg-white pl-12 pr-5 !font-['Montserrat'] text-sm text-[#111111] outline-none transition focus:border-[#1941CF]/45 focus:ring-4 focus:ring-[#1941CF]/5"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setSelectedTopic("");
            setPage(1);
          }}
          className={`rounded-full border px-4 py-2 !font-['Montserrat'] text-xs font-black transition ${
            !selectedTopic
              ? "border-[#100A0D] bg-[#100A0D] text-white"
              : "border-black/10 bg-white text-[#6E5B4E]"
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
            className={`rounded-full border px-4 py-2 !font-['Montserrat'] text-xs font-bold transition ${
              String(selectedTopic) === String(topic.value)
                ? "border-[#1941CF] bg-[#1941CF] text-white"
                : "border-black/10 bg-white text-[#6E5B4E]"
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>

      {providerOptions.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="!font-['Montserrat'] text-xs font-black uppercase tracking-[0.12em] text-neutral-400">
            Proveedor
          </span>

          <button
            type="button"
            onClick={() => {
              setSelectedProvider("");
              setPage(1);
            }}
            className={`rounded-full px-3 py-1.5 !font-['Montserrat'] text-[11px] font-black ${
              !selectedProvider
                ? "bg-[#E9ECF8] text-[#1941CF]"
                : "bg-white text-neutral-500"
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
              className={`rounded-full px-3 py-1.5 !font-['Montserrat'] text-[11px] font-black ${
                selectedProvider === provider.value
                  ? "bg-[#E9ECF8] text-[#1941CF]"
                  : "bg-white text-neutral-500"
              }`}
            >
              {provider.label}
            </button>
          ))}
        </div>
      )}

      {errorMsg && (
        <div className="mt-5 rounded-[18px] border border-red-100 bg-red-50 px-5 py-4 !font-['Montserrat'] text-sm font-semibold text-red-600">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="h-[230px] animate-pulse rounded-[20px] bg-white"
            />
          ))}
        </div>
      ) : courses.length ? (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => {
              const canOpen =
                course.available && course.url && course.url !== "#";

              return (
                <article
                  key={course.id || course.idInterno || course.title}
                  className="flex min-h-[230px] flex-col overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_10px_28px_rgba(0,0,0,0.035)] transition hover:-translate-y-0.5"
                >
                  {course.image && (
                    <div className="h-[130px] overflow-hidden bg-[#EEF1F5]">
                      <img
                        src={course.image}
                        alt={course.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.parentElement.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-[#EEF2FF] px-3 py-1 !font-['Montserrat'] text-[10px] font-black text-[#1941CF]">
                        {course.provider}
                      </span>
                      <span className="!font-['Montserrat'] text-[10px] text-[#806B5F]">
                        {course.duration}
                      </span>
                    </div>

                    <h2 className="mt-3 line-clamp-2 !font-['Montserrat'] text-base font-black leading-tight text-[#111111]">
                      {course.title}
                    </h2>

                    {course.institution && (
                      <p className="mt-1 line-clamp-1 !font-['Montserrat'] text-xs text-[#806B5F]">
                        {course.institution}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {course.topic && (
                        <span className="rounded-full bg-[#F6F4EF] px-3 py-1 !font-['Montserrat'] text-[10px] text-[#806B5F]">
                          {course.topic}
                        </span>
                      )}
                      {course.language && (
                        <span className="rounded-full bg-neutral-100 px-3 py-1 !font-['Montserrat'] text-[10px] uppercase text-neutral-500">
                          {course.language}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto pt-4">
                      {canOpen ? (
                        <a
                          href={course.url}
                          target={course.url.startsWith("http") ? "_blank" : undefined}
                          rel={course.url.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-1 !font-['Montserrat'] text-xs font-black text-[#1941CF]"
                        >
                          Ver curso <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span className="!font-['Montserrat'] text-xs font-bold text-neutral-400">
                          Curso no disponible
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-full border border-black/10 bg-white px-5 py-2.5 !font-['Montserrat'] text-xs font-black text-[#111111] disabled:opacity-40"
              >
                ← Anterior
              </button>

              <span className="!font-['Montserrat'] text-xs font-bold text-[#806B5F]">
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
                className="rounded-full bg-[#1941CF] px-5 py-2.5 !font-['Montserrat'] text-xs font-black text-white disabled:opacity-40"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 rounded-[22px] border border-black/10 bg-white p-10 text-center">
          <h2 className="!font-['Montserrat'] text-xl font-black text-[#111111]">
            No encontramos cursos
          </h2>
          <p className="mt-2 !font-['Montserrat'] text-sm text-[#806B5F]">
            Prueba con otra búsqueda, proveedor o dominio.
          </p>
        </div>
      )}
    </div>
  );
}