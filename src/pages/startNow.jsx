import { Helmet } from "react-helmet";

function StartNow() {



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

            <div id="first-startnow-section">
                <div id="left-startnow-first-section"><h1>Lleva tu carrera al siguiente nivel</h1></div>
                <div id="right-startnow-first-section">
                    <img src="/assets/Piezas/rectangle-startnow.png" alt="rectangulo-degradado" />
                    <div id="wrapper-stonks">
                    <img id="circle-stonks-img" src="/assets/Piezas/circle-stonks.png" alt="stonks-circle" />
                    <img id="trending-up-img" src="/assets/Piezas/trending-up.png" alt="trending-up-logo" />
                    </div>
                    
                </div>
                
            </div>



            <div id="second-prices-section">

                <div id="wrapper-title-second-prices-section">
                    <h1><mark>¿Por qué <strong>Top Education</strong> es la mejor opción?</mark></h1>
                    <img src="/assets/Piezas/ellipse-start-now-1.png" alt="ellipse" />
                    <img src="/assets/Piezas/ellipse-2-startnow.png" alt="ellipse" />
                </div>

                <div id="wrapper-images-prices">
                    <img src="/assets/Piezas/price-1.png" />
                    <img src="/assets/Piezas/price-2.png" />
                </div>
            </div>


            <div id="third-section-startnow">
                <div id="wrapper-title-third-section">
                    <h1><em>¡Haz la prueba ahora!</em></h1>
                    <img src="/assets/Piezas/ellipse-4-startnow.png" alt="ellipse" />
                    <img src="/assets/Piezas/ellipse-3-startnow.png" alt="ellipse" />
                </div>
                

                <div id="wrapper-trial-images">
                    <img src="/assets/banners/Plan mensual Top Education.webp"/>
                    <a href="">
                    <button class="button-banner-start-1">Empezar ahora</button>
                    </a>
                    <img src="/assets/banners/Plan menusal Top Education-2.webp"/>
                    <a href="">
                    <button class="button-banner-start-2">Empezar ahora</button>
                    </a>
                </div>
            </div>


            <div id="fourth-info-section">


                <div id="wrapper-title-fourth-info-section">
                    <h1>¿Eres el responsable de un <span>equipo profesional?</span></h1>
                </div>

                <div id="wrapper-p-image-info-section">
                <div id="container-text-subinfo">

                <p>Top Education para Equipos es la plataforma elegida por líderes empresariales para el desarrollo profesional efectivo de equipos.<br/><br/>Podrás certificar a tu equipo en diversas habilidades clave para potenciar su productividad, competitividad y crecimiento.<br/>También, podrás monitorizar su progreso en tiempo real, acceder a descuentos por volumen en suscripciones corporativas, establecer tu propia universidad corporativa virtual y disfrutar de contenido exclusivo diseñado para fortalecer habilidades blandas como la negociación.<br/><br/><strong><em>Nuestra plataforma ha demostrado impulsar resultados empresariales significativos en numerosas organizaciones.</em></strong></p>
                </div>
                <img src="/assets/Piezas/boy-image-p.png" alt="boy-image" />
                </div>
                

                

                    
                </div>

            <div id="fifth-team-section">

                <h1>Descubre cómo podemos ayudarte a alcanzar y superar tus objetivos empresariales desde hoy con Top Education  para equipos</h1>


                <button id="button-for-teams">Top Education para equipos</button>
            </div>
        </>
    )

}


export default StartNow;