import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useLocation } from "react-router-dom";
import { X, Search } from "lucide-react";

import FilterBySearch from "../services/filterBySearch";
import CertificationsList from "../components/layoutCertifications";

const SearchBar = ({ selectedTags = {} }) => {
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [debouncedText] = useDebounce(text, 350);
  const location = useLocation();
  const requestIdRef = useRef(0);

  const getTagUrlValue = (category, tag) => {
    if (!tag) return "";

    if (category === "idioma") {
      return typeof tag === "string" ? tag.trim() : "";
    }

    if (typeof tag === "object") {
      return tag.id || tag.slug || tag.nombre || "";
    }

    return String(tag).trim();
  };

  const getTagLabel = (tag) => {
    if (!tag) return "";
    if (typeof tag === "string" || typeof tag === "number") return String(tag);

    return (
      tag.translate ||
      tag.nombre ||
      tag.name ||
      tag.slug ||
      tag.id ||
      ""
    );
  };

  const activeFilters = useMemo(() => {
    return {
      idioma: (selectedTags?.idioma || []).map((tag) =>
        getTagUrlValue("idioma", tag)
      ),
      Plataforma: (selectedTags?.plataforma || []).map((tag) =>
        getTagUrlValue("plataforma", tag)
      ),
      Empresa: (selectedTags?.empresas || []).map((tag) =>
        getTagUrlValue("empresas", tag)
      ),
      Universidad: (selectedTags?.universidades || []).map((tag) =>
        getTagUrlValue("universidades", tag)
      ),
      Tema: (selectedTags?.temas || []).map((tag) =>
        getTagUrlValue("temas", tag)
      ),
      Habilidad: (selectedTags?.habilidades || []).map((tag) =>
        getTagUrlValue("habilidades", tag)
      ),
    };
  }, [selectedTags]);

  const activeFiltersKey = useMemo(
    () => JSON.stringify(activeFilters),
    [activeFilters]
  );

  const activeFiltersSummary = useMemo(() => {
    const items = [];

    (selectedTags?.plataforma || []).forEach((tag) => {
      items.push(`Plataforma: ${getTagLabel(tag)}`);
    });

    (selectedTags?.empresas || []).forEach((tag) => {
      items.push(`Empresa: ${getTagLabel(tag)}`);
    });

    (selectedTags?.universidades || []).forEach((tag) => {
      items.push(`Universidad: ${getTagLabel(tag)}`);
    });

    (selectedTags?.temas || []).forEach((tag) => {
      items.push(`Tema: ${getTagLabel(tag)}`);
    });

    (selectedTags?.habilidades || []).forEach((tag) => {
      items.push(`Habilidad: ${getTagLabel(tag)}`);
    });

    (selectedTags?.idioma || []).forEach((tag) => {
      items.push(`Idioma: ${getTagLabel(tag)}`);
    });

    return items;
  }, [selectedTags]);

  const handleWriting = (event) => {
    const newText = event.target.value;
    setText(newText);
    setIsFixed(newText.trim() !== "");
    setError(null);
  };

  const handleClear = () => {
    setText("");
    setResults([]);
    setError(null);
    setHasSearched(false);
    setResultsVisible(false);
    setIsFixed(false);
    FilterBySearch.clearCache();
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");

    if (searchQuery) {
      const decoded = decodeURIComponent(searchQuery);
      setText(decoded);
      setIsFixed(decoded.trim() !== "");
    }
  }, [location.search]);

  useEffect(() => {
    FilterBySearch.clearCache();
  }, [activeFiltersKey]);

  useEffect(() => {
    const searchValue = debouncedText.trim();

    if (searchValue.length < 3) {
      setLoading(false);
      setResults([]);
      setHasSearched(false);
      return;
    }

    const fetchResults = async () => {
      const currentRequestId = ++requestIdRef.current;

      try {
        setLoading(true);
        setError(null);
        setHasSearched(true);

        const data = await FilterBySearch.getResults(searchValue, {
          limit: 12,
          filters: activeFilters,
        });

        if (currentRequestId !== requestIdRef.current) return;

        setResults(Array.isArray(data?.results) ? data.results : []);
      } catch (err) {
        if (currentRequestId !== requestIdRef.current) return;

        console.error("Error al buscar certificaciones:", err);
        setResults([]);
        setError("Ocurrió un error al realizar la búsqueda.");
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [debouncedText, activeFiltersKey]);

  useEffect(() => {
    const shouldShow =
      debouncedText.trim().length >= 3 &&
      (loading || results.length > 0 || hasSearched);

    setResultsVisible(shouldShow);
  }, [debouncedText, loading, results, hasSearched]);

  useEffect(() => {
    document.body.style.overflow = resultsVisible ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [resultsVisible]);

  return (
    <>
      <div
        className={`
          w-full
          transition-all
          duration-300
          ${
            isFixed
              ? "fixed left-1/2 top-[96px] z-[80] w-[min(960px,92vw)] max-w-[80%] -translate-x-1/2"
              : "relative"
          }
        `}
      >
        <div
          className="
            group
            flex
            h-[50px]
            w-full
            items-center
            gap-3
            rounded-[25px]
            border
            border-black/10
            bg-white
            px-4
            shadow-[0_12px_40px_rgba(0,0,0,0.04)]
            transition-all
            duration-300
            focus-within:border-[#1941cf]/40
            focus-within:shadow-[0_18px_50px_rgba(87,80,255,0.10)]
          "
        >
          <Search className="h-5 w-5 shrink-0 text-neutral-400 transition group-focus-within:text-[#1941cf]" />

          <input
            type="text"
            placeholder="Busca por tema, habilidad, universidad o empresa"
            name="text"
            className="
              h-full
              w-full
              bg-transparent
              text-[15px]
              text-neutral-800
              border-0
              focus:ring-0
              active:ring-0
              outline-none
              placeholder:text-neutral-400
            "
            onChange={handleWriting}
            value={text}
          />

          {text && (
            <button
              onClick={handleClear}
              type="button"
              className="
                grid
                h-8
                w-8
                shrink-0
                place-items-center
                rounded-full
                bg-neutral-100
                text-neutral-500
                transition
                hover:bg-neutral-900
                hover:text-white
              "
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            className="
              hidden
              h-10
              -mr-3
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#111111]
              px-5
              text-sm
              font-bold
              text-white
              transition
              hover:bg-black
              sm:flex
            "
          >
            Buscar
          </button>
        </div>
      </div>

      {resultsVisible && (
        <div
          className="
            fixed
            inset-0
            z-[70]
            overflow-y-auto
            bg-[#F8F7F4]/95
            px-4
            pb-10
            pt-[180px]
            backdrop-blur-md
          "
          data-lenis-prevent
        >
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  Resultados de búsqueda
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Mostrando coincidencias para{" "}
                  <span className="font-semibold text-neutral-900">
                    “{debouncedText}”
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={handleClear}
                className="
                  grid
                  h-10
                  w-10
                  shrink-0
                  place-items-center
                  rounded-full
                  bg-white
                  text-neutral-600
                  shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                  transition
                  hover:bg-neutral-900
                  hover:text-white
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {activeFiltersSummary.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {activeFiltersSummary.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="
                      rounded-full
                      border
                      border-black/10
                      bg-white
                      px-3
                      py-1.5
                      text-[12px]
                      font-medium
                      text-neutral-600
                      shadow-sm
                    "
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="
                      w-full
                      animate-pulse
                      rounded-[18px]
                      border
                      border-black/10
                      bg-white
                    "
                  >
                    <div className="h-[180px] rounded-t-[18px] bg-neutral-200" />

                    <div className="space-y-3 p-4">
                      <div className="h-4 w-[90%] rounded bg-neutral-200" />
                      <div className="h-4 w-[70%] rounded bg-neutral-200" />
                      <div className="h-6 w-[45%] rounded-full bg-neutral-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-[24px] bg-white p-8 text-center text-sm text-red-500 shadow-[0_16px_50px_rgba(0,0,0,0.04)]">
                {error}
              </div>
            ) : results.length === 0 && hasSearched ? (
              <div className="rounded-[24px] bg-white p-10 text-center shadow-[0_16px_50px_rgba(0,0,0,0.04)]">
                <h3 className="text-lg font-semibold text-black">
                  No encontramos resultados
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  No hay coincidencias para{" "}
                  <strong className="text-neutral-800">{debouncedText}</strong>.
                </p>
              </div>
            ) : (
              <CertificationsList certifications={results} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;