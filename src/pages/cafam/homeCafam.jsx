import LibraryPageCafam from "../../components/cafam/libraryCafam.jsx";

import SliderWithDots from "../../components/cafam/SliderWithDots";

const universidadesLatamImagenes = [
    "assets/cafam/latinoamérica/andes.png",
    "assets/cafam/latinoamérica/tec.png",
    "assets/Universidades/SAE-México.png",
    "assets/Universidades/UNAM.png",
    "assets/Universidades/universidad-autónoma-metropolitana.png",
    "assets/Universidades/Universidad-nacional-de-colombia.png",
];

const universidadesImagenes = [
    "assets/cafam/mundo/duke.png",
    "assets/cafam/mundo/yale.png",
    "assets/cafam/mundo/stanford.png",
    "assets/Universidades/UNAM.png",
    "assets/Universidades/University-of-Maryland-College-Park.png",
    "assets/Universidades/University-of-Virginia.png",

];

const HomeCafam = () => {


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
                        <button>Explora</button>
                    </div>

                </div>
                <div id="right-wrapper-cafam">
                    <img src="assets/cafam/images/imagen-main-cafam.png" />
                </div>

            </div>

            <div id="universities-cafam-section">
                <div id="upper-section-universities" class="block-universities">
                    <div class="wrapper-title-cafam-universities">
                        <h1>Aprende de las mejores universidades de Latinoamérica...</h1>
                    </div>

                    <div id="wrapper-upper-universities-cafam">
                        <div id="wrapper-slider-upper-universities">

                            <SliderWithDots images={universidadesLatamImagenes} />

                        </div>
                    </div>
                </div>
                <div id="separator-cafam-universities">&nbsp;</div>
                <div id="lower-section-universities" class="block-universities">

                    <div id="wrapper-lower-universities-cafam"><div id="wrapper-slider-lower-universities">


                        <SliderWithDots
                            images={universidadesImagenes}
                            showAllDots={true}
                        />
                    </div></div>
                    <div class="wrapper-title-cafam-universities">
                        <h1>y de todo el mundo</h1>
                    </div>

                </div>
            </div>


            <div id="container-component-certificacionts-cafam">

                <LibraryPageCafam showRoutes={false} />

            </div>


            <div id="wrapper-industry-cafam">
                <div id="wrapper-title-industry-cafam">
                    <h1>Explora clases con los líderes de la industria</h1>
                </div>
                <div id="wrapper-flags-industry">
                    <div className="card-flag-industry">
                        <img src="/assets/cafam/empresas/biginterview.png" />
                    </div>
                    <div className="card-flag-industry">
                        <img src="/assets/cafam/empresas/google.png" />
                    </div>
                    <div className="card-flag-industry">
                        <img src="/assets/cafam/empresas/hubspot.png" />
                    </div>
                    <div className="card-flag-industry">
                        <img src="/assets/cafam/empresas/moma.png" />
                    </div>
                    <div className="card-flag-industry">
                        <img src="/assets/cafam/empresas/salesforce.png" />
                    </div>
                    <div className="card-flag-industry">
                        <img src="/assets/cafam/empresas/ubits.png" />
                    </div>
                </div>
            </div>

            <div id="footer-images-cafam">
                 
            </div>




        </>

    );
}

export default HomeCafam;

