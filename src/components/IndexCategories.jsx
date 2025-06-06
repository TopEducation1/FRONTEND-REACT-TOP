import React, { useState, useRef } from "react";
import { Link } from 'react-router-dom';

const IndexCategories = ({ onTagSelect, selectedTags }) => {
    const [openSections, setOpenSections] = useState([]);
    const indexRef = useRef(null);

    const sections = [
        {
            title: "Tema",
            subsections: ["Aprendizaje de idioma","Arte y humanidades","Ciencias de datos","Ciencias de la computación", "Ciencias sociales","Ciencia física e ingeniería","Desarrollo personal","Matemáticas y lógica","Negocios","Salud","Tecnología de la información"    ]
        },
        {
            title : "Habilidad",
            subsections: [ "Bienestar", "Comunicación", "Creatividad", "Crecimiento personal","Diversidad, equidad e inclusión","Estrategia","Liderazgo","Personas y cultura","Productividad","Trabajo en equipo"]
        },
        {
            title: "Universidad",
            subsections: [
                {
                    title: "Latinoamérica",
                    subsections: ["Universidad Nacional de Colombia", "Tecnológico de Monterrey", "Pontificia Universidad Católica del Perú", "UNAM", "Universidad Anáhuac", "SAE Institute México", "Pontificia Universidad Católica de Chile", "Universidad de Palermo", "Universidad de los Andes", "Universidad Austral"]
                },
                {
                    title: "Norteamérica",
                    subsections: ["University of New Mexico", "Parsons School of Design, The New School", "University of Michigan", "University of Virginia", "University of Illinois Urbana-Champaign", "University of California, Irvine", "The University of North Carolina at Chapel Hill", "Northwestern University", "University of Colorado Boulder", "Wesleyan University", "California Institute of the Arts", "Duke University", "University of Pennsylvania", "Berklee college of music", "Columbia University", "Harvard University", "Yale University", "Stanford University"]
                },
                {
                    title: "Oceania",
                    subsections: ["Macquarie University"]
                },
                {
                    title: "Europa",
                    subsections: ["IE Business School", "Universidad Autónoma de Barcelona", "Universidad Carlos III de Madrid"]
                }
            ]
        },{
            title: "Empresa",
            subsections: ["Capitals Coalition", "DeepLearning AI", "Big Interview", "UBITS", "HubSpot Academy", "SV Academy", "Pathstream", "Salesforce", "The Museum of Moder Art", "Banco Interamericano de Desarrollo", "Yad Vashem", "Google", "Microsoft"]
        },{
            title: "Plataforma",
            subsections: ["EdX", "Coursera", "MasterClass"]
        }
    ];

    const toggleSection = (index) => {
        setOpenSections(prev =>
            prev.includes(index)
                ? prev.filter(i => i != index)
                : [...prev, index]
        );
    };

    const renderSubsections = (category, subsections) => {
        return subsections.map((subsection, subIndex) => {
            if (typeof subsection === "string") {
                return (
                    <div key={subIndex} className="item-category">
                        <Link
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onTagSelect(category, subsection);
                            }}
                            style={{ pointerEvents : isSectionDisabled(category) ? 'none' : 'auto', opacity : isSectionDisabled(category) ? 0.5 : 1}}
                        >
                            <img className="sect-ico" src={(category=="Universidades")?`./assets/category/TE-${subsection }.webp`:`./assets/category/${subsection }.png`} alt="" />
                            {subsection}
                        </Link>
                    </div>
                );
            } else if (subsection.title && subsection.subsections) {
                return (
                    <div key={subIndex} className="submenu">
                        <h3>{subsection.title}</h3>
                        <div className={`unfold-list list-${subsection.title}`}>
                            {subsection.subsections.map((subsubsection, subsubIndex) => (
                                <div key={subsubIndex} className="subitem">
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onTagSelect(category, subsubsection);
                                        }}
                                        style={{ pointerEvents: isSectionDisabled(category) ? 'none' : 'auto', opacity: isSectionDisabled(category) ? 0.5 : 1 }}
                                    >
                                        <img className="sect-ico" src={`./assets/category/TE-${subsubsection }.webp`} alt="" />
                                        {subsubsection}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            return null;
        });
    };

    const isSectionDisabled = (sectionTitle) => {
        if (!selectedTags || !selectedTags.Plataforma) {
            return false; // Si no hay tags seleccionados, no deshabilitar nada
        }
    
        if (selectedTags.Plataforma.includes("MasterClass")) {
            return sectionTitle === "Tema";
        } else if (selectedTags.Plataforma.includes("Coursera") || selectedTags.Plataforma.includes("EdX")) {
            return sectionTitle === "Habilidad";
        }
        return false;
    };

    return (
        <div
            ref={indexRef}
            className="cont-menu-categ"
        >
            <div className="category-wrapper">
                <h2>Biblioteca</h2>
                {sections.map((section, index) => (
                    <div
                        className={`category-item item-${section.title} ${openSections.includes(index) ? "open" : ""}`}
                        key={index}
                    >
                        <button
                            className="unfold-category-button"
                            onClick={() => toggleSection(index)}
                            disabled={isSectionDisabled(section.title)}
                            style={{ opacity : isSectionDisabled(section.title) ? 0.5 : 1}}
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
                            <span>
                                {section.title==="Plataforma"?"Aliados":section.title}
                            </span>

                        </button>
                            <div className="unfold-list subprimery">
                                {renderSubsections(section.title, section.subsections)}
                            </div>
                        
                    </div>
                ))}
            </div>
        </div>
    );

};

export default IndexCategories;