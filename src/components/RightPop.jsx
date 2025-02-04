const RightPop = () => {


    return (
        <div id="container-right-pop">
            {/* Pop-up section */}
            <div className="grid-pop-section" id="upper-section">
                
                <h3>¿Aún no eres miembro de Top Education?</h3>
            </div>
            {/* Middle section */}
            <div className="grid-pop-section" id="mid-section">
                <span>Con una membresía en Top Education, tendrás acceso a esta certificación y cientos más. <b>¡Haz la prueba ahora!</b></span>
                <button id="button-test-top">Probar Top Education</button>
            </div>
            {/* Bottom section */}
            <div className="grid-pop-section" id="bottom-section">
                <span>¿Te gustaría contratar nuestros servicios para tu empresa?</span>
                <a href="/para-equipos" >Conoce Top Education for teams</a>
            </div>
        </div>
    )
}

export default RightPop;