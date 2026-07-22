import React, { useEffect, useState } from "react";
import Flags from "../components/Flags";
import TeamsHero from "../components/TeamsHero";
import TeamsPricing from "../components/TeamsPricing";
import ImageSlider3D from "../components/ImageSlider3D";
import Seo from "../components/Seo";
import endpoints from "../config/api";

function ParaEquipos () {
    const flagsTeams = [
        {
            id: 1, src: "assets/universities/flags/BA-TE-CAMBRIDGE.webp", category:"Universidad", link: "University of Michigan",title:"",desc:""
        },{
            id: 2, src: "assets/universities/flags/BA-TE-CAPE-TOWN.webp", category:"Universidad", link: "Berklee College of Music",title:"",desc:""
        },{
            id: 3, src: "assets/universities/flags/BA-TE-MASSACHUSETTS.webp", category:"Universidad", link: "Peking University",title:"",desc:""
        },{
            id: 4, src: "assets/universities/flags/BA-TE-OXFORD.webp", category:"Universidad", link: "Columbia University",title:"",desc:""
        },{
            id: 5, src: "assets/universities/flags/BA-TE-HARVARD.webp", category:"Universidad", link: "Harvard University",title:"",desc:""
        },{
            id: 6, src: "/assets/universities/flags/BA-TE-COLUMBIA.webp", category:"Universidad", link: "Columbia University",title:"",desc:""
        },{
            id: 7, src:"/assets/universities/flags/BA-TE-ILLINOIS.webp", category:"Universidad", link: "University of Illinois Urbana-Champaign",title:"",desc:""
        },{
            id: 8, src: "/assets/universities/flags/BA-TE-MONTERREY.webp", category:"Universidad", link: "Tecnológico de Monterrey",title:"",desc:""
        },{
            id: 9, src:"/assets/universities/flags/BA-TE-VIRGINIA.webp", category:"Universidad", link: "University of Virginia",title:"",desc:""
        },{
            id: 10, src:"/assets/universities/flags/BA-TE-SEA.webp", category:"Universidad", link: "SAE-México",title:"",desc:""
        },{
            id: 11, src:"/assets/universities/flags/BA-TE-CHICAGO.webp", category:"Universidad", link: "The University of Chicago",title:"",desc:""
        },{
            id: 12, src: "/assets/universities/flags/BA-TE-BERKLEE.webp", category:"Universidad", link: "Berklee College of Music",title:"",desc:""
        },{
            id: 13, src:"/assets/universities/flags/BA-TE-PARSONS.webp", category:"Universidad", link: "Parsons School of Design, The New School",title:"",desc:""
        },{
            id: 14, src:"/assets/universities/flags/BA-TE-COLORADO.webp", category:"Universidad", link: "University of Colorado Boulder",title:"",desc:""
        },{
            id: 15, src:"/assets/universities/flags/BA-TE-IRVINE.webp", category:"Universidad", link: "University of California Irvine",title:"",desc:""
        },{
            id: 16, src:"/assets/universities/flags/BA-TE-NORTHWESTERN.webp", category:"Universidad", link: "Northwestern University",title:"",desc:""
        }
    ];
    
    const [logos, setLogos] = useState([]);
    useEffect(() => {
        fetch(endpoints.empresas)
          .then(res => res.json())
          .then(data => setLogos(data.filter(t => t.empr_est === "enabled")))
          .catch((err) => console.error("Error:", err));
      }, []);

    useEffect(() => {
        window.scrollTo(0,0); 
    }, []);

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);

        if (!section) return;

        section.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };
    
    return (
        <>
            {/**SEO ELEMENTS WITH REACT -HELMET */}
            <Seo
                title="Capacitación empresarial y formación para equipos"
                description="Capacita a tu equipo con rutas personalizadas, seguimiento de progreso y certificaciones de instituciones reconocidas a nivel mundial."
                canonicalPath="/para-equipos"
                />
            <TeamsHero />
            <section className="relative overflow-hidden bg-[#F5F3EE] px-4 py-20 md:py-28">
                <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 lg:grid-cols-2">
                    {/* MOCKUP */}
                    <div
                    className="overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.10)]
                    "
                    >
                    {/* SAFARI BAR */}
                    <div className="flex h-[46px] items-center gap-2 bg-[#0F090B] px-6">
                        <span className="h-3 w-3 rounded-full bg-[#FF6259]" />
                        <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                    </div>

                    {/* CONTENT */}
                    <div className="bg-white px-6 py-8 md:px-8 md:py-6">
                        <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-[#2563EB]/10">
                            <span className="h-4 w-4 rounded-full bg-[#2563EB]" />
                            </span>

                            <p className="!font-['Montserrat'] text-[15px] font-semibold text-[#0F090B]">
                            Onboarding ejecutivo Q1
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-4">
                            <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-[#5CC781]/15">
                                <span className="h-4 w-4 rounded-full bg-[#5CC781]" />
                            </span>

                            <p className="!font-['Montserrat'] text-[15px] font-semibold text-[#0F090B]">
                                Certificación en datos
                            </p>
                            </div>

                            <div className="ml-[60px] -mt-2 h-2 rounded-full bg-[#F3F1EC]">
                            <div className="h-full w-[85%] rounded-full bg-[#5CC781]" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-4">
                            <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-[#F5B942]/15">
                                <span className="h-4 w-4 rounded-full bg-[#F5B942]" />
                            </span>

                            <p className="!font-['Montserrat'] text-[15px] font-semibold text-[#0F090B]">
                                Liderazgo avanzado
                            </p>
                            </div>

                            <div className="ml-[60px] -mt-2 h-2 rounded-full bg-[#F3F1EC]">
                            <div className="h-full w-[42%] rounded-full bg-[#F5B942]" />
                            </div>
                        </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-3">
                        <span className="!font-['Montserrat'] text-[14px] text-neutral-500">
                            12 miembros activos
                        </span>

                        <a
                            href="/para-equipos"
                            className="!font-['Montserrat'] text-[14px] font-bold text-[#2563EB]"
                        >
                            Ver reporte →
                        </a>
                        </div>
                    </div>
                    </div>

                    {/* TEXT */}
                    <div className="text-center lg:text-left">
                    <span className="mb-3 block !font-['Montserrat'] text-[13px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                        Para empresas
                    </span>

                    <h2 className="!font-[Montserrat] text-[2rem] font-semibold leading-[1.2em] md:leading-[1.02em] text-[#0F090B] md:text-[3.2rem]">
                        Crea tu propia
                        <br />
                        <span className="font-te-it !text-[2.5rem] md:!text-[2.8rem]">universidad corporativa</span>
                    </h2>

                    <p className="mt-8 max-w-[610px] !font-['Montserrat'] text-[1rem] leading-[1.5em] text-neutral-600 lg:max-w-none">
                        Centraliza toda la formación de tu empresa en un solo lugar. Asigna
                        rutas, monitorea el progreso y emite certificaciones con el respaldo de
                        las mejores instituciones del mundo.
                    </p>

                    <a
                        href="https://meetings.hubspot.com/top-education-master"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#2563EB] px-8 py-4 !font-['Montserrat'] text-[16px] font-bold text-white shadow-[0_18px_45px_rgba(25,65,207,0.30)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1941CF] "
                    >
                        Empieza gratis

                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="translate-y-[1px]"
                        >
                        <path d="M5 12h14" />
                        <path d="m13 5 7 7-7 7" />
                        </svg>
                    </a>
                    </div>
                </div>
            </section>
            <section className="relative overflow-hidden bg-white px-4 py-20 md:py-28">
                <div className="mx-auto max-w-[1200px]">
                    {/* TITLE */}
                    <div className="mx-auto max-w-[880px] text-center">
                        <h2 className="font-te text-[2.5rem] leading-[1.05em] text-[#0F090B] md:text-[3.8rem]">
                            <span className="font-te-it">Impulsa</span> el crecimiento
                            <br />
                            y la productividad
                        </h2>
                    </div>

                    {/* CARDS */}
                    <div className="mt-8 grid grid-cols-1 gap-3 md:gap-6 md:grid-cols-3">
                    <div className="rounded-[18px] border border-black/10 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
                        <div className="mb-3 grid h-[58px] w-[58px] place-items-center rounded-[16px] bg-[#2563EB]/10 text-[#2563EB]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 20V10" />
                            <path d="M10 20V4" />
                            <path d="M16 20v-7" />
                            <path d="M22 20V8" />
                        </svg>
                        </div>

                        <h3 className="!font-['Montserrat'] text-[1.2rem] font-semibold leading-[1.2em] text-[#0F090B]">
                        Seguimiento en tiempo real
                        </h3>

                        <p className="mt-2 !font-['Montserrat'] text-[1rem] leading-[1.2em] md:leading-[1.5em] text-neutral-600">
                        Monitorea el avance de cada miembro con dashboards intuitivos y
                        reportes automáticos para líderes.
                        </p>
                    </div>

                    <div className="rounded-[18px] border border-black/10 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
                        <div className="mb-3 grid h-[58px] w-[58px] place-items-center rounded-[16px] bg-[#5CC781]/10 text-[#5CC781]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m12 3 8 4-8 4-8-4 8-4Z" />
                            <path d="m4 11 8 4 8-4" />
                            <path d="m4 15 8 4 8-4" />
                        </svg>
                        </div>

                        <h3 className="!font-['Montserrat'] text-[1.2rem] font-semibold leading-[1.2em] text-[#0F090B]">
                        Rutas personalizadas
                        </h3>

                        <p className="mt-2 !font-['Montserrat'] text-[1rem] leading-[1.2em] md:leading-[1.5em] text-neutral-600">
                        Asigna programas de formación adaptados al rol, nivel y objetivos de
                        cada persona en tu equipo.
                        </p>
                    </div>

                    <div className="rounded-[18px] border border-black/10 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
                        <div className="mb-3 grid h-[58px] w-[58px] place-items-center rounded-[16px] bg-[#F5B942]/10 text-[#F5B942]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                            <path d="M6 12v5c3 2 9 2 12 0v-5" />
                            <path d="M22 10v6" />
                        </svg>
                        </div>

                        <h3 className="!font-['Montserrat'] text-[1.2rem] font-semibold leading-[1.2em] text-[#0F090B]">
                        Certificaciones globales
                        </h3>

                        <p className="mt-2 !font-['Montserrat'] text-[1rem] leading-[1.2em] md:leading-[1.5em] text-neutral-600">
                        Accede a certificaciones de MIT, Yale, Stanford y más. Validadas
                        internacionalmente en tu industria.
                        </p>
                    </div>
                    </div>
                </div>
            </section>
            <section className="relative overflow-hidden bg-[#F8F7F4] px-4 py-20 md:py-28">
                <div className="mx-auto max-w-[1200px]">
                    {/* HEADER */}
                    <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1fr_auto]">
                    <div>
                        <span className="mb-1 block font-['Montserrat'] text-[13px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                        Alianzas globales
                        </span>

                        <h2 className="max-w-[760px] !font-[Montserrat] font-semibold text-[2rem] leading-[1.08em] text-[#0F090B] md:text-[2.8rem]">
                        Forma a tu equipo ejecutivo con las mejores instituciones
                        </h2>
                    </div>

                    {/* PILLS */}
                    <div className="flex flex-wrap items-center gap-3 lg:pb-4">
                        <span className="rounded-full bg-[#062529] px-6 py-3 font-['Montserrat'] text-[15px] font-bold text-white">
                        edX
                        </span>

                        <span className="rounded-full bg-[#2F5BD6] px-6 py-3 font-['Montserrat'] text-[15px] font-bold text-white">
                        Coursera
                        </span>

                        <span className="rounded-full bg-[#111111] px-6 py-3 font-['Montserrat'] text-[15px] font-bold text-white">
                        MasterClass
                        </span>
                    </div>
                    </div>

                    {/* SLIDER EXISTENTE */}
                    <div className="mt-3">
                    <ImageSlider3D images={flagsTeams} />
                    </div>
                </div>
            </section>
            <TeamsPricing />
            
            <section className="relative overflow-hidden bg-[#F8F7F4] px-4 py-20 md:py-28">
                <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_0.95fr]">
                    {/* TEXT */}
                    <div>
                    <span className="mb-3 block font-['Montserrat'] text-[13px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                        Soft skills
                    </span>

                    <h2 className="!font-[Montserrat] text-[2rem] font-semibold leading-[1.05em] text-[#0F090B] md:text-[2.8rem]">
                        Potencia las habilidades
                        <br />
                        <span className="font-te-it">blandas</span> de tu equipo
                    </h2>

                    <p className="mt-2 max-w-[600px] font-['Montserrat'] text-[1.12rem] leading-[1.5em] text-neutral-600">
                        Complementa el conocimiento técnico con las habilidades que realmente
                        diferencian a los líderes: comunicación, liderazgo, pensamiento crítico
                        y más.
                    </p>

                    {/* TAGS */}
                    <div className="mt-10 flex max-w-[720px] flex-wrap gap-3">
                        <span className="rounded-full border border-[#2563EB]/25 bg-[#2563EB]/10 px-5 py-2 font-['Montserrat'] text-[14px] font-bold text-[#2563EB]">
                        Liderazgo
                        </span>

                        <span className="rounded-full border border-[#5CC781]/25 bg-[#5CC781]/10 px-5 py-2 font-['Montserrat'] text-[14px] font-bold text-[#5CC781]">
                        Comunicación
                        </span>

                        <span className="rounded-full border border-[#F5B942]/30 bg-[#F5B942]/10 px-5 py-2 font-['Montserrat'] text-[14px] font-bold text-[#F5B942]">
                        Pensamiento crítico
                        </span>

                        <span className="rounded-full border border-[#D33B3E]/25 bg-[#D33B3E]/10 px-5 py-2 font-['Montserrat'] text-[14px] font-bold text-[#D33B3E]">
                        Trabajo en equipo
                        </span>

                        <span className="rounded-full border border-[#034694]/25 bg-[#034694]/10 px-5 py-2 font-['Montserrat'] text-[14px] font-bold text-[#034694]">
                        Adaptabilidad
                        </span>

                        <span className="rounded-full border border-[#7C72FF]/25 bg-[#7C72FF]/10 px-5 py-2 font-['Montserrat'] text-[14px] font-bold text-[#7C72FF]">
                        Resolución de conflictos
                        </span>
                    </div>

                    <a
                        href="/explora"
                        className="mt-12 inline-flex items-center justify-center rounded-full bg-[#2563EB] px-8 py-4 font-['Montserrat'] text-[16px] font-bold text-white shadow-[0_18px_45px_rgba(25,65,207,0.30)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1941CF] "
                    >
                        Explorar habilidades
                    </a>
                    </div>

                    {/* ICON GRID */}
                    <div className="grid grid-cols-3 gap-4 md:gap-5">
                    <div className="col-span-2 row-span-2 grid min-h-[280px] place-items-center rounded-[18px] bg-[#D9D7F1] md:min-h-[360px]">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="46"
                        height="46"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#7C72FF"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        >
                        <path d="M12 5a3 3 0 0 0-3 3v1H8a3 3 0 0 0 0 6h1v1a3 3 0 0 0 6 0v-1h1a3 3 0 0 0 0-6h-1V8a3 3 0 0 0-3-3Z" />
                        <path d="M9 9h6" />
                        <path d="M9 15h6" />
                        <path d="M12 5v14" />
                        </svg>
                    </div>

                    <div className="grid min-h-[140px] place-items-center rounded-[18px] bg-[#E6F0E2] md:min-h-[170px]">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#7ACF8E"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        >
                        <path d="M16 11a4 4 0 1 0-8 0" />
                        <path d="M3 21a7 7 0 0 1 14 0" />
                        <path d="M19 8v6" />
                        <path d="M22 11h-6" />
                        </svg>
                    </div>

                    <div className="grid min-h-[140px] place-items-center rounded-[18px] bg-[#F6EEDB] md:min-h-[170px]">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#F5B942"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        >
                        <path d="M12 3v10" />
                        <path d="M8 7a4 4 0 1 1 8 0" />
                        <path d="M8 13a4 4 0 0 0 8 0" />
                        <path d="M12 17v4" />
                        <path d="M8 21h8" />
                        </svg>
                    </div>

                    <div className="grid min-h-[140px] place-items-center rounded-[18px] bg-[#F3DDD8] md:min-h-[170px]">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FF9B98"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        >
                        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                        </svg>
                    </div>

                    <div className="grid min-h-[140px] place-items-center rounded-[18px] bg-[#DCE2EE] md:min-h-[170px]">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6F92DD"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        >
                        <path d="M9 18h6" />
                        <path d="M10 22h4" />
                        <path d="M8 14a6 6 0 1 1 8 0c-.8.7-1 1.3-1 2H9c0-.7-.2-1.3-1-2Z" />
                        </svg>
                    </div>

                    <div className="grid min-h-[140px] place-items-center rounded-[18px] bg-[#E8DFF1] md:min-h-[170px]">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#AA83F5"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        >
                        <path d="m12 2 2.9 6.1 6.7.9-4.8 4.7 1.1 6.6L12 17.2 6.1 20.3l1.1-6.6L2.4 9l6.7-.9L12 2z" />
                        </svg>
                    </div>
                    </div>
                </div>
            </section>
            <section className="relative overflow-hidden bg-white px-4 py-20 md:py-28">
                <div className="mx-auto max-w-[980px] text-center">
                    <span className="mb-2 block font-['Montserrat'] text-[13px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                    Sin compromiso
                    </span>

                    <h2 className="!font-[Montserrat] text-[2rem] font-semibold leading-[1em] text-[#0F090B] md:text-[2.8rem]">
                    <span className="font-te-it !text-[3rem]">Reserva</span> una demostración empresarial
                    </h2>

                    <p className="mx-auto mt-3 max-w-[720px] font-['Montserrat'] text-[1rem] leading-[1.5em] text-neutral-600">
                    Muéstrale a tu equipo lo que top.education puede hacer. Una sesión
                    personalizada de 30 minutos con nuestro equipo de éxito empresarial.
                    </p>

                    <div className="mt-5 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => scrollToSection("demo-equipos")}
                            className="group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-[#1941CF] px-8 py-4 !font-['Montserrat'] text-[15px] font-bold text-white"
                            >
                            Agendar demo gratuita
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollToSection("precios")}
                            className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-black/15 bg-white px-8 py-4 font-['Montserrat'] text-[16px] font-bold text-[#0F090B] transition-all duration-300 hover:-translate-y-1 hover:border-black/30 hover:bg-[#F8F7F4]"
                        >
                            Ver planes
                        </button>
                    </div>

                    <p className="mt-7 font-['Montserrat'] text-[14px] text-neutral-400">
                    Sin tarjeta de crédito · Respuesta en menos de 24h
                    </p>
                </div>
            </section>
            <section className="bg-[#0F090B]">
                <Flags direction="left" logos={logos} />
            </section>
            
        </>

    );

}


export default ParaEquipos;