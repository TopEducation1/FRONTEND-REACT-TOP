import React, { useEffect } from "react";
import BlogSearchBar from "../components/BlogSearchBar";
import BlogsGrid from "../components/BlogsGrid";
import { Helmet } from "react-helmet";

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
            <section className="wrapper h-[90vh] w-full flex justify-center items-center bg-gradient-to-t from-neutral-800 to-transparent">
                <div className="container m-auto mx-auto gap-2  sect-h-pequ">
                    <div>
                        <h1 className="text-white text-7xl font-normal font-[Lora] text-left leading-[1em] z-10 relative sm:text-7xl md:text-7xl lg:text-7xl xl:text-9xl">Editorial<br></br> <span id="top" className="italic">top</span><span id="education" className="italic">.education</span></h1>
                        <p className="text-white mt-5 text-2xl text-left z-10 relative">Descarga gratis nuestros recursos exclusivos. Encuentra la información que necesitas para alcanzar tus metas educativas, personales y profesionales. Te ofrecemos herramientas poderosas para enriquecer tu vida y potenciar tu crecimiento.</p>
                    </div>
                </div>
            </section>
            <section className="wrapper">
                <div className="container m-auto">
                    <div className="flex py-20">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-[-130px] sm:mt-[-150px] lg:mt-[-180px]">
                            <a className="border-1 border-white rounded-xl" href="https://info.top.education/es-mx/como-encontrar-trabajo-con-poca-experiencia" target="_blank" rel="noopener noreferrer" >
                                <img className="rounded-xl"
                                    src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/c2013e1d-caf8-4923-a748-cc1486259df2/Guia+Como+encontrar+trabajo+con+poca+experiencia.png?format=300w"
                                    alt="Guía: Cómo encontrar trabajo con poca experiencia"
                                />
                            </a>
                            <a className="flex border-1 border-white rounded-xl" href="https://info.top.education/ebook-construye-tu-marca-personal-con-%C3%A9xito" target="_blank" rel="noopener noreferrer" >
                                <img className="rounded-xl"
                                    src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/500ef00b-9648-4713-8ee4-d242416969c8/eBook+Construye+tu+marca+personal+con+exito.png?format=300w"
                                    alt="eBook: Construye tu marca personal con éxito"
                                />
                            </a>
                            <a className="flex border-1 border-white rounded-xl" href="https://info.top.education/ebook-crea-tu-ruta-de-aprendizaje-virtual-personalizada" target="_blank" rel="noopener noreferrer">
                                <img className="rounded-xl"
                                    src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/d57b30ad-b920-450a-b076-849d8724878b/eBook+Crea+tu+ruta+de+aprendizaje+virtual+personalizada.png?format=300w"
                                    alt="eBook: Crea tu ruta de aprendizaje virtual personalizada"
                                />
                            </a>
                            <a className="flex border-1 border-white rounded-xl" href="https://info.top.education/estrategias-para-aprender-online" target="_blank" rel="noopener noreferrer" >
                                <img className="rounded-xl"
                                    src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/ce4f1a0f-edaf-406f-9aec-3341a0685fb1/eBook+Estrategias+para+aprender+online.png?format=300w"
                                    alt="eBook: Estrategias para aprender online"
                                />
                            </a>
                            <a className="flex border-1 border-white rounded-xl" href="https://info.top.education/capacitaci%C3%B3n-empresarial-del-futuro-e-learning-para-el-desarrollo-empresarial" target="_blank" rel="noopener noreferrer" >
                                <img className="rounded-xl"
                                    src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/aed11f9d-1ff5-4fa1-8993-40d1e9ef0a55/Whitepaper+-+Capacitacio%CC%81n+empresarial+del+futuro+elearning+para+el+desarrollo+profesional.png?content-type=image%2Fpng"
                                    alt="Paper: Capacitación empresarial del futuro"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section className="wrapper">
                <div className="container m-auto">
                    <h2 className="text-white text-7xl font-normal font-[Lora] italic text-left leading-16 z-10 relative">Explora y aprende</h2>
                    <p className="text-white mt-5 text-2xl text-left mb-8 z-10 relative">Amplía tus conocimientos con contenido de calidad seleccionado por expertos. Descubre nuevas habilidades, profundiza en temas de tu interés y accede a recursos educativos que te acercan a tus objetivos.</p>
                    <BlogsGrid/>
                </div>
            </section>
            <section className="wrapper">
                <div className="container m-auto pb-[4.5rem] xl:pb-28 lg:pb-28 md:pb-28 relative">
                    <span class="w-5/15 lg:w-5/15 aspect-square bg-gradient-to-tr from-green-500 to-green-900 absolute top-10 lg:left-0 rounded-full skew-y-0 blur-2xl opacity-40 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
                    <div className="flex flex-wrap items-center">
                        <div className="xl:w-6/12 lg:w-6/12 w-full flex-[0_0_auto] !px-[15px] md:!px-[20px] lg:!px-[20px] xl:!px-[35px] !mt-[50px] max-w-full">
                            <h2 className="text-white text-5xl font-normal font-[Lora] w-full italic relative">Entérate de todas las novedades</h2>
                            <p className="text-white mt-5 mb-5 text-2xl text-left z-10 relative">¡Únete a nuestra comunidad suscribiéndote a nuestro boletín informativo!</p>
                        </div>
                        <div className="xl:w-6/12 lg:w-6/12 w-full flex-[0_0_auto] !px-[15px] md:!px-[20px] lg:!px-[20px] xl:!px-[35px] !mt-[50px] max-w-full">
                            <h3>¡Suscríbete ahora!</h3>
                            <div class="newsletter-form-block" id="wrapper-form">
                                <form>
                                    <label for="name">Nombre</label>
                                    <input type="name" required="true"></input>
                                    
                                    <label for="email">Correo</label>
                                    <input type="email" required="true"></input>
                                </form>
                            </div>
                            <div class="newsletter-form-block" id="wrapper-button">
                                <button>Subscribirme</button>
                            </div>
                            <div class="newsletter-form-block" id="wrapper-terms">
                                <p><em>*Haciendo clic en “Suscríbete” aceptas la política de privacidad de Top Education y consientes que trate tus datos de contacto con el objetivo de gestionar la newsletter.</em></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default BlogPage;
