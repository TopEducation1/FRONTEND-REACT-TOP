import React from 'react';

import { useState, useEffect } from "react";
import FilterBySearch from "../services/filterBySearch";
import { useDebounce } from "use-debounce";
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';


const SearchBar = () => {
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    const [tempResults, setTempResults] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultsVisible, setResultsVisible] = useState(false);
    const [isFixed, setIsFixed] = useState(false); 
    const [debouncedText] = useDebounce(text, 300);
    const navigate = useNavigate();
    const host = window.location.hostname;
    const location = useLocation();

    const handleWriting = event => {
        const newText = event.target.value;
        setText(newText);
        setIsFixed(newText.trim() !== "");
    };

    const handleClear = () => {
        setText('');
        setResults([]);
        setTempResults([]);
        setIsFixed(false); 
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
                console.error('Error al enviar datos: ', error);
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

    useEffect(() => {
        if (debouncedText.trim() && results.length > 0) {
            setResultsVisible(true);
        } else {
            setResultsVisible(false);
        }
    }, [debouncedText, results]);

    useEffect(() => {
        if (resultsVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [resultsVisible]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("search");

        if (searchQuery) {
            // Decodifica por si viene con caracteres codificados (como %20, etc.)
            setText(decodeURIComponent(searchQuery));
            setIsFixed(true);
            
        }
    }, [location.search]);

    const handleCertificationClick = (certification) => {
        try {
            if (!certification) {
                throw new Error('No certification data provided');
            }

            let path = `/certificacion/${certification.plataforma_certificacion.nombre.toLowerCase()}/${certification.slug}`;

            navigate(path);
        } catch (err) {
            console.error('Navigation error:', err);
            setError('Error al navegar a la certificación');
        }
    };

    return (
        <>
            <div 
                className={`wrapper-search-bar transition-all duration-300 ${
                isFixed
                    ? "!fixed top-[83px] left-[25%]  !w-[50%] z-50"
                    : "relative "
                }`}
            >
                <span className='absolute top-[-15px] text-[0.7rem] w-[100%] text-white'>Busca por tema, habilidad, universidad o institución</span>
                <input
                    type="text"
                    placeholder="¿Qué quieres aprender?"
                    name="text"
                    className="input"
                    onChange={handleWriting}
                    value={text}
                />
                {text && (
                    <button onClick={handleClear} className="clear-button">
                        <X />
                    </button>
                )}
                <div className='serch-btn'>
                <svg
                    fill="white"
                    width="20px"
                    height="20px"
                    viewBox="0 0 1920 1920"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z" fillRule="evenodd"></path>
                </svg>
                </div>
                {loading && <span className="loader-search"></span>}
            </div>
                
            {debouncedText.trim() && results.length > 0 && (
                <div className="container-results" data-lenis-prevent>
                    {results.map((resultado) => (
                        <div key={resultado.id} onClick={(e) => handleCertificationClick(resultado, e)} className="certification-card">
                            <div className="container-img-card">
                                <img src={resultado.universidad_certificacion?.univ_img || resultado.empresa_certificacion?.empr_img || resultado.imagen_final} alt={resultado.nombre} />
                            </div>
                            <div className="tags-card">
                                <div className={`tag-category ${resultado.tema_certificacion?.tem_col || 'tag-verde'}`}>
                                    {resultado.tema_certificacion?.nombre || 'Sin categoría'}
                                </div>
                            </div>
                            <div className="title-certification"><h3>{resultado.nombre}</h3></div>
                            <div className="tag-platform">
                                <img
                                    src={resultado.plataforma_certificacion.plat_img}
                                    alt={resultado.plataforma_certificacion.nombre}
                                />
                            </div>
                        </div>
                        
                    ))}
                </div>
            )}
        </>
    );
};

export default SearchBar;