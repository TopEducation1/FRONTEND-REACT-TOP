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
    return (
        <>
        {/**SEO ELEMENTS WITH REACT -HELMET */}
        <Helmet>
            <title>Para Equipos | Capacita a tu equipo con Top Education</title>
            <meta name="description" content="Capacita a tu equipo sin grandes inversiones. Optimiza el desarrollo profesional con soluciones educativas personalizadas. Impulsa productividad e innovación." />
            <meta property="og:title" content="Capacita a tu equipo con Top Education" />
            <meta name="author" content="Top Education" />
            <meta name="robots" content="index, follow" />
            <meta property="og:description" content="Potencia tu perfil profesional con una suscripción a Top Education. Accede a +13,000 certificaciones y recursos exclusivos para transformar tu futuro." />
            <meta property="og:type" content="website" />
        </Helmet>
        <div className="container m-auto h-screen mx-auto px-4 flex justify-center items-center gap-2 sect-h-pequ">
            <span class="w-5/15 lg:w-5/15 aspect-square bg-gradient-to-tr from-red-500 to-red-900 absolute top-30 lg:left-50 rounded-full skew-y-0 blur-2xl opacity-40 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
            <div>
                <h1 className="text-white text-9xl font-normal font-[Lora] text-left leading-36 z-10 relative">Entrena a tu equipo<br></br> <span className="italic">sin</span> grandes inversiones</h1>
                <p className="text-white mt-5 text-2xl text-left z-10 relative">Numerosas compañías invierten sumas significativas en la formación de empleados sin obtener mejoras tangibles. <span id="top">Top</span><span id="education">.Education</span> optimiza los procesos de capacitación, reduciendo costos y aumentando la eficiencia.</p>
            </div>
        </div>
        <div className="container m-auto !pb-[4.5rem] xl:!pb-24 lg:!pb-24 md:!pb-24">
            <div className="flex flex-wrap mx-[-15px] xl:mx-[-35px] lg:mx-[-20px] !mt-[-50px] items-center">
                <div className="xl:w-7/12 lg:w-7/12 w-full flex-[0_0_auto] xl:!px-[35px] lg:!px-[20px] !px-[15px] !mt-[50px] max-w-full">
                    <img className="w-full ml-[-30px]" src="/assets/banners/CAPTURA-U-TOP-ED.webp" alt="" />
                </div>
                <div className="xl:w-5/12 lg:w-5/12 w-full flex-[0_0_auto] xl:!px-[35px] lg:!px-[20px] !px-[15px] !mt-[50px] max-w-full">
                    <h2 className="text-white text-5xl font-normal font-[Lora] w-full">Crea tu propia universidad corporativa</h2>
                    <p className="text-white mt-5 mb-5 text-2xl text-left z-10 relative">Desarrolla un ecosistema de aprendizaje para potenciar el talento de tu equipo y asegurar un crecimiento sostenible. Mide su progreso y fortalece su competitividad con Top Education para Equipos.</p>
                    <a className="btn py-2 px-8 rounded-full btn-col-2 text-lg font-semibold" href="https://meetings.hubspot.com/top-education-master">Reserva sesión informativa</a>
                </div>
            </div>   
        </div>
        <div className="container m-auto pb-[4.5rem] xl:pb-28 lg:pb-28 md:pb-28">
            <div className="flex flex-wrap mx-[-15px] md:mx-[-20px] lg:mx-[-20px] xl:mx-[-35px] !mt-[-50px] items-center">
                <div className="xl:w-6/12 lg:w-6/12 w-full flex-[0_0_auto] !px-[15px] md:!px-[20px] lg:!px-[20px] xl:!px-[35px] !mt-[50px] max-w-full">
                    <h2 className="text-white text-5xl font-normal font-[Lora] w-full italic">Impulsa el crecimiento y la productividad</h2>
                    <p className="text-white mt-5 mb-5 text-2xl text-left z-10 relative">Organizaciones líderes han transformado su desempeño y talento humano con nuestras soluciones educativas. Con Top Education, tu empresa puede:</p>
                    <a className="btn py-2 px-8 rounded-full btn-col-2 text-lg font-semibold" href="https://meetings.hubspot.com/top-education-master">Prueba <span id="top">Top</span><span id="education">.Education</span> para equipos</a>
                </div>
                <div className="xl:w-6/12 lg:w-6/12 w-full flex-[0_0_auto] !px-[15px] md:!px-[20px] lg:!px-[20px] xl:!px-[35px] !mt-[50px] max-w-full">
                    <div className="card bg-white rounded-md !shadow-[0_0.25rem_1.75rem_rgba(30,34,40,0.07)] lg:!mr-6 xl:!mr-6">
                        <div className="card-body p-6">
                            <div className="flex flex-row items-center gap-8 ">
                                <div><img className="w-[150px] rounded-full border-2 border-white invert" src="/assets/iconos/TE-Engranaje.png" alt="" /></div>
                                <div><p className="text-neutral text-lg font-semibold">Desarrollar habilidades clave para la productividad e innovación.</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-white rounded-md !shadow-[0_0.25rem_1.75rem_rgba(30,34,40,0.07)] lg:!ml-16 xl:!ml-16 !mt-6">
                        <div className="card-body p-6">
                            <div className="flex flex-row items-center gap-8 ">
                                <div><img className="w-[180px] rounded-full border-2 border-white invert" src="/assets/iconos/TE-Imán.png" alt="" /></div>
                                <div><p className="text-neutral text-lg font-semibold">Atraer y retener los mejores talentos con oportunidades de aprendizaje atractivas.</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-white rounded-md !shadow-[0_0.25rem_1.75rem_rgba(30,34,40,0.07)] lg:mx-6 xl:mx-6 !mt-6">
                        <div className="card-body p-6">
                            <div className="flex flex-row items-center gap-8 ">
                                <div><img className="w-[180px] rounded-full border-2 border-white invert" src="/assets/iconos/TE-Cohete.png" alt="" /></div>
                                <div><p className="text-neutral text-lg font-semibold">Capacitar a tu equipo sin necesidad de grandes inversiones en infraestructura y logística.</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="container m-auto pt-14 xl:pt-7 lg:pt-7 pb-[3.5rem] xl:pb-10 lg:pb-10 md:pb-10">
            <div className="flex flex-wrap mx-[-15px]">
                <div className="lg:w-10/12 xl:w-9/12 xxl:w-8/12 w-full flex-[0_0_auto] !px-[15px] max-w-full !mx-auto !text-center">
                    <h2 className="text-white text-5xl font-normal font-[Lora] w-full">Forma a tu equipo ejecutivo con</h2>
                    <img className="w-[280px] m-auto mt-5" src="/assets/banners/TE-getsmarter-edx.png" alt="" />
                </div>
                <p className="text-white text-lg justify">Transforma el futuro de tu empresa con una experiencia de aprendizaje flexible y personalizada, diseñada para maximizar cada minuto de formación. Con el respaldo de instructores expertos, garantizamos resultados tangibles y aplicables a la realidad de tu negocio.
                <br></br><b>Con GetSmarter by edX, tu equipo accederá a los conocimientos de instituciones de élite como Oxford, MIT, Harvard y Cambridge.</b></p>
                <ImageSlider3D images={flagsTeams} />
            </div>
        </div>
        <div className="container m-auto pt-14 xl:pt-7 lg:pt-7 pb-[4.5rem] xl:pb-24 lg:pb-24 md:pb-24">
            <div className="flex flex-wrap mx-[-15px]">
                <div className="lg:w-11/12 xl:w-11/12 xxl:w-8/12 w-full flex-[0_0_auto] !px-[15px] max-w-full !mx-auto !text-center">
                    <h2 className="text-white text-5xl font-normal font-[Lora] w-full italic">Reserva una demostración empresarial</h2>
                    <p className="text-white text-lg justify my-8">Decenas de organizaciones ya han potenciado las habilidades de sus equipos y han visto un crecimiento significativo en sus negocios con nuestras soluciones educativas.
                    <br></br><b>Haz la prueba de Top Education para equipos y agenda una demostración personalizada ahora mismo.</b></p>
                    <a className="btn py-2 px-8 rounded-full btn-col-2 text-lg font-semibold" href="https://meetings.hubspot.com/top-education-master">Reserva una demostración empresarial</a>
                </div>
            </div>
        </div>
        <div className="container m-auto pt-14 xl:pt-7 lg:pt-7 pb-[4.5rem] xl:pb-24 lg:pb-24 md:pb-24 relative">
            <span class="w-5/15 lg:w-5/15 aspect-square bg-gradient-to-tr from-[#034694] to-[#034694] absolute z-10 top-150 lg:left-0 rounded-full skew-y-0 blur-2xl opacity-60 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
            <div className="flex flex-wrap mx-[-15px] relative z-15">
                <div className="lg:w-11/12 xl:w-11/12 xxl:w-8/12 w-full flex-[0_0_auto] !px-[15px] max-w-full !mx-auto !text-center">
                    <h2 className="text-white text-5xl font-normal font-[Lora] w-full">Fomenta las habilidades blandas <br></br><span className="italic"> de tu equipo</span> </h2>
                    <p className="text-white text-lg justify my-8">Más de 200 instructores reconocidos, incluyendo figuras como <b>Richard Branson, George W. Bush, Mark Cuban, Malala Yousafzai</b> y <b>James Clear</b>, comparten su conocimiento en nuestra plataforma.</p>
                </div>
                <div class="grid grid-cols-2 gap-4 md:grid-cols-8 max-w-4xl m-auto">
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
        
        {/*<div>
            <div id="wrapper-team-title"><h2>Entrena a tu equipo de trabajo <em style={{color: "#5CC781"}}>sin realizar grandes inversiones</em> en infraestructura o logística.</h2></div>
                <img className="ellipse parallax ellipse-1" src="/assets/Piezas/ellipse-1-para-equipos.png" alt="ellipse" />
                <img className="ellipse parallax ellipse-2" src="/assets/Piezas/ellipse-2-para-equipos.png" alt="ellipse" />
            </div>
            <div id="second-team-title">
                    <h2>Numerosas compañias invierten grandes sumas de dinero en la formación de empleados <span>sin ver mejoras significativas</span></h2>
            </div>
            <div id="blue-section-team">
                <div id="left-image-blue-team">
                    <img src="/assets/Piezas/red-flag.png" alt="red-flag" />
                </div>
                <div id="right-text-blue-team">
                    <h2>
                        <span><strong 
                        >Top Education </strong>optimiza los procesos de</span>
                        <span>capacitación, reduciendo costos y</span>
                        <span>aumentando la eficiencia.</span>
                    </h2>
                </div>
            </div>
            <div id="second-team-page">
                <div id="left-wrapper-second">
                    <p style={{color: "#034694"}}>Con nuestra ayuda, podrás crear una universidad corporativa</p>
                    <p className="second-p-second">Que te permitirá alcanzar los objetivos de desarrollo profesional y potenciar el talento de tu equipo, garantizando asi un crecimiento sostenible y una mayor competitividad en el mercado</p>
                </div>
                <div id="right-wrapper-second">
                    <img src="/assets/Piezas/pieza-teams.png" alt="" />
                </div>
            </div>
            <div id="third-info-section">
                <h2 style={{color: "#5CC781"}}><strong>Organizaciones líderes </strong><em>han transformado su desempeño y talento humano<strong> con nuestras soluciones educativas.</strong></em></h2>
                <p><strong><em>Con Top Education, tu organización puede desarrollar las habilidades de sus empleados para aumentar la productividad e innovación, </em></strong> además de atraer y retener los mejores talentos mediante oportunidades de aprendizaje atractivas.</p>
                <p>Podrás capacitar a tu equipo sin necesidad de realizar grandes inversiones en infraestructura y logística.</p>
                <p><em style={{
                    color: "#5CC781"
                }}>Nuestras soluciones han ayudado a empresas de todo el mundo a alcanzar nuevos niveles de éxito y crecimiento.</em> Invierte en el futuro de tu organización con Top Education.</p>
                <div id="wrapper-button-reserva-first">
                    <a href="https://meetings.hubspot.com/top-education-master">
                    <button id="button-reserva">Reserva una demostración empresarial</button>
                    </a>
                </div>
            </div>
            <div id="fourth-train-section">
                <div id="upper-train-section">
                <h2>Entrena a tu equipo directivo con <span>GetSmarter with edX</span></h2>
                </div>
                <div id="mid-train-section">
                    <div id="left-train">
                        <p>Transforma el futuro de tu empresa con una experiencia de aprendizaje personalizada y flexible, diseñada para maximizar cada minuto de formación.</p>

                        <p>Con el respaldo de maestros expertos, garantizamos resultados que aportarán valor real a tu organización</p>

                        <p>Con GetSmarter by edX, tu equipo accederá a los conocimientos de instituciones de élite como Oxford, MIT, Harvard y Cambridge.</p>

                        <p>Imagina líderes mejor preparados, con conexiones globales que llevarán tu empresa a nuevas alturas.</p>
                    </div>
                    <div id="right-train">
                        <img src="/assets/Piezas/conjunto-universidades.png"/>
                    </div>
                </div>
                <div id="lower-train-section">
                    <span style={{
                        color: "#5CC780"
                    }}><em>Agenda hoy una demostración y descubre cómo GetSmarter by edX será el impulso que tu equipo necesita para alcanzar el exito</em></span>
                </div>
                <div id="wrapper-button-reserva-getsmarter">
                    <a href="https://meetings.hubspot.com/top-education-master">
                    <button id="button-reserva">Reserva una demostración empresarial</button>
                    </a>
                </div>
            </div>
            <div id="fifth-trial-section">
                <div id="left-trial">
                    <img src="/assets/Piezas/pieza-trial.png"/>
                </div>
                <div id="right-trial">
                    <p>Decenas de organizaciones ya han potenciado las habilidades de sus equipos y han visto un crecimiento significativo en sus negocios con nuestras soluciones educativas.
                    </p>
                </div>
            </div>
            <div id="green-section-for-teams">
                <div id="left-wrapper-green-section">
                    <p>Haz la prueba de Top Education para equipos y agenda una demostración  personalizada ahora mismo.</p>
                    <a href="https://meetings.hubspot.com/top-education-master">
                        <button id="button-alternative-reserve">Reserva una demostración</button>
                    </a>
                </div>
                <img src="/assets/Piezas/frame-green-part.png" alt="frame" />
            </div>
            <div id="sixth-masterclass-section">
                <p><em>Más de 200 instructores reconocidos, incluyendo figuras como<strong> Richard Branson, George W. Bush, Mark Cuban, Malala Yousafzai y James Clear, </strong>comparten su conocimiento en nuestra plataforma.</em></p>

                <p>Fomenta las habilidades blandas de tu equipo con las certificaciones de Top Education, con clases impartidas por líderes de renombre en sus respectivos campos. Asegura el crecimiento laboral y personal de tu equipo con el respaldo de los mejores expertos.</p>
                <h2 style={{
                    color: "#5CC781"
                }}><em>¡Empieza hoy y lleva a tu organización al siguiente nivel con Top Education!</em></h2>
                <div id="wrapper-button-reserva-masterclass">
                    <a href="https://meetings.hubspot.com/top-education-master">
                        <button id="button-reserva-masterclass">Reserva una demostración empresarial</button>
                    </a>
                </div>
            </div>
            */}
            <div className="pt-5 xl:pt-5 lg:pt-5 pb-[4.5rem] xl:pb-5 lg:pb-5 md:pb-10">
                <div id="seventh-leader-section">
                    <h2 className="text-white text-center text-5xl font-normal font-[Lora] w-full">Colaboramos con los líderes de la industria</h2>
                    <Flags direction="left" />  
                    <Flags direction="right" />          
                </div>
            </div>
            
        </>

    );

}


export default ParaEquipos;