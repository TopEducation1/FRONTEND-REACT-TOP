import { useState, useEffect } from "react";
import FilterBySearch from "../../services/filterBySearch";
import { useDebounce } from "use-debounce";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [position, setPosition] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [tempResults, setTempResults] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedText] = useDebounce(text, 300);
  const navigate = useNavigate();

  const handleWriting = (event) => {
    setText(event.target.value);
  };

  const handleClear = () => {
    setText("");
    setResults([]);
    setTempResults([]);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedText.trim() || debouncedText.trim().length < 3) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setTempResults([]);
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

  useEffect(() => {
    if (!loading) {
      setResults(tempResults);
    }
  }, [loading, tempResults]);

  const handleCertificationClick = (certification, e) => {
    e.preventDefault();
    try {
      if (!certification) {
        throw new Error("No certification data provided");
      }

      const platformId = certification.plataforma_certificacion_id;
      let path;

      switch (platformId) {
        case 1:
          path = `/cafam/certificacion/${certification.slug}`;
          break;
        case 2:
          path = `/cafam/certificacion/${certification.slug}`;
          break;
        default:
          path = `/cafam/certificacion/${certification.slug}`;
          break;
      }

      //console.log('Navigating to:', path);
      navigate(path);
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Error al navegar a la certificación");
    }
  };

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
          value={text}
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-search"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
          <path d="M21 21l-6 -6" />
        </svg>

        {loading && <span className="loader-search"></span>}

        {text && (
          <button onClick={handleClear} className="clear-button">
            <X />
          </button>
        )}
      </div>

      {debouncedText.trim() && results.length > 0 && (
        <div className="container-results-cafam">
          {results.map((resultado) => (
            <div
              key={resultado.id}
              onClick={(e) => handleCertificationClick(resultado, e)}
              className="box-result"
            >
              <div className="wrapper-img-box">
                <img
                  src={resultado.url_imagen_universidad_certificacion}
                  alt={resultado.nombre}
                />
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
