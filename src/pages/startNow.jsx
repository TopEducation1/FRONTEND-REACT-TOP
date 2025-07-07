import React, {  useEffect } from "react";
import { Helmet } from "react-helmet";


function StartNow() {
    useEffect(() => {
        window.scrollTo(0,0);
        
    }, []);
    return (
        <>
            {/**SEO ELEMENTS WITH REACT -HELMET */}
            <Helmet>
                <title>Empieza Ahora | Top Education</title>
                <meta name="description" content="Potencia tu perfil profesional con una suscripción a Top Education. Accede a +13,000 certificaciones y recursos exclusivos para transformar tu futuro." />
                <meta property="og:title" content="Empieza Ahora" />
                <meta name="author" content="Top Education" />
                <meta name="robots" content="index, follow" />
                <meta property="og:description" content="Potencia tu perfil profesional con una suscripción a Top Education. Accede a +13,000 certificaciones y recursos exclusivos para transformar tu futuro." />
                <meta property="og:type" content="website" />
            </Helmet>
            <section className="wrapper ">
                <div className="container m-auto h-screen mx-auto px-4 flex justify-center items-center gap-2 sect-h-pequ">
                    <span class="w-5/15 lg:w-5/15 aspect-square bg-gradient-to-tr from-green-500 to-green-900 absolute top-30 lg:left-50 rounded-full skew-y-0 blur-2xl opacity-40 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
                    <div>
                        <h1 className="text-white text-6xl font-normal font-[Lora] text-left leading-[1.4em] z-10 relative sm:text-5xl md:text-6xl lg:text-7xl">Desarrolla todo tu <br></br><span className="text-[120px] italic sm:text-[150px]">potencial</span></h1>
                        <p className="text-white mt-5 text-2xl text-left z-10 relative">En un mundo laboral altamente competitivo, <span id="top">top</span><span id="education">.education</span> te ofrece acceso a contenido de alto nivel para que desarrolles nuevas habilidades y avances en tu trayectoria profesional. Aprende con expertos de talla mundial y obtén certificaciones reconocidas internacionalmente. </p>
                    </div>
                </div>
            </section>
            <section className="wrapper ">
                <div className="container m-auto py-[1rem] xl:!py-10 lg:!py-6 md:!py-3">
                    <div className="flex flex-wrap mx-[-15px] xl:mx-[-35px] lg:mx-[-20px] !mt-[-30px] !mb-[4.5rem] items-center">
                        <div className="xl:w-5/12 lg:w-5/12 w-full flex-[0_0_auto] xl:!px-[35px] lg:!px-[20px] !px-[15px] !mt-[25px] max-w-full">
                            <h2 className="text-white text-[45px] leading-12 font-normal font-[Lora] w-full">¿Por que <span id="top" className="italic">top</span><span id="education" className="italic">.education</span> es la mejor opción de educación en linea?</h2>
                            <p className="text-white mt-5 mb-5 text-[1.2rem] text-left z-10 relative">Top Education te ofrece uno de los catálogos de formación online mas grandes en el mercado: más de 13,000 certificaciones en diversas disciplinas, junto con acceso exclusivo a los contenidos de Masterclass, Coursera y edX, todo por un precio que supera significativamente el valor de cada plataforma por separado.</p>
                        </div>
                        <div className="xl:w-7/12 lg:w-7/12 w-full flex-[0_0_auto] xl:!px-[35px] lg:!px-[20px] !px-[15px]  max-w-full !relative">
                            <div className="pricing-wrapper !relative">
                                <div className="flex flex-wrap justify-center mx-[-15px] !mt-3 xl:!mt-5 lg:!mt-5 md:!mt-5">
                                    <div className="sm:w-6/12 lg:w-6/12 xl:w-7/12 w-full p-[15px] flex-[0_0_auto] !px-[15px] max-w-full">
                                        <div className="pricing card !text-center rounded-lg bg-neutral-900  p-[15px] !shadow-[0_0.25rem_1.75rem_rgba(30,34,40,0.07)]">
                                            <div className="card-body flex-[1_1_auto]  pb-4 xl:!p-[1rem_1.5rem_1.5rem] lg:!p-[1rem_1.5rem_1.5rem] md:!p-[1rem_1.5rem_1.25rem]">
                                                <img src="/assets/logos/logo-top-education.png" className="w-90" alt="" />
                                                <div class="prices !text-[#5CC781] flex w-full justify-center">
                                                    <div class="price price-hide price-hidden flex items-stretch">
                                                        <span class="price-currency self-start text-1xl md:text-2xl">PAGO ÚNICO $</span>
                                                        <span class="price-value text-5xl self-end">297</span>
                                                        <span class="price-duration self-end">USD /Anual</span></div>
                                                </div>
                                                <ul class="!pl-0 pt-5 list-none flex items-center bullet-bg bullet-soft-primary">
                                                    <li class="relative">
                                                        <img src="/assets/platforms/icons/icon-coursera.png" className="w-30" alt="" />
                                                    </li>
                                                    <li class="relative px-2"><span className="text-white text-3xl text-center">+</span></li>
                                                    <li class="relative">
                                                        <img src="/assets/platforms/icons/icon-edx.png" className="w-30" alt="" />
                                                    </li>
                                                    <li class="relative px-2"><span className="text-white text-3xl text-center">+</span></li>
                                                    <li class="relative">
                                                        <img src="/assets/platforms/icons/icon-masterclass.png" className="w-30" alt="" />
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:w-6/12 lg:w-6/12 xl:w-5/12 w-full p-[15px] flex-[0_0_auto] !px-[15px] max-w-full">
                                        <div className="pricing card !text-left rounded-lg bg-neutral-900 p-[15px] !shadow-[0_0.25rem_1.75rem_rgba(30,34,40,0.07)]">
                                            <div className="card-body flex-[1_1_auto]  xl:!p-[1rem_1.5rem_1.5rem] lg:!p-[1rem_1.5rem_1.5rem] md:!p-[1rem_1.5rem_1.25rem]">
                                                <h3 className="card-title text-white text-5xl md:text-5xl lg:text-4xl">Plataformas</h3>
                                                <h3 className="card-title text-white text-4xl md:text-3xl lg:text-2xl">por separado</h3>
                                                <ul class="pl-0 list-none bullet-bg bullet-soft-primary mt-4 text-left text-white">
                                                    <li class="relative text-justify">
                                                        <span className="text-justify flex w-full">MasterClass ........ USD 180</span>
                                                    </li>
                                                    <li class="relative text-justify">
                                                        <span className="text-justify flex w-full">Coursera Plus...... USD 399</span>
                                                    </li>
                                                    <li class="relative text-justify">
                                                        <span className="text-justify flex w-full">edX.......................... USD 394</span>
                                                    </li>
                                                </ul>
                                                <div class="prices !text-[#D33B3E] flex w-full justify-center">
                                                    <div class="price price-hide price-hidden flex items-stretch mt-1">
                                                        <span class="price-currency self-start text-[12px]">PAGO TOTAL $</span>
                                                        <span class="price-value text-3xl self-end">928</span>
                                                        <span class="price-duration self-end ml-1"> USD /Anual</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="wrapper">
                <div className="container m-auto pt-[1rem] pb-50 xl:pt-10 lg:pt-10 md:pt-28 xl:pb-60 lg:pb-60 md:pb-60 !text-center">
                    <div className="flex flex-wrap mx-[-15px]">
                        <div className="lg:w-10/12 xl:w-9/12 xxl:w-8/12 w-full flex-[0_0_auto] !px-[15px] max-w-full !mx-auto">
                            <h3 className="!text-[calc(2rem_+_0.66vw)] text-white font-bold xl:!text-[2.8rem] !leading-[1.3] !mb-[1rem] xl:!mb-6 lg:!mb-6 md:!mb-6 lg:!px-10 xl:!px-10">¿Por que Top Education es la mejor opción de educación en linea?</h3>
                            <p className="text-white">Top Education te ofrece uno de los catálogos de formación online mas grandes en el mercado: más de 13,000 certificaciones en diversas disciplinas, junto con acceso exclusivo a los contenidos de Masterclass, Coursera y edX, todo por un precio que supera significativamente el valor de cada plataforma por separado.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="wrapper !bg-[#034694]">
                <div className="container m-auto py-[4.5rem] xl:!py-24 lg:!py-24 md:!py-24">
                    <div className="pricing-wrapper !relative !mt-[-15rem] xl:!mt-[-20rem] lg:!mt-[-20rem] md:!mt-[-20rem]">
                        <div className="flex flex-wrap justify-center mx-[-15px] !mt-3 xl:!mt-5 lg:!mt-5 md:!mt-5">
                            <div className="md:w-6/12 lg:w-5/12 xl:w-5/12 w-full flex-[0_0_auto] !px-[15px] max-w-full !mt-[30px]">
                                <div className="pricing card !text-center mt-[-1.5rem] rounded-lg p-[20px_25px] bg-white !shadow-[0_0.25rem_1.75rem_rgba(30,34,40,0.07)]">
                                    <div className="card-body flex-[1_1_auto]  pb-4 xl:!p-[2rem_2.5rem_2    .5rem] lg:!p-[2rem_2.5rem_2.5rem] md:!p-[2rem_2.5rem_1.25rem]">
                                        <h3 className="card-title text-5xl">Plan anual</h3>
                                        <div class="prices !text-[#343f52] flex w-full justify-center">
                                            <div class="price price-hide price-hidden flex items-stretch">
                                                <span class="price-currency self-start">USD $</span>
                                                <span class="price-value text-5xl self-end">399</span>
                                                <span class="price-duration self-end">/Año</span></div>
                                        </div>
                                        <ul class="pl-0 list-none bullet-bg bullet-soft-primary !mt-7 !mb-8 text-left">
                                            <li class="relative !pl-6">
                                                <i class="absolute left-0 w-4 h-4 text-[0.8rem] leading-none !tracking-[normal] !text-center flex items-center justify-center bg-[#dce7f9] !text-[#3f78e0] rounded-[100%] top-[0.2rem] ">✓</i>
                                                <span>Acceso a todas las certificaciones</span>
                                            </li>
                                            <li class="relative !pl-6 !mt-[0.35rem]">
                                                <i class="absolute left-0 w-4 h-4 text-[0.8rem] leading-none !tracking-[normal] !text-center flex items-center justify-center bg-[#dce7f9] !text-[#3f78e0] rounded-[100%] top-[0.2rem] ">✓</i>
                                                <span>Obtén un certificado respaldado por tecnología blockchain </span>
                                            </li>
                                            <li class="relative !pl-6 !mt-[0.35rem]">
                                                <i class="absolute left-0 w-4 h-4 text-[0.8rem] leading-none !tracking-[normal] !text-center flex items-center justify-center bg-[#dce7f9] !text-[#3f78e0] rounded-[100%] top-[0.2rem] ">✓</i>
                                                <span>Accede a contenido de Coursera, edX y MasterClass</span>
                                            </li>
                                            <li class="relative !pl-6 !mt-[0.35rem]">
                                                <i class="absolute left-0 w-4 h-4 text-[0.8rem] leading-none !tracking-[normal] !text-center flex items-center justify-center bg-[#dce7f9] !text-[#3f78e0] rounded-[100%] top-[0.2rem] ">✓</i>
                                                <span>Contenido actualizado</span>
                                            </li>
                                            <li class="relative !pl-6 !mt-[0.35rem]">
                                                <i class="absolute left-0 w-4 h-4 text-[0.8rem] leading-none !tracking-[normal] !text-center flex items-center justify-center bg-[#dce7f9] !text-[#3f78e0] rounded-[100%] top-[0.2rem] ">✓</i>
                                                <span>Cancela tu membresía cuando quieras</span>
                                            </li>
                                            <li class="relative !pl-6 !mt-[0.35rem]">
                                                <i class="absolute left-0 w-4 h-4 text-[0.8rem] leading-none !tracking-[normal] !text-center flex items-center justify-center bg-[#dce7f9] !text-[#3f78e0] rounded-[100%] top-[0.2rem] ">✓</i>
                                                <span>Acceso a más de 15,000 certificaciones</span>
                                            </li>
                                        </ul>
                                        <div className="w-full text-center pb-5">
                                            <span class="tag-currency text-2xl">Ahorra $309 USD</span>
                                        </div>                                        
                                        <a href="#" class="btn btn py-2 px-8 rounded-full btn-col-1 text-lg font-semibold !text-white hover:text-white hover:bg-[#3f78e0] hover:!border-[#3f78e0]  active:text-white active:bg-[#3f78e0] active:border-[#3f78e0] disabled:text-white disabled:bg-[#3f78e0] disabled:border-[#3f78e0] hover:translate-y-[-0.15rem] hover:shadow-[0_0.25rem_0.75rem_rgba(30,34,40,0.15)]">Empezar ahora</a>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-6/12 lg:w-5/12 xl:w-5/12 w-full flex-[0_0_auto] !px-[15px] max-w-full !mt-[30px]">
                                <div className="pricing card !text-center rounded-lg bg-white p-[20px_25px] !shadow-[0_0.25rem_1.75rem_rgba(30,34,40,0.07)]">
                                    <div className="card-body flex-[1_1_auto]  pb-8 xl:!p-[2rem_2.5rem_2.5rem] lg:!p-[2rem_2.5rem_2.5rem] md:!p-[2rem_2.5rem_1.25rem]">
                                        <h3 className="card-title text-5xl">Plan mensual</h3>
                                        <div class="prices !text-[#343f52] flex w-full justify-center">
                                            <div class="price price-hide price-hidden flex items-stretch">
                                                <span class="price-currency self-start">USD $</span>
                                                <span class="price-value text-5xl self-end">59</span>
                                                <span class="price-duration self-end">/Mes</span></div>
                                        </div>
                                        <ul class="pl-0 list-none bullet-bg bullet-soft-primary !mt-7 !mb-8 text-left">
                                            <li class="relative !pl-6">
                                                <i class="absolute left-0 w-4 h-4 text-[0.8rem] leading-none !tracking-[normal] !text-center flex items-center justify-center bg-[#dce7f9] !text-[#3f78e0] rounded-[100%] top-[0.2rem] ">✓</i>
                                                <span>Acceso a todas las certificaciones</span>
                                            </li>
                                            <li class="relative !pl-6 !mt-[0.35rem]">
                                                <i class="absolute left-0 w-4 h-4 text-[0.8rem] leading-none !tracking-[normal] !text-center flex items-center justify-center bg-[#dce7f9] !text-[#3f78e0] rounded-[100%] top-[0.2rem] ">✓</i>
                                                <span>Obtén un certificado respaldado por tecnología blockchain </span>
                                            </li>
                                            <li class="relative !pl-6 !mt-[0.35rem]">
                                                <i class="absolute left-0 w-4 h-4 text-[0.8rem] leading-none !tracking-[normal] !text-center flex items-center justify-center bg-[#dce7f9] !text-[#3f78e0] rounded-[100%] top-[0.2rem] ">✓</i>
                                                <span>Accede a contenido de Coursera, edX y MasterClass</span>
                                            </li>
                                            <li class="relative !pl-6 !mt-[0.35rem]">
                                                <i class="absolute left-0 w-4 h-4 text-[0.8rem] leading-none !tracking-[normal] !text-center flex items-center justify-center bg-[#dce7f9] !text-[#3f78e0] rounded-[100%] top-[0.2rem] ">✓</i>
                                                <span>Contenido actualizado</span>
                                            </li>
                                            <li class="relative !pl-6 !mt-[0.35rem]">
                                                <i class="absolute left-0 w-4 h-4 text-[0.8rem] leading-none !tracking-[normal] !text-center flex items-center justify-center bg-[#dce7f9] !text-[#3f78e0] rounded-[100%] top-[0.2rem] ">✓</i>
                                                <span>Cancela tu membresía cuando quieras</span>
                                            </li>
                                            <li class="relative !pl-6 !mt-[0.35rem]">
                                                <i class="absolute left-0 w-4 h-4 text-[0.8rem] leading-none !tracking-[normal] !text-center flex items-center justify-center bg-[#dce7f9] !text-[#3f78e0] rounded-[100%] top-[0.2rem] ">✓</i>
                                                <span>Acceso a más de 15,000 certificaciones</span>
                                            </li>
                                        </ul>
                                        <a href="#" class="btn btn py-2 px-8 rounded-full btn-col-1 text-lg font-semibold !text-white hover:text-white hover:bg-[#3f78e0] hover:!border-[#3f78e0]  active:text-white active:bg-[#3f78e0] active:border-[#3f78e0] disabled:text-white disabled:bg-[#3f78e0] disabled:border-[#3f78e0] hover:translate-y-[-0.15rem] hover:shadow-[0_0.25rem_0.75rem_rgba(30,34,40,0.15)]">Empezar ahora</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )

}


export default StartNow;