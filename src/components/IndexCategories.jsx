import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';

const IndexCategories = ({ onTagSelect, selectedTags }) => {
    const [openSections, setOpenSections] = useState([]);
    const [temas, setTemas] = useState([]);
    const [habilidades, setHabilidades] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [plataformas, setPlataformas] = useState([]);
    const [universidadesPorRegion, setUniversidadesPorRegion] = useState({});
    const indexRef = useRef(null);

    useEffect(() => {
        fetch("backend-django-top-production.up.railway.app/api/topics/")
            .then(res => res.json())
            .then(data => {
                setTemas(data.filter(t => t.tem_type === "Tema"));
                setHabilidades(data.filter(h => h.tem_type === "Habilidad"));
            });

        fetch("backend-django-top-production.up.railway.app/api/companies/")
            .then(res => res.json())
            .then(data => setEmpresas(data.filter(t => t.empr_est === "enabled")));

        fetch("backend-django-top-production.up.railway.app/api/platforms/")
            .then(res => res.json())
            .then(data => setPlataformas(data));

        fetch("backend-django-top-production.up.railway.app/api/universities-by-region/")
            .then(res => res.json())
            .then(data => setUniversidadesPorRegion(data));
    }, []);

    const toggleSection = (index) => {
        setOpenSections(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const isSectionDisabled = (sectionTitle) => {
        if (!selectedTags || !selectedTags.Plataforma) return false;

        if (selectedTags.Plataforma.includes("MasterClass")) return sectionTitle === "Tema";
        if (selectedTags.Plataforma.includes("Coursera") || selectedTags.Plataforma.includes("EdX")) return sectionTitle === "Habilidad";

        return false;
    };

    const renderItems = (category, items) => {
        return items.map((item) => (
            <div key={item.id} className="item-category">
                <Link
                    to="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onTagSelect(category, item.nombre);
                    }}
                    style={{
                        pointerEvents: isSectionDisabled(category) ? 'none' : 'auto',
                        opacity: isSectionDisabled(category) ? 0.5 : 1
                    }}
                >
                    <img
                        className="sect-ico"
                        src={item.empr_ico || item.univ_ico ||item.tem_img ||item.plat_ico || `/assets/category/${item.nombre}.png`}
                        alt={item.nombre}
                    />
                    {item.nombre}
                </Link>
            </div>
        ));
    };

    const sections = [
        {
            title: "Tema",
            renderContent: () => renderItems("Tema", temas)
        },
        {
            title: "Habilidad",
            renderContent: () => renderItems("Habilidad", habilidades)
        },
        {
            title: "Universidad",
            renderContent: () => (
                Object.entries(universidadesPorRegion).map(([region, universidades]) => (
                    <div key={region} className="submenu">
                        <h3>{region}</h3>
                        <div className={`unfold-list list-${region}`}>
                            {universidades.map((uni) => (
                                <div key={uni.id} className="subitem">
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onTagSelect("Universidad", uni.nombre);
                                        }}
                                        style={{
                                            pointerEvents: isSectionDisabled("Universidad") ? 'none' : 'auto',
                                            opacity: isSectionDisabled("Universidad") ? 0.5 : 1
                                        }}
                                    >
                                        <img className="sect-ico" src={uni.img || uni.univ_img} alt={uni.nombre} />
                                        {uni.nombre}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )
        },
        {
            title: "Empresa",
            renderContent: () => renderItems("Empresa", empresas)
        },
        {
            title: "Plataforma",
            renderContent: () => renderItems("Plataforma", plataformas)
        }
    ];

    return (
        <div ref={indexRef} className="cont-menu-categ">
            <div className="category-wrapper">
                <h2>Biblioteca</h2>
                {sections.map((section, index) => (
                    <div
                        key={index}
                        className={`category-item item-${section.title} ${openSections.includes(index) ? "open" : ""}`}
                    >
                        <button
                            className="unfold-category-button"
                            onClick={() => toggleSection(index)}
                            disabled={isSectionDisabled(section.title)}
                            style={{
                                opacity: isSectionDisabled(section.title) ? 0.5 : 1
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={openSections.includes(index) ? "rotate" : ""}
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M9 6l6 6l-6 6" />
                            </svg>
                            <span>{section.title === "Plataforma" ? "Aliados" : section.title}</span>
                        </button>
                        <div className="unfold-list subprimery">
                            {section.renderContent()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IndexCategories;
