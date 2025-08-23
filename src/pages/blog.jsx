import { useEffect, useRef } from 'react'
import BlogsGrid from "../components/BlogsGrid";
import { Helmet } from "react-helmet";
import HubspotForm from "../components/HubspotForm";

function BlogPage() {
    useEffect(() => {
        window.scrollTo(0,0);
    }, []);
    
    return (
        <>
            {/**SEO ELEMENTS WITH REACT -HELMET */}
            <Helmet>
                <title>Recursos | Top.education</title>
                <meta name="description" content="Descubre ebooks y blogs exclusivos de Top.education. Accede a contenido valioso para potenciar tu conocimiento y alcanzar tus metas personales y profesionales." />
                <meta property="og:title" content="Top Education | Aprende con edX, Coursera y MasterClass" />
                <meta name="author" content="Top Education" />
                <meta name="robots" content="index, follow" />
                <meta property="og:description" content="Descubre ebooks y blogs exclusivos de Top Education. Accede a contenido valioso para potenciar tu conocimiento y alcanzar tus metas personales y profesionales." />
                <meta property="og:type" content="website" />
            </Helmet>
            <section className="wrapper h-[90vh] w-full flex justify-center items-center bg-gradient-to-t from-transparent to-neutral-800">
                <div className="container m-auto mx-auto gap-2  sect-h-pequ">
                    <div className='m-auto max-w-[100vw] lg:max-w-[50vw]'>
                        <h1 className="text-[#F6F4EF] text-7xl font-normal font-[Lora] text-center leading-[1em] z-10 relative sm:text-6xl md:text-6xl lg:text-6xl xl:text-8xl"><span className='top-italic'>Editorial</span><br></br> <span id="top">top</span><span id="education" >.education</span></h1>
                        <p className="mt-5 text-[1.125rem] text-[#a8a8a8] text-center z-10 relative">Descarga gratis nuestros recursos exclusivos. Encuentra la información que necesitas para alcanzar tus metas educativas, personales y profesionales. Te ofrecemos herramientas poderosas para enriquecer tu vida y potenciar tu crecimiento.</p>
                    </div>
                </div>
            </section>
            <section className="wrapper">
                <div className="container m-auto">
                    <div className="flex py-20">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-[-130px] sm:mt-[-150px] lg:mt-[-180px]">
                            <a className="border-1 border-white rounded-[18px]" href="https://info.top.education/es-mx/como-encontrar-trabajo-con-poca-experiencia" target="_blank" rel="noopener noreferrer" >
                                <img 
                                    src="/assets/content/resources/Guia-Como-encontrar trabajo-con-poca-experiencia.webp"
                                    alt="Guía: Cómo encontrar trabajo con poca experiencia"
                                />
                            </a>
                            <a className="flex border-1 border-white rounded-[18px]" href="https://info.top.education/ebook-construye-tu-marca-personal-con-%C3%A9xito" target="_blank" rel="noopener noreferrer" >
                                <img 
                                    src="/assets/content/resources/eBook-Construye-tu-marca-personal-con-exito.webp"
                                    alt="eBook: Construye tu marca personal con éxito"
                                />
                            </a>
                            <a className="flex border-1 border-white rounded-[18px]" href="https://info.top.education/ebook-crea-tu-ruta-de-aprendizaje-virtual-personalizada" target="_blank" rel="noopener noreferrer">
                                <img 
                                    src="/assets/content/resources/eBook-Crea-tu-ruta-de-aprendizaje-virtual-personalizada.webp"
                                    alt="eBook: Crea tu ruta de aprendizaje virtual personalizada"
                                />
                            </a>
                            <a className="flex border-1 border-white rounded-[18px]" href="https://info.top.education/estrategias-para-aprender-online" target="_blank" rel="noopener noreferrer" >
                                <img 
                                    src="/assets/content/resources/eBook-Estrategias-para-aprender-online.webp"
                                    alt="eBook: Estrategias para aprender online"
                                />
                            </a>
                            <a className="flex border-1 border-white rounded-[18px]" href="https://info.top.education/capacitaci%C3%B3n-empresarial-del-futuro-e-learning-para-el-desarrollo-empresarial" target="_blank" rel="noopener noreferrer" >
                                <img 
                                    src="/assets/content/resources/eBook-Capacitacion-empresarial-del futuro.webp"
                                    alt="Paper: Capacitación empresarial del futuro"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section className="wrapper">
                <div className="container m-auto">
                    <h2 className="text-[#F6F4EF] text-7xl top-italic font-normal font-[Lora] text-center leading-[1.2em] z-10 relative">Explora y aprende</h2>
                    <p className="text-[1.125rem] text-[#a8a8a8] mt-5 text-center mb-8 z-10 relative">Amplía tus conocimientos con contenido de calidad seleccionado por expertos. Descubre nuevas habilidades, profundiza en temas de tu interés y accede a recursos educativos que te acercan a tus objetivos.</p>
                    <BlogsGrid category="Desarrollo personal, Desarrollo profesional, Top education originals" />

                </div>
            </section>
            <section className="wrapper">
                <div className="container m-auto pb-[4.5rem] xl:pb-28 lg:pb-28 md:pb-28 relative">
                    <span class="w-5/15 lg:w-5/15 aspect-square bg-gradient-to-tr from-green-500 to-green-900 absolute top-10 lg:left-0 rounded-full skew-y-0 blur-2xl opacity-40 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
                    <div className="flex flex-wrap items-center">
                        <div className="xl:w-6/12 lg:w-6/12 w-full flex-[0_0_auto] !px-[15px] md:!px-[20px] lg:!px-[20px] xl:!px-[35px] !mt-[50px] max-w-full">
                            <h2 className="text-[#F6F4EF] text-[4rem] leading-[1em] font-normal font-[Lora] w-full top-italic relative"><span className='text-[6rem]'>Entérate</span><br></br> de todas las novedades</h2>
                            <p className="mt-5 mb-5 text-[1.125rem] text-[#a8a8a8] text-left z-10 relative">¡Únete a nuestra comunidad suscribiéndote a nuestro boletín informativo!</p>
                        </div>
                        <div className="xl:w-6/12 lg:w-6/12 w-full flex-[0_0_auto] !px-[15px] md:!px-[20px] lg:!px-[20px] xl:!px-[35px] !mt-[50px] max-w-full">
                            <h3>¡Suscríbete ahora!</h3>
                            {/*<HubspotForm />*/}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default BlogPage;
