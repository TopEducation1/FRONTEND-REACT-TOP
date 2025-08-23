// src/components/SearchLMT.jsx
import React, { useState, useRef } from "react";
import { Link } from 'react-router-dom';
import FilterBySearch from "../services/filterBySearch";

export default function SearchLMT() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const debounceRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsActive(value.trim().length > 0);

    // Limpiar timeout previo
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Solo buscar si hay texto, con un pequeño retraso (300ms)
    if (value.trim()) {
      debounceRef.current = setTimeout(async () => {
        try {
          const data = await FilterBySearch.getResults(value.trim());
          setResults(data || []);
        } catch (error) {
          console.error("Error obteniendo resultados:", error);
        }
      }, 300);
    } else {
      setResults([]);
    }
  };

  return (
    <div className='text-center lg:text-left mt-2 cont-search-top relative'>
      <input
        type="text"
        placeholder="Buscar entre miles de certificaciones..."
        className="input w-full max-w-[80%] lg:max-w-[100%] px-4 py-2 rounded-full text-black mt-4 mb-4"
        id='search-lmt'
        value={query}
        onChange={handleChange}
      />
      <p className="text-sm text-center lg:text-left text-[#F6F4EF] mb-2">
        Busca por tema, habilidad, universidad o empresa
      </p>

      <div className="flex flex-wrap justify-center lg:justify-start gap-2 text-xs mt-4">
        {['Google', 'Amazon', 'Desarrollo Personal', 'Programación', 'Negocios', 'Marketing', 'Inteligencia Artificial'].map((tag, idx) => (
          <span
            key={idx}
            className="bg-[#F6F4EF] px-3 py-1 rounded-full hover:bg-neutral-400 cursor-pointer"
            onClick={() => handleChange({ target: { value: tag } })}
          >
            {tag}
          </span>
        ))}
      </div>

      {isActive && results.length > 0 && (
        <div
          className="mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto w-[97%] absolute top-[53px] left-2"
          data-lenis-prevent
        >
          {results.map((item, idx) => (
            <Link
              to={`/certificacion/${item.plataforma_certificacion.nombre.toLowerCase()}/${item.slug}`}
              key={idx}
              className="p-2 border-b hover:bg-gray-100 gap-2 cursor-pointer flex"
            >
              <img
                src={item.universidad_certificacion?.univ_img || item.empresa_certificacion?.empr_img || item.imagen_final || "#"}
                className="w-[50px] object-contain"
                alt=""
              />
              {item.nombre || item.titulo || "Sin nombre"}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
