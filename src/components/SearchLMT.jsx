// src/components/SearchLMT.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, Loader2, ArrowRight, X } from "lucide-react";
import QuickCertificationSearch from "../services/quickCertificationSearch";

export default function SearchLMT() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);

  const normalizePlatformSlug = (value) => {
    const name = String(value || "").trim().toLowerCase();
    if (name === "edx.org") return "edx";
    return name || "";
  };

  const getCertificationUrl = (item) => {
    if (item?.url) return item.url;

    const platformSlug = normalizePlatformSlug(
      item?.plataforma_certificacion?.nombre
    );

    if (platformSlug && item?.slug) return `/certificacion/${platformSlug}/${item.slug}`;
    if (item?.slug) return `/certificacion/${item.slug}`;
    return "/explora";
  };

  const getImageUrl = (item) => {
    return (
      item?.image ||
      item?.universidad_certificacion?.univ_ico ||
      item?.universidad_certificacion?.univ_img ||
      item?.empresa_certificacion?.empr_ico ||
      item?.empresa_certificacion?.empr_img ||
      item?.plataforma_certificacion?.plat_ico ||
      item?.plataforma_certificacion?.plat_img ||
      item?.imagen_final ||
      ""
    );
  };

  const getProviderName = (item) => {
    return (
      item?.universidad_certificacion?.nombre ||
      item?.empresa_certificacion?.nombre ||
      item?.plataforma_certificacion?.nombre ||
      ""
    );
  };

  const getPlatformName = (item) => {
    return item?.plataforma_certificacion?.nombre || "";
  };

  const getCourseType = (item) => {
    return item?.tipo_certificacion || item?.tipo || item?.type_label || "Certificación";
  };

  const handleClear = () => {
    setQuery("");
    setIsActive(false);
    setIsSearching(false);
    setResults([]);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;

    setQuery(value);
    setIsActive(value.trim().length > 0);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length >= 3) {
      debounceRef.current = setTimeout(async () => {
        setIsSearching(true);

        try {
          const data = await QuickCertificationSearch.getResults(value.trim(), {
            limit: 8,
          });

          setResults(Array.isArray(data?.results) ? data.results : []);
        } catch (error) {
          console.error("Error obteniendo resultados:", error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 350);
    } else {
      setIsSearching(false);
      setResults([]);
    }
  };

  return (
    <div className="relative mt-2 text-center lg:text-left cont-search-top">
      <div className="relative mt-4 mb-4 w-full max-w-[80%] lg:max-w-[100%]">
        <Search
          size={18}
          strokeWidth={2}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
        />

        <input
          type="text"
          placeholder="Buscar entre miles de certificaciones..."
          className="
            h-[52px] w-full rounded-full border border-white/15
            bg-white px-12 pr-12 !font-['Montserrat'] text-[14px] text-[#0F090B]
            outline-none shadow-[0_16px_45px_rgba(0,0,0,0.12)]
            placeholder:text-neutral-400
            focus:border-[#5CC781]/60 focus:ring-4 focus:ring-[#5CC781]/15
          "
          id="search-lmt"
          value={query}
          onChange={handleChange}
          autoComplete="off"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center
              rounded-full bg-neutral-100 text-neutral-500 transition-colors
              hover:bg-neutral-200 hover:text-neutral-800
            "
            aria-label="Limpiar búsqueda"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <p className="mb-2 text-center text-sm text-[#F6F4EF] lg:text-left">
        Busca por tema, habilidad, universidad o empresa
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs lg:justify-start">
        {[
          "Google",
          "AWS",
          "Desarrollo Personal",
          "Programación",
          "Negocios",
          "Marketing",
          "Inteligencia Artificial",
        ].map((tag, idx) => (
          <button
            type="button"
            key={idx}
            className="
              rounded-full bg-[#F6F4EF] px-3 py-1 !font-['Montserrat'] text-[#0F090B]
              transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md
            "
            onClick={() => handleChange({ target: { value: tag } })}
          >
            {tag}
          </button>
        ))}
      </div>

      {isActive && isSearching && (
        <div
          className="
            absolute left-2 top-[58px] z-50 mt-2 w-[97%]
            overflow-hidden rounded-[22px] border border-black/10 bg-white/95
            p-3 text-left shadow-[0_24px_80px_rgba(0,0,0,0.18)]
            backdrop-blur-xl
          "
          data-lenis-prevent
        >
          <div className="mb-2 flex items-center gap-2 px-2 text-sm font-semibold text-[#0F090B]">
            <Loader2 size={16} className="animate-spin text-[#1941cf]" />
            Buscando certificaciones...
          </div>

          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl p-2">
                <div className="h-12 w-12 animate-pulse rounded-2xl bg-neutral-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-[75%] animate-pulse rounded-full bg-neutral-100" />
                  <div className="h-3 w-[45%] animate-pulse rounded-full bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isActive && !isSearching && Array.isArray(results) && results.length > 0 && (
        <div
          className="
            absolute left-2 top-[45px] z-50 mt-2 max-h-[300px] w-[97%]
            overflow-y-auto rounded-[24px] border border-black/10 bg-white/95
            p-2 text-left shadow-[0_24px_80px_rgba(0,0,0,0.18)]
            backdrop-blur-xl
          "
          data-lenis-prevent
        >
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7B6E63]">
            Resultados sugeridos
          </div>

          {results.map((item, idx) => {
            const imageUrl = getImageUrl(item);
            const providerName = getProviderName(item);
            const platformName = getPlatformName(item);
            const courseType = getCourseType(item);

            return (
              <Link
                to={getCertificationUrl(item)}
                key={item?.id || idx}
                className="
                  group flex items-center gap-3 rounded-[20px] border border-transparent
                  p-2 text-black transition-all duration-300
                  hover:border-[#1941cf]/10 hover:bg-[#F5F3EE] hover:shadow-sm
                "
                onClick={handleClear}
              >
                <div className="grid h-[48px] w-[48px] shrink-0 place-items-center overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      className="max-h-[80%] max-w-[80%] object-contain"
                      alt={item?.nombre || item?.titulo || "Certificación"}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1941cf] !font-['Montserrat'] text-sm font-bold text-white">
                      {(item?.nombre || item?.titulo || "T").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 !font-['Montserrat'] text-[13px] font-bold leading-[1.2em] text-[#0F090B]">
                    {item?.nombre || item?.titulo || "Sin nombre"}
                  </h4>
                  <div className="flex items-center mt-1 gap-2">
                    
                    {providerName && (
                      <p className="line-clamp-1 !font-['Montserrat'] text-[11px] leading-[1.2em] text-neutral-500">
                        {providerName}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {platformName && (
                        <span className="rounded-full bg-[#1941cf]/10 px-2 py-0.5 !font-['Montserrat'] text-[10px] font-bold text-[#1941cf]">
                          {platformName}
                        </span>
                      )}

                      {courseType && (
                        <span className="rounded-full bg-[#5CC781]/15 px-2 py-0.5 !font-['Montserrat'] text-[10px] font-bold text-[#1F7A4C]">
                          {courseType}
                        </span>
                      )}
                    </div>
                  </div>
                  
                </div>

                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 text-neutral-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#1941cf]"
                />
              </Link>
            );
          })}
        </div>
      )}

      {isActive && !isSearching && query.trim().length >= 3 && results.length === 0 && (
        <div
          className="
            absolute left-2 top-[58px] z-50 mt-2 w-[97%]
            rounded-[22px] border border-black/10 bg-white/95
            p-3 text-left shadow-[0_24px_80px_rgba(0,0,0,0.18)]
            backdrop-blur-xl
          "
          data-lenis-prevent
        >
          <p className="!font-['Montserrat'] text-sm font-semibold text-[#0F090B]">
            No encontramos resultados.
          </p>
          <p className="mt-1 !font-['Montserrat'] text-xs text-neutral-500">
            Prueba con una habilidad, universidad, empresa o plataforma.
          </p>
        </div>
      )}
    </div>
  );
}