import React, { useEffect } from "react";


function BlogPage() {

    useEffect(() => {

        const container = document.querySelector(".wrapper-slide");
        const cards = document.querySelectorAll(".card-product");

        const cardsWidth = cards[0].getBoundingClientRect().width + parseFloat(window.getComputedStyle(cards[0]).marginRight) * 2; // Ancho de cada tarjeta +  margen

        let scrollAmount = 0;


        container.scrollTo({
            top:0,
            left: 0,
            behavior: "smooth",
        });

        document.querySelector(".button-left")
        .addEventListener("click", function () {
            scrollAmount = Math.max(scrollAmount - cardsWidth, 0);
            container.scrollTo({
                top: 0,
                left: scrollAmount,
                behavior: "smooth",
            });
        });

        document.querySelector(".button-right")
        .addEventListener("click", function () {
            scrollAmount = Math.min(
                scrollAmount + cardsWidth,
                container.scrollWidth - container.clientWidth
            );

            container.scrollTo({
                top: 0,
                left: scrollAmount,
                behavior: "smooth",
            });
        });
    }, []);

    
    return (
        <>
            <div id="first-section">
                <h1>
                    <strong>
                        <em>Editorial</em> Top Education
                    </strong>
                </h1>
                <div id="wrapper-p">
                    <p>
                        Estudiantes y profesionales han mejorado sus habilidades y alcanzado sus objetivos con nuestros recursos educativos.
                    </p>
                    <p>
                        <strong>
                            <em>Descarga gratis nuestros eBooks, guías y material exclusivo </em>
                            para encontrar la información que necesitas y alcanzar tus metas educativas, personales y profesionales.
                        </strong>
                    </p>
                    <p>
                        Nuestras poderosas herramientas han enriquecido vidas y potenciado el crecimiento de muchas personas en todo el mundo.
                    </p>
                </div>
                <h3>
                    <strong>¡Únete a nuestra comunidad y comienza a transformar tu futuro hoy mismo!</strong>
                </h3>
            </div>

            <div id="section-slider-blog-top">
            <div className="container-slider-top">
                <div className="wrapper-slide">
                    <a href="https://info.top.education/es-mx/como-encontrar-trabajo-con-poca-experiencia" target="_blank" rel="noopener noreferrer" className="card-product">
                        <span className="label-type">Guía</span>
                        <img
                            src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/c2013e1d-caf8-4923-a748-cc1486259df2/Guia+Como+encontrar+trabajo+con+poca+experiencia.png?format=300w"
                            alt="Guía: Cómo encontrar trabajo con poca experiencia"
                        />
                    </a>
                    <a href="https://info.top.education/ebook-construye-tu-marca-personal-con-%C3%A9xito" target="_blank" rel="noopener noreferrer" className="card-product">
                        <span className="label-type">eBook</span>
                        <img
                            src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/500ef00b-9648-4713-8ee4-d242416969c8/eBook+Construye+tu+marca+personal+con+exito.png?format=300w"
                            alt="eBook: Construye tu marca personal con éxito"
                        />
                    </a>
                    <a href="https://info.top.education/ebook-crea-tu-ruta-de-aprendizaje-virtual-personalizada" target="_blank" rel="noopener noreferrer" className="card-product">
                        <span className="label-type">eBook</span>
                        <img
                            src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/d57b30ad-b920-450a-b076-849d8724878b/eBook+Crea+tu+ruta+de+aprendizaje+virtual+personalizada.png?format=300w"
                            alt="eBook: Crea tu ruta de aprendizaje virtual personalizada"
                        />
                    </a>
                    <a href="https://info.top.education/estrategias-para-aprender-online" target="_blank" rel="noopener noreferrer" className="card-product">
                        <span className="label-type">eBook</span>
                        <img
                            src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/ce4f1a0f-edaf-406f-9aec-3341a0685fb1/eBook+Estrategias+para+aprender+online.png?format=300w"
                            alt="eBook: Estrategias para aprender online"
                        />
                    </a>
                    <a href="https://info.top.education/capacitaci%C3%B3n-empresarial-del-futuro-e-learning-para-el-desarrollo-empresarial" target="_blank" rel="noopener noreferrer" className="card-product">
                        <span className="label-type">Paper</span>
                        <img
                            src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/aed11f9d-1ff5-4fa1-8993-40d1e9ef0a55/Whitepaper+-+Capacitacio%CC%81n+empresarial+del+futuro+elearning+para+el+desarrollo+profesional.png?content-type=image%2Fpng"
                            alt="Paper: Capacitación empresarial del futuro"
                        />
                    </a>
                </div>

                <button className="button-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#d43b3e">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9.586 4l-6.586 6.586a2 2 0 0 0 0 2.828l6.586 6.586a2 2 0 0 0 2.18 .434l.145 -.068a2 2 0 0 0 1.089 -1.78v-2.586h7a2 2 0 0 0 2 -2v-4l-.005 -.15a2 2 0 0 0 -1.995 -1.85l-7 -.001v-2.585a2 2 0 0 0 -3.414 -1.414z" />
                    </svg>
                </button>

                <button className="button-right">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#d43b3e">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12.089 3.634a2 2 0 0 0 -1.089 1.78l-.001 2.586h-6.999a2 2 0 0 0 -2 2v4l.005 .15a2 2 0 0 0 1.995 1.85l6.999 -.001l.001 2.587a2 2 0 0 0 3.414 1.414l6.586 -6.586a2 2 0 0 0 0 -2.828l-6.586 -6.586a2 2 0 0 0 -2.18 -.434l-.145 .068z" />
                    </svg>
                </button>

                <div className="cont-line">
                    <div className="point" style={{ background: "#D33B3E" }}></div>
                    <div className="point" style={{ background: "#D33B3E" }}></div>
                    <div className="line" style={{ background: "#D33B3E" }}></div>
                </div>
            </div>
            </div>
            

            <div id="blog-section">
               <h1><strong><em>Explora y aprende</em></strong></h1> 
                <div id="grid-blogs">Esta sección tendra los blogs</div>
            </div>

            <div id="newsletter-section">
                <div id="left-wrapper">
                    <div id="left-content-wrapper">
                         <h2><strong><em>Entérate de todas las novedades</em></strong></h2>
                         <p><strong><em>Únete a nuestra comunidad suscribiéndote a nuestro boletín informativo!</em></strong></p>
                         <p>Mantente al tanto de todos nuestros artículos y noticias de primera mano. <em>Al suscribirte, recibirás semanalmente información sobre nuestros nuevos artículos</em>, así como las últimas novedades de Top Education.</p>
                    </div>
                   
                </div>
                <div id="right-wrapper">
                    <div id="right-content-wrapper">
                        <div class="newsletter-form-block" id="block-title">
                            <h3>¡Suscríbete ahora!
                            </h3>
                        </div>
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
        </>
    );
}

export default BlogPage;
