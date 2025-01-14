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
                        topic= "Negocios"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/1b0794ce-4058-47b7-9b5d-de284d4488c6/TE-ICONO-ARTES+Y+HUMANIDADES.png"
                        tag="Negocios"
                    />
                    <TopicCircles
                        topic= "Ciencias de la Computación"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/1b0794ce-4058-47b7-9b5d-de284d4488c6/TE-ICONO-ARTES+Y+HUMANIDADES.png"
                        tag="Ciencias de la Computación"
                    />
                    <TopicCircles
                        topic= "Ciencias de Datos"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/1b0794ce-4058-47b7-9b5d-de284d4488c6/TE-ICONO-ARTES+Y+HUMANIDADES.png"
                        tag="Ciencias de Datos"
                    />
                    <TopicCircles
                        topic= "Tecnología de Información"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/1b0794ce-4058-47b7-9b5d-de284d4488c6/TE-ICONO-ARTES+Y+HUMANIDADES.png"
                        tag="Tecnología de Información"
                    />
                    <TopicCircles
                        topic= "Salud"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/1b0794ce-4058-47b7-9b5d-de284d4488c6/TE-ICONO-ARTES+Y+HUMANIDADES.png"
                        tag="Salud"
                    />
                    <TopicCircles
                        topic= "Matemáticas y Lógica"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/b6393b7b-f672-4a8a-be48-72799e17cf28/TE-ICONO-MATEMATICAS+Y+LOGICA.png" 
                        tag="Matemáticas y Lógica"
                    />
                    <TopicCircles
                        topic= "Desarrollo Personal"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/cd93c4ba-b356-4b01-87a6-6700c8839a4d/TE-ICONO-DESARROLLO+PERSONAL.png"
                        tag="Desarrollo Personal"
                    />
                    <TopicCircles
                        topic= "Ciencias Físicas e Ingeniería"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/cd93c4ba-b356-4b01-87a6-6700c8839a4d/TE-ICONO-DESARROLLO+PERSONAL.png"
                        tag="Ciencias Físicas e Ingeniería"
                    />
                    <TopicCircles
                        topic= "Ciencias Físicas e Ingeniería"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/eaea7635-0af1-4704-8cf6-03281c209dd3/TE-ICONO-CIENCIAS+F%C3%8DSICAS+E+INGENIERIA.png"
                        tag="Ciencias Físicas e Ingeniería"
                    />
                    <TopicCircles
                        topic= "Ciencias Sociales"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/eaea7635-0af1-4704-8cf6-03281c209dd3/TE-ICONO-CIENCIAS+F%C3%8DSICAS+E+INGENIERIA.png"
                        tag="Ciencias Sociales"
                    />
                    <TopicCircles
                        topic= "Aprendizaje de un Idioma"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/eaea7635-0af1-4704-8cf6-03281c209dd3/TE-ICONO-CIENCIAS+F%C3%8DSICAS+E+INGENIERIA.png"
                        tag="Aprendizaje de un Idioma"
                    />
                    <TopicCircles
                        topic= "Bienestar"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/a77359c8-7df4-47a6-907d-3b3d42618caf/TE-ICONO-BIENESTAR.png"
                        tag="Bienestar"
                    />
                    <TopicCircles
                        topic= "Personas y cultura"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/bb36fc68-859e-4d86-b0b6-97e79d83b644/TE-ICONO-PERSONAS+Y+CULTURA.png"
                        tag="Personas y cultura"
                    />
                    <TopicCircles
                        topic= "Personas y cultura"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/bb36fc68-859e-4d86-b0b6-97e79d83b644/TE-ICONO-PERSONAS+Y+CULTURA.png"
                        tag="Personas y cultura"
                    />
                    <TopicCircles
                        topic= "Productividad"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/bb36fc68-859e-4d86-b0b6-97e79d83b644/TE-ICONO-PERSONAS+Y+CULTURA.png"
                        tag="Productividad"
                    />
                    <TopicCircles
                        topic= "Liderazgo"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/bb36fc68-859e-4d86-b0b6-97e79d83b644/TE-ICONO-PERSONAS+Y+CULTURA.png"
                        tag="Liderazgo"
                    />
                    <TopicCircles
                        topic= "Diversidad, equidad e inclusión"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/e6b3b49a-b7c8-4dff-90ba-824523adbe4e/TE-ICONO-DIVERSIDAD_EQUIDAD+E+INCLUSI%C3%93N.png"
                        tag="Diversidad, equidad e inclusión"
                    />
                    <TopicCircles
                        topic= "Diversidad, equidad e inclusión"
                        image= "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/e6b3b49a-b7c8-4dff-90ba-824523adbe4e/TE-ICONO-DIVERSIDAD_EQUIDAD+E+INCLUSI%C3%93N.png"
                        tag="Diversidad, equidad e inclusión"
                    />





             
  
  
    

    
   

  
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