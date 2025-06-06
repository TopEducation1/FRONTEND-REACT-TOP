import React, {  useEffect } from "react";
import Flags from "../components/Flags";
import SliderMasterClass from "../components/SliderMasterClass";
import ImageSlider3D from "../components/ImageSlider3D";
import { Helmet } from "react-helmet";

function ParaEquipos () {
    const flagsTeams = [
        {
            id: 1, src: "assets/flags/BA-TE-CAMBRIDGE.webp", category:"Universidad", link: "University of Michigan",title:"",desc:""
        },{
            id: 2, src: "assets/flags/BA-TE-CAPE-TOWN.webp", category:"Universidad", link: "Berklee College of Music",title:"",desc:""
        },{
            id: 3, src: "assets/flags/BA-TE-MASSACHUSETTS.webp", category:"Universidad", link: "Peking University",title:"",desc:""
        },{
            id: 4, src: "assets/flags/BA-TE-OXFORD.webp", category:"Universidad", link: "Columbia University",title:"",desc:""
        },{
            id: 5, src: "assets/flags/BA-TE-HARVARD.webp", category:"Universidad", link: "Harvard University",title:"",desc:""
        },{
            id: 6, src: "assets/flags/BA-TE-CAMBRIDGE.webp", category:"Universidad", link: "University of Michigan",title:"",desc:""
        },{
            id: 7, src: "assets/flags/BA-TE-CAPE-TOWN.webp", category:"Universidad", link: "Berklee College of Music",title:"",desc:""
        },{
            id: 8, src: "assets/flags/BA-TE-MASSACHUSETTS.webp", category:"Universidad", link: "Peking University",title:"",desc:""
        },{
            id: 9, src: "assets/flags/BA-TE-OXFORD.webp", category:"Universidad", link: "Columbia University",title:"",desc:""
        },{
            id: 10, src: "assets/flags/BA-TE-HARVARD.webp", category:"Universidad", link: "Harvard University",title:"",desc:""
        }
    ]
    useEffect(() => {
        window.scrollTo(0,0);
        
    }, []);
    
    return (
        <>
            {/**SEO ELEMENTS WITH REACT -HELMET */}
            <Helmet>
                <title>Para Equipos | Capacita a tu equipo con Top.education</title>
                <meta name="description" content="Capacita a tu equipo sin grandes inversiones. Optimiza el desarrollo profesional con soluciones educativas personalizadas. Impulsa productividad e innovación." />
                <meta property="og:title" content="Capacita a tu equipo con Top Education" />
                <meta name="author" content="Top Education" />
                <meta name="robots" content="index, follow" />
                <meta property="og:description" content="Potencia tu perfil profesional con una suscripción a Top Education. Accede a +13,000 certificaciones y recursos exclusivos para transformar tu futuro." />
                <meta property="og:type" content="website" />
            </Helmet>
            <section className="wrapper ">
                <div className="container m-auto h-screen mx-auto flex justify-center items-center gap-2 sect-h-pequ">
                    <span class="w-5/15 lg:w-5/15 aspect-square bg-gradient-to-tr from-red-500 to-red-900 absolute top-30 lg:left-50 rounded-full skew-y-0 blur-2xl opacity-40 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
                    <div>
                        <h1 className="text-white text-6xl font-normal font-[Lora] text-left leading-[1.2em] z-10 relative sm:text-4xl md:text-6xl lg:text-7xl xl:text-9xl">Capacita a tu equipo<br></br> <span className="italic">sin</span> grandes inversiones</h1>
                        <p className="text-white mt-5 text-2xl text-left z-10 relative">Numerosas compañías invierten sumas significativas en la formación de sus empleados sin obtener mejoras tangibles. <span id="top">top</span><span id="education">.education</span> optimiza los procesos de capacitación, reduciendo costos y aumentando la eficiencia.</p>
                    </div>
                </div>
            </section>
            <section className="wrapper ">
                <div className="container m-auto !pb-[4.5rem] xl:!pb-24 lg:!pb-24 md:!pb-24">
                    <div className="flex flex-wrap mx-[-15px] xl:mx-[-35px] lg:mx-[-20px] !mt-[-50px] items-center">
                        <div className="xl:w-7/12 lg:w-7/12 w-full flex-[0_0_auto] xl:!px-[35px] lg:!px-[20px] !px-[15px] !mt-[50px] max-w-full">
                            <img className="w-full ml-[-30px] rounded-lg" src="/assets/banners/u-top-education.gif" alt="" />
                        </div>
                        <div className="xl:w-5/12 lg:w-5/12 w-full flex-[0_0_auto] xl:!px-[35px] lg:!px-[20px] !px-[15px] !mt-[50px] max-w-full">
                            <h2 className="text-white text-5xl font-normal font-[Lora] w-full leading-[1.2em]">Crea tu propia universidad corporativa</h2>
                            <p className="text-white mt-5 mb-5 text-2xl text-left z-10 relative">Desarrolla un ecosistema de aprendizaje para potenciar el talento de tu equipo y asegurar un crecimiento sostenible. Mide su progreso y fortalece su competitividad con Top Education para Equipos.</p>
                            <a className="btn py-2 px-8 rounded-full btn-col-2 text-lg font-semibold" href="https://meetings.hubspot.com/top-education-master">Reserva una sesión informativa</a>
                        </div>
                    </div>   
                </div>
            </section>
            <section className="wrapper ">
                <div className="container m-auto pt-14 pb-14 xl:pt-7 lg:pt-7 xl:pb-20 lg:pb-10 md:pb-10">
                    <div className="flex flex-wrap">
                        <div className="lg:w-12/12 xl:w-12/12 xxl:w-12/12 w-full flex-[0_0_auto] !px-[15px] max-w-full !mx-auto !text-center">
                            <h2 className="text-white text-5xl font-normal font-[Lora] w-full italic leading-[1.2em]">Impulsa el crecimiento y la productividad</h2>
                            <p className="text-white mt-5 mb-5 text-2xl text-center z-10 relative">Organizaciones líderes han transformado su desempeño y talento humano con nuestras soluciones educativas. Con Top Education, tu empresa puede:</p>
                        </div>
                        <div className="grid  grid-cols-1 lg:grid-cols-3 gap-4 max-w-full !mx-auto mt-5">
                            <div className="card bg-white rounded-md">
                                <div className="card-body py-4 pl-1 pr-5">
                                    <div className="grid grid-cols-5 items-center">
                                        <div><img className="w-full rounded-full invert" src="/assets/iconos/TE-Engranaje.png" alt="" /></div>
                                        <div className="col-span-4"><p className="text-neutral text-[16px] leading-[1.2em]  font-semibold">Desarrollar habilidades clave para la productividad e innovación.</p></div>
                                    </div>
                                </div>
                            </div>
                            <div className="card bg-white rounded-md ">
                                <div className="card-body py-4 pl-1 pr-5">
                                    <div className="grid grid-cols-5 items-center items-center">
                                        <div><img className="w-full rounded-full invert" src="/assets/iconos/TE-Imán.png" alt="" /></div>
                                        <div className="col-span-4"><p className="text-neutral text-[16px] leading-[1.2em] font-semibold">Atraer y retener los mejores talentos con oportunidades de aprendizaje atractivas.</p></div>
                                    </div>
                                </div>
                            </div>
                            <div className="card bg-white rounded-md">
                                <div className="card-body py-4 pl-1 pr-5">
                                    <div className="grid grid-cols-5 items-center">
                                        <div><img className="w-full rounded-full invert" src="/assets/iconos/TE-Cohete.png" alt="" /></div>
                                        <div className="col-span-4"><p className="text-neutral text-[16px] leading-[1.2em] font-semibold">Capacitar a tu equipo sin necesidad de grandes inversiones en infraestructura y logística.</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a className="btn py-2 px-8 rounded-full btn-col-2 text-lg m-auto mt-5 font-semibold" href="https://meetings.hubspot.com/top-education-master">Prueba<span id="top">top</span><span id="education">.education</span> para equipos</a>
                    </div>
                </div>
            </section>
            <section className="wrapper ">
                <div className="container m-auto pb-[4.5rem] xl:pb-28 lg:pb-28 md:pb-28">
                    <div className="flex flex-wrap mx-[-15px] md:mx-[-20px] lg:mx-[-20px] xl:mx-[-35px] !mt-[-50px] items-center">
                        <div className="xl:w-5/12 lg:w-5/12 w-full flex-[0_0_auto] !px-[15px] md:!px-[20px] lg:!px-[20px] xl:!px-[35px] !mt-[50px] max-w-full">
                            <h2 className="text-white text-4xl font-normal font-[Lora] w-full"><span className="italic text-5xl">Forma a tu equipo</span> ejecutivo con</h2>
                            <img className="w-[200px] mt-5" src="/assets/banners/TE-getsmarter-edx.png" alt="" />
                        </div>
                        <div className="xl:w-7/12 lg:w-7/12 w-full flex-[0_0_auto] !px-[15px] md:!px-[20px] lg:!px-[20px] xl:!px-[35px] !mt-[50px] max-w-full">
                            <p className="text-white text-lg justify">Transforma el futuro de tu empresa con una experiencia de aprendizaje flexible y personalizada, diseñada para maximizar cada minuto de formación. Con el respaldo de instructores expertos, garantizamos resultados tangibles y aplicables a la realidad de tu negocio.
                        <br></br><b>Con GetSmarter by edX, tu equipo accederá a los conocimientos de instituciones de élite como Oxford, MIT, Harvard y Cambridge.</b></p>
                        </div>
                    </div>
                </div>
                <div className="container m-auto pt-14 xl:pt-7 lg:pt-7 pb-[3.5rem] xl:pb-10 lg:pb-10 md:pb-10">
                    <div className="flex flex-wrap">
                        <div className="lg:w-10/12 xl:w-9/12 xxl:w-8/12 w-full flex-[0_0_auto] !px-[15px] max-w-full !mx-auto !text-center">
                            
                        </div>
                        
                        <ImageSlider3D images={flagsTeams} />
                    </div>
                </div>
            </section>
            <section className="wrapper ">
                <div className="container m-auto pt-14 xl:pt-7 lg:pt-7 pb-[4.5rem] xl:pb-24 lg:pb-24 md:pb-24">
                    <div className="flex flex-wrap">
                        <div className="lg:w-11/12 xl:w-11/12 xxl:w-8/12 w-full flex-[0_0_auto] !px-[15px] max-w-full !mx-auto !text-center">
                            <h2 className="text-white text-5xl font-normal font-[Lora] w-full italic">Reserva una demostración empresarial</h2>
                            <p className="text-white text-lg justify my-8">Decenas de organizaciones ya han potenciado las habilidades de sus equipos y han visto un crecimiento significativo en sus negocios con nuestras soluciones educativas.
                            <br></br><b>Haz la prueba de Top Education para equipos y agenda una demostración personalizada ahora mismo.</b></p>
                            <a className="btn py-2 px-8 rounded-full btn-col-2 text-lg font-semibold" href="https://meetings.hubspot.com/top-education-master">Reserva una demostración empresarial</a>
                        </div>
                    </div>
                </div>
            </section>
            <section className="wrapper ">
                <div className="container m-auto pt-14 xl:pt-7 lg:pt-7 pb-[4.5rem] xl:pb-24 lg:pb-24 md:pb-24 relative">
                    <span class="w-5/15 lg:w-5/15 aspect-square bg-gradient-to-tr from-[#034694] to-[#034694] absolute z-10 top-150 lg:left-0 rounded-full skew-y-0 blur-2xl opacity-60 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
                    <div className="flex flex-wrap mx-[-15px] relative z-15">
                        <div className="lg:w-11/12 xl:w-11/12 xxl:w-8/12 w-full flex-[0_0_auto] !px-[15px] max-w-full !mx-auto !text-center">
                            <h2 className="text-white text-5xl font-normal font-[Lora] w-full">Fomenta las habilidades blandas <br></br><span className="italic"> de tu equipo</span> </h2>
                            <p className="text-white text-lg justify my-8">Más de 200 instructores reconocidos, incluyendo figuras como <b>Richard Branson, George W. Bush, Mark Cuban, Malala Yousafzai</b> y <b>James Clear</b>, comparten su conocimiento en nuestra plataforma.</p>
                        </div>
                        <div class="grid grid-cols-5 gap-4 md:grid-cols-8 max-w-4xl m-auto">
                            <div class="grid content-center gap-4">
                                <div>
                                    <img
                                        class="h-auto max-w-full rounded-lg object-cover object-center"
                                        src="/assets/banners/TE-IMG-G001.png"
                                        alt="gallery-photo"
                                    />
                                </div>
                                <div>
                                    <img
                                        class="h-auto max-w-full rounded-lg object-cover object-center "
                                        src="/assets/banners/TE-IMG-G002.png"
                                        alt="gallery-photo"
                                    />
                                </div>
                            </div>
                            <div class="grid content-center col-span-2 gap-4">
                                <div>
                                    <img
                                        class="h-auto max-w-full rounded-lg object-cover object-center"
                                        src="/assets/banners/TE-IMG-G003.png"
                                        alt="gallery-photo"
                                    />
                                </div>
                                <div>
                                    <img
                                        class="h-auto max-w-full rounded-lg object-cover object-center"
                                        src="/assets/banners/TE-IMG-G004.png"
                                        alt="gallery-photo"
                                    />
                                </div>
                            </div>
                            <div class="grid content-center col-span-2 gap-4">
                                <div>
                                    <img
                                        class="h-auto max-w-full rounded-lg object-cover object-center"
                                        src="/assets/banners/TE-IMG-G005.png"
                                        alt="gallery-photo"
                                    />
                                </div>
                                <div>
                                    <img
                                        class="h-auto max-w-full rounded-lg object-cover object-center "
                                        src="/assets/banners/TE-IMG-G006.png"
                                        alt="gallery-photo"
                                    />
                                </div>
                                <div>
                                    <img
                                        class="h-auto max-w-full rounded-lg object-cover object-center"
                                        src="/assets/banners/TE-IMG-G007.png"
                                        alt="gallery-photo"
                                    />
                                </div>
                            </div>
                            <div class="grid content-center col-span-2 gap-4">
                                <div>
                                    <img
                                        class="h-auto max-w-full rounded-lg object-cover object-center"
                                        src="/assets/banners/TE-IMG-G008.png"
                                        alt="gallery-photo"
                                    />
                                </div>
                                <div>
                                    <img
                                        class="h-auto max-w-full rounded-lg object-cover object-center"
                                        src="/assets/banners/TE-IMG-G009.png"
                                        alt="gallery-photo"
                                    />
                                </div>
                            </div>
                            <div class="grid content-center gap-4">
                                <div>
                                    <img
                                        class="h-auto max-w-full rounded-lg object-cover object-center"
                                        src="/assets/banners/TE-IMG-G010.png"
                                        alt="gallery-photo"
                                    />
                                </div>
                                <div>
                                    <img
                                        class="h-auto max-w-full rounded-lg object-cover object-center"
                                        src="/assets/banners/TE-IMG-G011.png"
                                        alt="gallery-photo"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="pt-5 xl:pt-5 lg:pt-5 pb-[4.5rem] xl:pb-5 lg:pb-5 md:pb-10">
                <div id="seventh-leader-section">
                    <h2 className="text-white text-center text-5xl font-normal font-[Lora] w-full">Trabajamos con líderes de la industria</h2>
                    <Flags direction="left" />  
                    <Flags direction="right" />          
                </div>
            </div>
            
        </>

    );

}


export default ParaEquipos;