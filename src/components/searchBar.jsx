import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

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

    if (category === "temas" || category === "habilidades") {
      if (typeof tag === "object") return tag.slug || "";
      return String(tag).trim();
    }

    if (category === "idioma") {
      return typeof tag === "string" ? tag.trim() : "";
    }

    if (typeof tag === "object") {
      return tag.slug || tag.nombre || "";
    }

    return String(tag).trim();
  };

  const getTagLabel = (tag) => {
    if (!tag) return "";
    if (typeof tag === "string" || typeof tag === "number") return String(tag);
    return tag.translate || tag.nombre || tag.slug || "";
  };

  const activeFilters = useMemo(() => {
    return {
      idioma: (selectedTags?.idioma || []).map((tag) => getTagUrlValue("idioma", tag)),
      Plataforma: (selectedTags?.plataforma || []).map((tag) => getTagUrlValue("plataforma", tag)),
      Empresa: (selectedTags?.empresas || []).map((tag) => getTagUrlValue("empresas", tag)),
      Universidad: (selectedTags?.universidades || []).map((tag) => getTagUrlValue("universidades", tag)),
      Tema: (selectedTags?.temas || []).map((tag) => getTagUrlValue("temas", tag)),
      Habilidad: (selectedTags?.habilidades || []).map((tag) => getTagUrlValue("habilidades", tag)),
    };
  }, [selectedTags]);

  const activeFiltersKey = useMemo(() => {
    return JSON.stringify(activeFilters);
  }, [activeFilters]);

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

        const normalizedData = Array.isArray(data?.results) ? data.results : [];
        setResults(normalizedData);
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
      debouncedText.trim().length >= 3 && (loading || results.length > 0 || hasSearched);

    setResultsVisible(shouldShow);
  }, [debouncedText, loading, results, hasSearched]);

  useEffect(() => {
    if (resultsVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [resultsVisible]);

  return (
    <>
      <div
        className={`wrapper-search-bar transition-all duration-300 ${
          isFixed
            ? "!fixed top-[100px] left-1/2 -translate-x-1/2 !w-[min(900px,90vw)] z-[70]"
            : "relative"
        }`}
      >
        <span className="absolute top-[-15px] text-[0.7rem] w-full text-black">
          Busca por tema, habilidad, universidad o empresa
        </span>

        <input
          type="text"
          placeholder="¿Qué quieres aprender?"
          name="text"
          className="input"
          onChange={handleWriting}
          value={text}
        />

        {text && (
          <button onClick={handleClear} className="clear-button" type="button">
            <X />
          </button>
        )}

        <div className="serch-btn cursor-pointer">
          <svg
            fill="white"
            width="20px"
            height="20px"
            viewBox="0 0 1920 1920"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
              fillRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {resultsVisible && (
        <div
          className="fixed inset-0 z-[60] bg-[#F6F4EF]/99 backdrop-blur-[2px] pt-[150px] px-4 pb-6 overflow-y-auto"
          data-lenis-prevent
        >
          <div className="w-full max-w-[1200px] mx-auto rounded-2xl p-3">
            {activeFiltersSummary.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {activeFiltersSummary.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="text-[11px] bg-white border border-[#E6DFD1] text-[#4B4B4B] rounded-full px-3 py-1"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full overflow-hidden rounded-[15px] bg-[#F6F4EF] border border-[#ECE7DE] animate-pulse"
                  >
                    <div className="relative h-[200px] w-full rounded-xl bg-[linear-gradient(135deg,#d6d0c8_0%,#f0ece6_45%,#cfc7bc_100%)]">
                      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.7),transparent_35%),radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.5),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.35),transparent_25%)]"></div>
                      <div className="absolute top-1 right-0 h-5 w-24 rounded-[25px_0px_0px_25px] bg-white shadow-sm"></div>
                    </div>

                    <div className="relative px-4 pb-4 pt-4">
                      <div className="absolute -top-2 left-1/2 h-5 w-[150px] -translate-x-1/2 rounded-full bg-[#C4C4C4]"></div>

                      <div className="mt-4 flex flex-col items-center gap-1">
                        <div className="h-4 w-[85%] rounded bg-neutral-300"></div>
                        <div className="h-4 w-[78%] rounded bg-neutral-300"></div>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="h-6 w-20 rounded bg-neutral-300"></div>
                        <div className="h-6 w-28 rounded-full bg-neutral-300"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 text-center text-sm text-red-500">{error}</div>
            ) : results.length === 0 && hasSearched ? (
              <div className="p-6 text-center text-sm text-neutral-500">
                No encontramos resultados para <strong>{debouncedText}</strong>.
              </div>
            ) : (
              <div className="search-results-list">
                <CertificationsList certifications={results} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar; 