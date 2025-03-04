import LibraryPageCafam from "../../components/cafam/libraryCafam.jsx";
//import SliderWithDots from "../../components/cafam/SliderWithDots";
//import AnimatedCarousel from "../../components/cafam/AnimatedCarousel.jsx";
//import Flags from "../../components/Flags.jsx";
//import React, { useState, useEffect, useCallback } from "react";
//import SlidingMenuIndex from "../../components/SlidingMenuIndex.jsx"


const HomeCafam = () => {


    const scrollToLibrary = () => {
        const librarySection = document.getElementById("container-component-certifications-cafam");
        if (librarySection) {
          librarySection.scrollIntoView({ behavior: "smooth" });
        }
      };
    

    return (
        <>
            
            <div id="main-section-cafam">

                <div id="left-wrapper-cafam">
                    <div id="wrapper-content-cafam">
                        <div id="wrapper-titles-cafam">
                            <h1 id="first-h1-left">Aprende hoy...</h1>
                            <h1 id="second-h1-left">transforma tu futuro</h1>
                        </div>

                        <p>
                            Descubre una nueva forma de aprender, a tu ritmo y desde cualquier lugar. Con acceso a las mejores herramientas educativas y contenido diseñado para ti, nuestra plataforma te brinda oportunidades ilimitadas para crecer y destacar en el área que elijas.
                        </p>
                        <button id="button-explora-cafam" onClick={scrollToLibrary}>Explora</button>
                    </div>

                </div>
                <div id="right-wrapper-cafam">
                    <img src="assets/cafam/images/imagen-main-cafam.png" alt="Imagen de cafam " />
                </div>

            </div>

            


            <div id="container-component-certifications-cafam">

                <LibraryPageCafam showRoutes={false} />

            </div>


            

            <div id="footer-images-cafam">
            Cafam 2024 | Todos los derechos reservados

            </div>




        </>

    );
}

export default HomeCafam;

