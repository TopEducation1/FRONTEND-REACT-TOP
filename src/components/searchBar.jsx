import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDebounce } from "use-debounce";
import { useLocation } from "react-router-dom";
import { X, Search } from "lucide-react";

import FilterBySearch from "../services/filterBySearch";
import CertificationsList from "../components/layoutCertifications";


const MIN_SEARCH_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 350;


const SearchBar = ({
  selectedTags = {},
}) => {
  const [error, setError] =
    useState(null);

  const [results, setResults] =
    useState([]);

  const [text, setText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    resultsVisible,
    setResultsVisible,
  ] = useState(false);

  const [
    hasSearched,
    setHasSearched,
  ] = useState(false);

  const [debouncedText] =
    useDebounce(
      text,
      SEARCH_DEBOUNCE_MS
    );

  const location =
    useLocation();

  const requestIdRef =
    useRef(0);


  // ============================================================
  // HELPERS
  // ============================================================

  const getTagId = (
    tag
  ) => {
    if (
      tag === null ||
      tag === undefined
    ) {
      return null;
    }

    if (
      typeof tag === "object"
    ) {
      const value =
        tag.id ??
        tag.value_id ??
        null;

      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return null;
      }

      const parsed =
        Number(value);

      return Number.isFinite(
        parsed
      )
        ? parsed
        : null;
    }

    const parsed =
      Number(tag);

    return Number.isFinite(
      parsed
    )
      ? parsed
      : null;
  };


  const getTagText = (
    tag
  ) => {
    if (
      tag === null ||
      tag === undefined
    ) {
      return "";
    }

    if (
      typeof tag === "string"
    ) {
      return tag.trim();
    }

    if (
      typeof tag === "number"
    ) {
      return "";
    }

    return String(
      tag.slug ??
      tag.value ??
      tag.code ??
      tag.nombre ??
      tag.name ??
      ""
    ).trim();
  };


  const getTagLabel = (
    tag
  ) => {
    if (!tag) {
      return "";
    }

    if (
      typeof tag ===
        "string" ||
      typeof tag ===
        "number"
    ) {
      return String(tag);
    }

    return (
      tag.translate ||
      tag.nombre ||
      tag.name ||
      tag.slug ||
      tag.code ||
      tag.id ||
      ""
    );
  };


  const uniqueValues = (
    values
  ) => {
    return [
      ...new Set(
        (values || []).filter(
          (value) =>
            value !== null &&
            value !== undefined &&
            value !== ""
        )
      ),
    ];
  };


  const extractIds = (
    tags
  ) => {
    return uniqueValues(
      (tags || [])
        .map(getTagId)
        .filter(
          (value) =>
            value !== null
        )
    );
  };


  const extractTextsWithoutId =
    (tags) => {
      return uniqueValues(
        (tags || [])
          .filter(
            (tag) =>
              getTagId(tag) ===
              null
          )
          .map(getTagText)
          .filter(Boolean)
      );
    };


  // ============================================================
  // FILTROS
  // ============================================================

  const activeFilters =
    useMemo(() => {
      const idiomas =
        uniqueValues(
          (
            selectedTags?.idioma ||
            []
          )
            .map(
              (tag) => {
                if (
                  typeof tag ===
                  "string"
                ) {
                  return tag
                    .trim()
                    .toLowerCase();
                }

                return String(
                  tag?.code ??
                  tag?.value ??
                  tag?.slug ??
                  tag?.nombre ??
                  ""
                )
                  .trim()
                  .toLowerCase();
              }
            )
            .filter(Boolean)
        );

      const plataformas =
        selectedTags?.plataforma ||
        [];

      const empresas =
        selectedTags?.empresas ||
        [];

      const universidades =
        selectedTags?.universidades ||
        [];

      const temas =
        selectedTags?.temas ||
        [];

      const habilidades =
        selectedTags?.habilidades ||
        [];


      return {
        idioma:
          idiomas,

        plataforma_id:
          extractIds(
            plataformas
          ),

        plataforma:
          extractTextsWithoutId(
            plataformas
          ),

        empresa_id:
          extractIds(
            empresas
          ),

        empresas:
          extractTextsWithoutId(
            empresas
          ),

        universidad_id:
          extractIds(
            universidades
          ),

        universidades:
          extractTextsWithoutId(
            universidades
          ),

        /*
         * Tema y habilidad ahora
         * apuntan ambos a Skills.
         */
        tema_id:
          extractIds(
            temas
          ),

        temas:
          extractTextsWithoutId(
            temas
          ),

        habilidad_id:
          extractIds(
            habilidades
          ),

        habilidades:
          extractTextsWithoutId(
            habilidades
          ),
      };
    }, [selectedTags]);


  const activeFiltersKey =
    useMemo(
      () =>
        JSON.stringify(
          activeFilters
        ),
      [activeFilters]
    );


  // ============================================================
  // BADGES
  // ============================================================

  const activeFiltersSummary =
    useMemo(() => {
      const items = [];

      (
        selectedTags?.plataforma ||
        []
      ).forEach(
        (tag) => {
          items.push(
            `Plataforma: ${getTagLabel(
              tag
            )}`
          );
        }
      );

      (
        selectedTags?.empresas ||
        []
      ).forEach(
        (tag) => {
          items.push(
            `Empresa: ${getTagLabel(
              tag
            )}`
          );
        }
      );

      (
        selectedTags?.universidades ||
        []
      ).forEach(
        (tag) => {
          items.push(
            `Universidad: ${getTagLabel(
              tag
            )}`
          );
        }
      );

      (
        selectedTags?.temas ||
        []
      ).forEach(
        (tag) => {
          items.push(
            `Tema: ${getTagLabel(
              tag
            )}`
          );
        }
      );

      (
        selectedTags?.habilidades ||
        []
      ).forEach(
        (tag) => {
          items.push(
            `Habilidad: ${getTagLabel(
              tag
            )}`
          );
        }
      );

      (
        selectedTags?.idioma ||
        []
      ).forEach(
        (tag) => {
          items.push(
            `Idioma: ${getTagLabel(
              tag
            )}`
          );
        }
      );

      return items;
    }, [selectedTags]);


  // ============================================================
  // ESTADO DERIVADO
  // ============================================================

  const cleanText =
    text.trim();

  const hasMinimumCharacters =
    cleanText.length >=
    MIN_SEARCH_LENGTH;

  /*
   * La barra SOLO pasa a fixed desde
   * dos caracteres.
   */
  const isFixed =
    hasMinimumCharacters;


  // ============================================================
  // INPUT
  // ============================================================

  const handleWriting = (
    event
  ) => {
    const value =
      event.target.value;

    setText(
      value
    );

    setError(
      null
    );

    /*
     * Si baja de 2 caracteres:
     *
     * - cerramos resultados inmediatamente;
     * - cancelamos respuestas pendientes;
     * - limpiamos estado.
     */
    if (
      value.trim().length <
      MIN_SEARCH_LENGTH
    ) {
      requestIdRef.current += 1;

      setResults(
        []
      );

      setLoading(
        false
      );

      setHasSearched(
        false
      );

      setResultsVisible(
        false
      );
    }
  };


  // ============================================================
  // CLEAR
  // ============================================================

  const handleClear = () => {
    requestIdRef.current += 1;

    setText(
      ""
    );

    setResults(
      []
    );

    setError(
      null
    );

    setLoading(
      false
    );

    setHasSearched(
      false
    );

    setResultsVisible(
      false
    );

    FilterBySearch.clearCache();
  };


  // ============================================================
  // SEARCH DESDE URL
  // ============================================================

  useEffect(() => {
    const params =
      new URLSearchParams(
        location.search
      );

    const searchQuery =
      params.get(
        "search"
      );

    if (
      searchQuery
    ) {
      const decoded =
        decodeURIComponent(
          searchQuery
        );

      setText(
        decoded
      );
    }
  }, [location.search]);


  // ============================================================
  // FILTROS CAMBIAN
  // ============================================================

  useEffect(() => {
    FilterBySearch.clearCache();
  }, [activeFiltersKey]);


  // ============================================================
  // SEARCH
  // ============================================================

  useEffect(() => {
    const searchValue =
      debouncedText.trim();

    if (
      searchValue.length <
      MIN_SEARCH_LENGTH
    ) {
      requestIdRef.current += 1;

      setLoading(
        false
      );

      setResults(
        []
      );

      setHasSearched(
        false
      );

      setResultsVisible(
        false
      );

      return;
    }


    const fetchResults =
      async () => {
        const currentRequestId =
          ++requestIdRef.current;

        /*
         * Abrimos el contenedor cuando
         * realmente empieza la búsqueda.
         */
        setResultsVisible(
          true
        );

        setLoading(
          true
        );

        setError(
          null
        );

        setHasSearched(
          false
        );


        try {
          const data =
            await FilterBySearch.getResults(
              searchValue,
              {
                limit: 12,
                filters:
                  activeFilters,
              }
            );


          if (
            currentRequestId !==
            requestIdRef.current
          ) {
            return;
          }


          setResults(
            Array.isArray(
              data?.results
            )
              ? data.results
              : []
          );

          setHasSearched(
            true
          );
        } catch (err) {
          if (
            currentRequestId !==
            requestIdRef.current
          ) {
            return;
          }

          console.error(
            "Error al buscar certificaciones:",
            err
          );

          setResults(
            []
          );

          setHasSearched(
            true
          );

          setError(
            "Ocurrió un error al realizar la búsqueda."
          );
        } finally {
          if (
            currentRequestId ===
            requestIdRef.current
          ) {
            setLoading(
              false
            );
          }
        }
      };


    fetchResults();

  }, [
    debouncedText,
    activeFiltersKey,
  ]);


  // ============================================================
  // SI SE BORRA A < 2 LETRAS
  // ============================================================

  useEffect(() => {
    if (
      text.trim().length <
      MIN_SEARCH_LENGTH
    ) {
      setResultsVisible(
        false
      );
    }
  }, [text]);


  // ============================================================
  // BODY
  // ============================================================

  useEffect(() => {
    if (
      resultsVisible
    ) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [resultsVisible]);


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* ==================================================== */}
      {/* SEARCH */}
      {/* ==================================================== */}

      <div
        className={`
          w-full
          transition-all
          duration-300

          ${
            isFixed
              ? `
                fixed
                left-1/2
                top-[96px]
                z-[80]
                w-[min(960px,92vw)]
                max-w-[80%]
                -translate-x-1/2
              `
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
          <Search
            className="
              h-5
              w-5
              shrink-0
              text-neutral-400
              transition
              group-focus-within:text-[#1941cf]
            "
          />

          <input
            type="text"

            placeholder="Busca certificaciones, habilidades, universidades, empresas o plataformas"

            name="text"

            autoComplete="off"

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

            onChange={
              handleWriting
            }

            value={
              text
            }
          />

          {text && (
            <button
              onClick={
                handleClear
              }

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

              aria-label="Limpiar búsqueda"
            >
              <X
                className="
                  h-4
                  w-4
                "
              />
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


      {/* ==================================================== */}
      {/* OVERLAY */}
      {/* ==================================================== */}

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
          <div
            className="
              mx-auto
              w-full
              max-w-[1200px]
            "
          >
            {/* HEADER */}

            <div
              className="
                mb-6
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-neutral-900
                  "
                >
                  Resultados de búsqueda
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    text-neutral-500
                  "
                >
                  Mostrando coincidencias para{" "}

                  <span
                    className="
                      font-semibold
                      text-neutral-900
                    "
                  >
                    “{debouncedText.trim()}”
                  </span>
                </p>
              </div>

              <button
                type="button"

                onClick={
                  handleClear
                }

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

                aria-label="Cerrar búsqueda"
              >
                <X
                  className="
                    h-5
                    w-5
                  "
                />
              </button>
            </div>


            {/* ================================================= */}
            {/* FILTROS */}
            {/* ================================================= */}

            {activeFiltersSummary.length >
              0 && (
              <div
                className="
                  mb-5
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {activeFiltersSummary.map(
                  (
                    item,
                    index
                  ) => (
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
                  )
                )}
              </div>
            )}


            {/* ================================================= */}
            {/* LOADING */}
            {/* ================================================= */}

            {loading ? (
              <div
                className="
                  grid
                  grid-cols-1
                  gap-5
                  sm:grid-cols-2
                  xl:grid-cols-4
                "
              >
                {Array.from({
                  length: 8,
                }).map(
                  (_, i) => (
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
                      <div
                        className="
                          h-[180px]
                          rounded-t-[18px]
                          bg-neutral-200
                        "
                      />

                      <div
                        className="
                          space-y-3
                          p-4
                        "
                      >
                        <div
                          className="
                            h-4
                            w-[90%]
                            rounded
                            bg-neutral-200
                          "
                        />

                        <div
                          className="
                            h-4
                            w-[70%]
                            rounded
                            bg-neutral-200
                          "
                        />

                        <div
                          className="
                            h-6
                            w-[45%]
                            rounded-full
                            bg-neutral-200
                          "
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : error ? (

              <div
                className="
                  rounded-[24px]
                  bg-white
                  p-8
                  text-center
                  text-sm
                  text-red-500
                  shadow-[0_16px_50px_rgba(0,0,0,0.04)]
                "
              >
                {error}
              </div>

            ) : (
              hasSearched &&
              results.length === 0
            ) ? (

              <div
                className="
                  rounded-[24px]
                  bg-white
                  p-10
                  text-center
                  shadow-[0_16px_50px_rgba(0,0,0,0.04)]
                "
              >
                <h3
                  className="
                    text-lg
                    font-semibold
                    text-black
                  "
                >
                  No encontramos resultados
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    text-neutral-500
                  "
                >
                  No hay coincidencias para{" "}

                  <strong
                    className="
                      text-neutral-800
                    "
                  >
                    {debouncedText.trim()}
                  </strong>
                  .
                </p>
              </div>

            ) : (

              <CertificationsList
                certifications={
                  results
                }
              />

            )}
          </div>
        </div>
      )}
    </>
  );
};


export default SearchBar;