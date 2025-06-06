import React, { useState, useRef } from "react";
import { Link } from 'react-router-dom';

const IndexCategoriesCafam = ({ onTagSelect, selectedTags }) => {
    const [openSections, setOpenSections] = useState([]);
    const indexRef = useRef(null);

    const sections = [
        {
            title: "Tema",
            subsections: ["Arte y Humanidades", "Negocios", "Ciencias de la computación", "Ciencias de Datos", "Tecnología de la información", "Salud", "Matemáticas y Logica", "Desarrollo Personal", "Ciencia física e Ingenieria", "Ciencias Sociales", "Aprendizaje de un Idioma"]
        },
        {
            title: "Empresa",
            subsections: ["Capitals Coalition", "DeepLearning.AI", "Big Interview", "UBITS", "HubSpot Academy", "SV Academy", "Pathstream", "Salesforce", "The Museum of Moder Art", "Banco Interamericano de Desarrollo", "Yad Vashem", " Google", "Microsoft"]
        },
        {
            title: "Universidad",
            subsections: [
                {
                    title: "Oceania",
                    subsections: ["Macquarie University"]
                },
                {
                    title: "Europa",
                    subsections: ["IE Business School", "Universidad Autónoma de Barcelona", "Universidad Carlos III de Madrid"]
                },
                {
                    title: "Latinoamérica",
                    subsections: ["Universidad de chile", "Universidad Nacional de Colombia", "Tecnológico de Monterrey", "Pontificia Universidad Católica del Perú", "UNAM", "Universidad Anáhuac", "SAE Institute México", "Pontificia Universidad Católica de Chile", "Universidad de Palermo", "Universidad de los Andes", "Universidad Austral"]
                },
                {
                    title: "Norteamérica",
                    subsections: ["University of New Mexico", "Parsons School of Design, The New School", "University of Michigan", "University of Virginia", "University of Illinois Urbana-Champaign", "University of California, Irvine", "The University of North Carolina at Chapel Hill", "Northwestern University", "University of Colorado Boulder", "Wesleyan University", "California Institute of the Arts", "Duke University", "University of Pennsylvania", "Berklee college of music", "Columbia", "Harvard University", "Yale university", "Stanford"]
                }
            ]
        }
    ];

    const toggleSection = (index) => {
        setOpenSections(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
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
                        <div className={`unfold-list list-${subsection.title}`} >
                            {subsection.subsections.map((subsubsection, subsubIndex) => (
                                <div key={subsubIndex}>
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onTagSelect(category, subsubsection);
                                        }}
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

    return (
        <div
            ref={indexRef}
            className={`index-container-cafam `}
        >
            <div className="category-wrapper">
                {sections.map((section, index) => (
                    <div
                        className={`category-item-cafam ${openSections.includes(index) ? "open" : ""}`}
                        key={index}
                    >
                        <button
                            className="unfold-category-button-cafam"
                            onClick={() => toggleSection(index)}
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
                                {section.title}
                            </span>

                        </button>
                        {openSections.includes(index) && (
                            <div className="unfold-list-cafam">
                                {renderSubsections(section.title, section.subsections)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IndexCategoriesCafam;