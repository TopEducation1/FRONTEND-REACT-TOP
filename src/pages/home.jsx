import React from "react";
import SliderEditorial from "../components/SliderEditorial";


function HomePage () {
 
    return (
        <>
            <div id="first-home-section">

                <div id="left-first-section">
                    <h1>Top Education,</h1>
                    <h2><em>La plataforma que revoluciona la educación en linea</em></h2>
                    <div id="row-video">
                        <img src="/assets/Piezas/play.png" alt="play icono"/>
                        <span>Conoce más de<br/>Top Education</span>
                    </div>
                    
                </div>
                <div id="right-first-section">
                    <video src="/assets/video/TOP EDUCATION_V9_FULL.mp4" autoPlay loop muted>
                        Tu navegador no soporta video
                    </video>
                </div>
                
            </div>



            <div id="second-home-section">

                <div className="block-second-section" id="upper-section">
                    <h1>Descubre más +13.000 certificaciones y crea tu propia ruta de aprendizaje.</h1>
                </div>
                <div className="block-second-section" id="lower-section">
                    <img src="/assets/Piezas/hilo.png" alt=""/>
                </div>

            </div>





            <div id="third-home-section">
                <div id="left-text-section">
                    <h3 style={{
                        color : "#034694"
                    }}>Descubre Top Education, la plataforma, de aprendizaje en línea que <em>conecta tu interés con el conocimiento de los mejores del mundo.</em></h3>


                    <p>Accede a certificaciones impartidas por las compañias más influyentes y las instituciones educativas de mayor prestigio a nivel global</p>

                    <p>Sumérgete en programas especializados diseñados para potenciar tus habilidades, guiados por los líderes de la industria que te compartirán sus estrategias y experiencia de primera mano</p>

                    <p>Cada certificación que completes estará respaldada por tecnología blockchain, garantizando que tus logros sean validados de manera segura y reconocidos a nivel mundial.</p>


                    <h3  style={{
                        color : "#034694"
                    }}>Con Top Education, <em>estarás un paso más cerca de transformar tu futuro profesional. </em>¡Empieza hoy y alcanza el éxito que mereces!</h3>
                </div>



                <div id="right-renata-section">
                    <img src="/assets/Piezas/TE_Renata_con_portátil.png" />
                </div>
            </div>

                    
            <div id="fourth-home-section">

                    <h2>Aprende con las universidades lideres del mundo</h2>

                    <img src="/assets/Piezas/flags1.png" alt="Imagen con banderas de universidades"/>


                    <h2>y de habla hispana</h2>

                    <img src="/assets/Piezas/flags2.png" alt="Imagen con banderas de universidades"/>

            </div>

            <div id="fifth-home-section">
                <h1>Editorial Top Education</h1>
                <p>Descarga gratis nuestros recursos exclusivos. Encuentra la información que necesitas para alcanzar tus metas educativas, personales y profesionales. Te ofrecemos herramientas poderosas para enriquecer tu vida y potenciar tu crecimiento.</p>

                <SliderEditorial />
            </div>

            <div id="sixth-home-section">

                    <h1>Descubre las rutas del conocimiento con genios históricos</h1>

                    <div id="grid-genius">
                        
                        <a><img src="assets/SliderImages/6.png"/></a>
                        <a><img src="assets/SliderImages/2.png"/></a>
                        <a><img src="assets/SliderImages/3.png"/></a>
                        <a><img src="assets/SliderImages/4.png"/></a>
                    </div>

            </div>


            <div id="seventh-home-section">

                <h1>Explora y aprende</h1>

                <div id="grid-articles">


                    <div class="article">
                        <img  src="/assets/Piezas/1-article.png "/>
                        <h3>edx vs coursera ¿Cuál plataforma educativa es mejor?</h3>
                    </div>
                    <div class="article">
                        <img  src="/assets/Piezas/2-article.png "/>
                        <h3>Así puedes certificarte en las mejores universidades del mundo</h3>
                    </div>
                    <div class="article">
                    <img  src="/assets/Piezas/3-article.png "/>
                    <h3>5 grandes cursos de edx con certificado de universidadesen estados unidos</h3>
                    </div>

                </div>


                <button id="button-all-articles">Ver más artículos</button>

            </div>


        </>
    );
}


export default HomePage;