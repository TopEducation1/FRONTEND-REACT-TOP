import Flags from "../components/Flags";
import SliderMasterClass from "../components/SliderMasterClass";

function ParaEquipos () {

    return (

        <>
            <div id="first-team-page">
                <div id="wrapper-team-title"><h1>Entrena a tu equipo de trabajo <em style={{color: "#5CC781"}}>sin realizar grandes inversiones</em> en infraestructura o logística.</h1></div>
            </div>


            <div id="second-team-page">
                <div id="left-wrapper-second">
                    <p style={{
                        color: "#5CC781"
                    }}><em>Numerosas compañías invierten grande sumas de dinero en la formación de empleados sin ver mejoras significativas</em></p>

                    <p><strong>Top Education optimiza los procesos de capacitación, reduciendo costos y aumentando la eficiencia</strong></p>

                    <p>Con nuestra ayuda, podrás crear una universidad corporativa, que te permitirá alcanzar los objetivos de desarrollo profesional y potenciar el talento de tu equipo, garantizando así un crecimiento sostenible y una mayor competitividad en el mercado</p>
                </div>
                <div id="right-wrapper-second">
                    <img src="/assets/Piezas/pieza-teams.png"/>
                </div>
            </div>


            <div id="third-info-section">
                <h2 style={{color: "#5CC781"}}><strong>Organizaciones líderes </strong><em>han transformado su desempeño y talento humano<strong> con nuestras soluciones educativas.</strong></em></h2>


                <p><strong><em>Con Top Education, tu organización puede desarrollar las habilidades de sus empleados para aumentar la productividad e innovación, </em></strong> además de atraer y retener los mejores talentos mediante oportunidades de aprendizaje atractivas.</p>

                <p>Podrás capacitar a tu equipo sin necesidad de realizar grandes inversiones en infraestructura y logística.</p>

                <p><em style={{
                    color: "#5CC781"
                }}>Nuestras soluciones han ayudado a empresas de todo el mundo a alcanzar nuevos niveles de éxito y crecimiento.</em> Invierte en el futuro de tu organización con Top Education.</p>



                <div id="wrapper-button-reserva">
                    <button id="button-reserva">Reserva una demostración empresarial</button>
                </div>
                
            </div>


            <div id="fourth-train-section">
                <div id="upper-train-section">
                    <h1 style={{
                        color: "#5CC781"
                    }}>Entrena a tu equipo directivo con GetSmarter with edX</h1>
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
                    <button id="button-reserva">Reserva una demostración empresarial</button>
                </div>
                
            </div>


            <div id="fifth-trial-section">
                <div id="left-trial">
                    <img src="/assets/Piezas/pieza-trial.png"/>
                </div>
                <div id="right-trial">
                    <h2>Haz la prueba de Top Education para equipos</h2>


                    <p>Decenas de organizaciones ya han potenciado las habilidades de sus equipos y han visto un crecimiento significativo en sus negocios con nuestras soluciones educativas.

                    Haz la prueba de Top Education para equipos y agenda una demostración personalizada ahora mismo.

                    Descubre cómo mejorar las habilidades de tu equipo y hacer crecer tu negocio. No dejes pasar esta oportunidad de alcanzar nuevos logros juntos.</p>


                    <p style={{
                        color: "#034694"
                    }}><em>Haz la prueba de Top Education para equipos y agenda una demostración personalizada ahora mismo.</em></p>


                    <p>Descubre cómo mejorar las habilidades de tu equipo y hacer crecer tu negocio. <strong>No dejes pasar esta oportunidad de alcanzar nuevos logros juntos.</strong></p>

                    <div id="wrapper-alternative-button-reserve">
                        <button id="button-alternative-reserve">Reserva una demostración</button>
                    </div>

            

                </div>


            </div>


            <div id="sixth-masterclass-section">
                <p><em>Más de 200 instructores reconocidos, incluyendo figuras como<strong> Richard Branson, George W. Bush, Mark Cuban, Malala Yousafzai y James Clear, </strong>comparten su conocimiento en nuestra plataforma.</em></p>

                {/**<SliderMasterClass /> */}

                <p>Fomenta las habilidades blandas de tu equipo con las certificaciones de Top Education, con clases impartidas por líderes de renombre en sus respectivos campos. Asegura el crecimiento laboral y personal de tu equipo con el respaldo de los mejores expertos.</p>


                <h2 style={{
                    color: "#5CC781"
                }}><em>¡Empieza hoy y lleva a tu organización al siguiente nivel con Top Education!</em></h2>


<div id="wrapper-button-reserva-masterclass">
                    <button id="button-reserva-masterclass">Reserva una demostración empresarial</button>
                </div>
            </div>



            <div id="seventh-leader-section">
                <h1 style={{
                    color: "#5CC781"
                }}>Colaboramos con los líderes de la industria</h1>

                <Flags direction="left" />  
                <Flags direction="right" />          
                   </div>
        </>

    );

}


export default ParaEquipos;