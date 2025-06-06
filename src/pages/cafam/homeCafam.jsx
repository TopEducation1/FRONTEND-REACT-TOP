import React, { useState, useEffect, useCallback } from "react";
import LibraryPageCafam from "../../components/cafam/libraryCafam.jsx";
import UniversitiesSection from "../../components/cafam/SliderWithDots";
import FlagsCafam from "../../components/cafam/FlagsCafam";
import ImageSlider3D from "../../components/ImageSlider3D";
import tagFilterService from "../../services/filterByTagsTesting";
import { useDebounce } from "use-debounce";

const HomeCafam = () => {
    const scrollToLibrary = () => {
        const librarySection = document.getElementById("container-component-certifications-cafam");
        if (librarySection) {
          librarySection.scrollIntoView({ behavior: "smooth" });
        }
    };
    
    return (
        <>
            <section className="wrapper">
                <div className="container m-auto h-[80vh] mx-auto px-4 pt-[180px] pb-[50px] flex justify-center items-center gap-2 sect-h-pequ">
                    <div className="flex flex-wrap mx-[-15px] xl:mx-[-35px] lg:mx-[-20px] !mt-[-30px] !mb-[4.5rem] items-center">
                        <div className="xl:w-7/12 lg:w-7/12 w-full flex-[0_0_auto] xl:!px-[35px] lg:!px-[20px] !px-[15px]  max-w-full !relative">
                            <h1 className="text-neutral-950 text-6xl font-normal font-[Lora] text-left leading-[1.2em] relative sm:text-5xl md:text-6xl lg:text-7xl"><span className="font-bold text-8xl">Aprende hoy... </span>transforma tu futuro</h1>
                            <p>Descubre una nueva forma de aprender, a tu ritmo y desde cualquier lugar. Con acceso a las mejores herramientas educativas y contenido diseñado para ti, nuestra plataforma te brinda oportunidades ilimitadas para crecer y destacar en el área que elijas.</p>
                            <button className="bg-plataforma text-white font-bold py-2 px-4 mt-3 rounded-full" onClick={scrollToLibrary}>Explorar certificaciones</button>
                        </div>
                        <div className="xl:w-5/12 lg:w-5/12 w-full flex-[0_0_auto] xl:!px-[35px] lg:!px-[20px] !px-[15px] !mt-[25px] max-w-full">
                            <img className="rounded-lg" src="assets/cafam/images/imagen-main-cafam.png" alt="Imagen de cafam " />
                        </div>                        
                    </div>
                </div>
            </section>
            <section className="wrapper bg-plataforma rounded-t-[50px]">
                <div className="container m-auto mx-auto px-4 py-20 flex flex-wrap justify-center items-center gap-2">
                    <UniversitiesSection /> 
                </div>
            </section>     
            <section className="wrapper">
                <div className="container m-auto mx-auto px-4 py-20 flex flex-wrap justify-center items-center gap-2">
                    <LibraryPageCafam showRoutes={false} />
                </div>
            </section>
            <section className="wrapper bg-neutral-300 py-15">
                <h2 className="text-neutral-950 text-center text-4xl">Explora clases con los líderes de la industria</h2>
                
                <FlagsCafam
                    handleBannerClick={(company) => {
                    handleBannerClick("Empresa", company);
                    }}
                />
            </section>
            <footer className="footer bg-plataforma">
                    <div className="container m-auto">
                        <p className="text-white text-center">Cafam 2025 | Todos los derechos reservados</p>
                    </div>
            </footer>
        </>

    );
}

export default HomeCafam;

