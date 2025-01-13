import React from "react";
import SliderEditorial from "../components/SliderEditorial";
import TopicCircles from "../components/TopicCircles";


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
                    <video src="/assets/video/main-video.mp4" autoPlay loop muted>
                        Tu navegador no soporta video
                    </video>
                </div>
                
            </div>



            <div id="second-home-section">

                <div className="block-second-section" id="upper-section">
                    <h1>Descubre más +13.000 certificaciones y crea tu propia ruta de aprendizaje.</h1>
                </div>
                <div className="block-second-section" id="lower-section">

                    <TopicCircles
                        topic= "Arte y Humanidades"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/1b0794ce-4058-47b7-9b5d-de284d4488c6/TE-ICONO-ARTES+Y+HUMANIDADES.png"
                        tag="Arte y Humanidades"
                    />
                    <TopicCircles
                        topic= "Arte y Humanidades"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/1b0794ce-4058-47b7-9b5d-de284d4488c6/TE-ICONO-ARTES+Y+HUMANIDADES.png"
                        tag="Arte y Humanidades"
                    />



                <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/temas/arte-y-humanidades">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/1b0794ce-4058-47b7-9b5d-de284d4488c6/TE-ICONO-ARTES+Y+HUMANIDADES.png" alt="Artes y Humanidades"/>
            <span class="category-name">Artes y Humanidades</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/temas/negocios">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/0cfa8c38-199b-403e-a05d-b49850ca617f/TE-ICONO-NEGOCIOS.png" alt="Negocios"/>
            <span class="category-name">Negocios</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/temas/ciencias-de-la-computacion">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/d8dd5eae-3f58-492d-8d05-1cc5113f5f25/TE-ICONO-CIENCIAS+DE+LA+COMPUTACION.png" alt="Ciencias de la Computación"/>
            <span class="category-name">Ciencias de la Computación</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/temas/ciencias-de-datos">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/918380b3-8296-4eb3-b26c-f97bf01de5eb/TE-ICONO-CIENCIA+Y+DATOS.png" alt="Ciencias de Datos"/>
            <span class="category-name">Ciencias de Datos</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/temas/tecnologa-de-informacion">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/75995000-8559-48bb-96ed-871fdd7066f9/TE-ICONO-TECNOLOGIA+E+INFORMACION.png" alt="Tecnología de Información"/>
            <span class="category-name">Tecnología de Información</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/temas/salud">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/234a2a55-0888-4369-a6ae-64f6a7a99618/TE-ICONO-SALUD.png" alt="Salud"/>
            <span class="category-name">Salud</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/temas/matematicas-y-logica">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/b6393b7b-f672-4a8a-be48-72799e17cf28/TE-ICONO-MATEMATICAS+Y+LOGICA.png" alt="Matemáticas y Lógica"/>
            <span class="category-name">Matemáticas y Lógica</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/temas/desarrollo-personal">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/cd93c4ba-b356-4b01-87a6-6700c8839a4d/TE-ICONO-DESARROLLO+PERSONAL.png" alt="Desarrollo Personal"/>
            <span class="category-name">Desarrollo Personal</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/temas/ciencias-fisica-e-ingeria">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/eaea7635-0af1-4704-8cf6-03281c209dd3/TE-ICONO-CIENCIAS+F%C3%8DSICAS+E+INGENIERIA.png" alt="Ciencias Físicas e Ingeniería"/>
            <span class="category-name">Ciencias Físicas e Ingeniería</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/temas/ciencias-sociales">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/c9f4926a-b119-4287-96e3-f456a789d9b0/TE-ICONO-CIENCIAS+SOCIALES.png" alt="Ciencias Sociales"/>
            <span class="category-name">Ciencias Sociales</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/temas/aprendizaje-de-idioma">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/318a66f7-8cf8-4053-a4bc-e2764aa6a704/TE-ICONO-LENGUAJES.png" alt="Aprendizaje de un Idioma"/>
            <span class="category-name">Aprendizaje de un Idioma</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/habilidades/bienestar">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/a77359c8-7df4-47a6-907d-3b3d42618caf/TE-ICONO-BIENESTAR.png" alt="Bienestar"/>
            <span class="category-name">Bienestar</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/habilidades/personas-y-cultura">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/bb36fc68-859e-4d86-b0b6-97e79d83b644/TE-ICONO-PERSONAS+Y+CULTURA.png" alt="Personas y cultura"/>
            <span class="category-name">Personas y cultura</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/habilidades/productividad">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/91a0e3d3-4578-431c-b09d-08b25497adbc/TE-ICONO-PRODUCTIVIDAD.png" alt="Productividad"/>
            <span class="category-name">Productividad</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/habilidades/liderazgo">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/37ffffa5-cda9-412e-bb48-8e802cfdc044/TE-ICONO-LIDERAZGO.png" alt="Liderazgo"/>
            <span class="category-name">Liderazgo</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/habilidades/diversidad-equidad-e-inclusion">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/e6b3b49a-b7c8-4dff-90ba-824523adbe4e/TE-ICONO-DIVERSIDAD_EQUIDAD+E+INCLUSI%C3%93N.png" alt="Diversidad, equidad e inclusión"/>
            <span class="category-name">Diversidad, equidad e inclusión</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/habilidades/estrategia">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/d64dd080-d117-463e-8429-02dfe4fb88fc/TE-ICONO-ESTRATEGIA.png" alt="Estrategia"/>
            <span class="category-name">Estrategia</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/habilidades/comunicacion">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/29500fce-c04f-4260-bc08-70944a061d95/TE-ICONO-COMUNICACION.png" alt="Comunicación"/>
            <span class="category-name">Comunicación</span>
        </a>
    </div>
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/habilidades/trabajo-en-equipo">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/ce129121-32c3-474d-81d6-287097cb2a65/TE-ICONO-TRABAJO+EN+EQUIPO.png" alt="Trabajo en equipo"/>
            <span class="category-name">Trabajo en equipo</span>
        </a>
    </div>
      <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/habilidades/creatividad">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/62c55e44-97c0-4afc-8e3f-1f1873a89052/TE-ICONO-CREATIVIDAD.png" alt="Creatividad"/>
            <span class="category-name">Creatividad</span>
        </a>
    </div>
        <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/habilidades/crecimiento-personal">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/079bb2bb-84f0-4a1f-9929-1112f978ca24/TE-ICONO-CRECIMIENTO+PERSONAL.png" alt="Crecimiento personal"/>
            <span class="category-name">Crecimiento personal</span>
        </a>
    </div>
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
                    <div id="fourth-flags-upper">
                        <img src="/assets/flags/University+of+Toronto.png"/>
                        <img src="/assets/flags/University+of+Michigan.png"/>
                        <img src="/assets/flags/Columbia+university+flag.png"/>
                        <img src="/assets/flags/Peking+university.png"/>
                        
                        
                        <img src="/assets/flags/Berklee+university+flag.png"/>
                       
                        <img src="/assets/flags/Harvard+university+flag.png"/>
                        <img src="/assets/flags/MIT+University+flag.png"/>
                        <img src="/assets/flags/University+of+Penn.png"/>
                        <img src="/assets/flags/Stanford+university+flag+1.png"/>
                        <img src="/assets/flags/The+university+of+chicago.png"/>
                        <img src="/assets/flags/Yale+university+flag.png"/>
                        
                    </div>

                    <h2>y de habla hispana</h2>

                    <div id="fourth-flags-lower">
                    <img src="/assets/flags/Anáhuac.png"/>
                    <img src="/assets/flags/IESE+Business+School+University+of+Navarre.png"/>
                       
                        <img src="/assets/flags/UP+universidad+de+palermo.png"/>
                        <img src="/assets/flags/universidad+de+los+andes.png"/>
                        <img src="/assets/flags/Universitat+Autónoma+de+Barcelona.png"/>
                        <img src="/assets/flags/ie+business+school.png"/>
                        <img src="/assets/flags/Pontificia+Universidad+Catolica+De+Chile.png"/>
                        <img src="/assets/flags/Universitat+de+Barcelona.png"/>
                        <img src="/assets/flags/Universidad+Nacional+De+Colombia+.png"/>
                        <img src="/assets/flags/Tecnológico+de+Monterrey.png"/>
                        <img src="/assets/flags/Universidad+Nacional+Autónoma+de+México.png"/>
                        

                    </div>

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