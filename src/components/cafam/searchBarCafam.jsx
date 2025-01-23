import { useState, useEffect } from "react";
import FilterBySearch from "../../services/filterBySearch";
import { useDebounce } from "use-debounce";

const SearchBar = () => {
  // Estados para el componente de la barra de busqueda
  const [position, setPosition] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [tempResults, setTempResults] = useState([]); // Temporarily store results while loading new ones
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  // Use debounce to reduce the number of API calls
  const [debouncedText] = useDebounce(text, 300);

  // Manejar la escritura en el input
  const handleWriting = (event) => {
    const newText = event.target.value;
    setText(newText);
  };

  // Effect to fecth search results when debounced text changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedText.trim() || debouncedText.trim().length < 3) {
        // Clear results if the input text is empty or less than 3 characters
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setTempResults([]); // Clear temporary results
        const data = await FilterBySearch.getResults(debouncedText);
        setTempResults(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error al enviar datos: ", error);
        setError(error);
        setTempResults([]);
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedText]);

  // Update main results state after loading is complete
  useEffect(() => {
    if (!loading) {
      setResults(tempResults);
    }
  }, [loading, tempResults]);

  return (
    <>
      <div
        className={`wrapper-search-bar-cafam ${
          isMobileView ? "mobile-style" : "desktop-style"
        }`}
      >
        <input
          type="text"
          placeholder="¿Qué quieres aprender?"
          name="text"
          className="input-cafam"
          onChange={handleWriting}
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-search"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
          <path d="M21 21l-6 -6" />
        </svg>
        {loading && <span className="loader-search"></span>}
      </div>

      {debouncedText.trim() && results.length > 0 && (
        <div className="container-results-cafam">
          {results.map((resultado) => (
            <div key={resultado.id} className="box-result">
              <div className="wrapper-img-box">
                <img src={resultado.url_imagen_universidad_certificacion}></img>
              </div>
              <div className="wrapper-name-box">{resultado.nombre}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SearchBar;
