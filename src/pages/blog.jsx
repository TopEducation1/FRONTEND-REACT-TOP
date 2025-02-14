//import React, { useEffect } from "react";

import BlogSearchBar from "../components/BlogSearchBar";
import BlogsGrid from "../components/BlogsGrid";
import { Helmet } from "react-helmet";


function BlogPage() {

    
    return (
        <>

        {/**SEO ELEMENTS WITH REACT -HELMET */}
              <Helmet>
                <title>Recursos | Top Education</title>
                <meta name="description" content="Descubre ebooks y blogs exclusivos de Top Education. Accede a contenido valioso para potenciar tu conocimiento y alcanzar tus metas personales y profesionales." />
                <meta property="og:title" content="Top Education | Aprende con edX, Coursera y MasterClass" />
                <meta name="author" content="Top Education" />
                <meta name="robots" content="index, follow" />
                <meta property="og:description" content="Descubre ebooks y blogs exclusivos de Top Education. Accede a contenido valioso para potenciar tu conocimiento y alcanzar tus metas personales y profesionales." />
                <meta property="og:type" content="website" />
              </Helmet>
            <div id="first-section">
                <h1>
                    Editorial Top Education
                </h1>
                <div id="wrapper-p">
                   
                    <p>
                            Descarga gratis nuestros eBooks, guías y material exclusivo
                            para encontrar la información que necesitas y alcanzar tus metas educativas, personales y profesionales.
                       
                    </p>
                   
                </div>

                <div className="container-slider-top">
                <div className="wrapper-slide">
                    <a href="https://info.top.education/es-mx/como-encontrar-trabajo-con-poca-experiencia" target="_blank" rel="noopener noreferrer" className="card-product">
                        <img
                            src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/c2013e1d-caf8-4923-a748-cc1486259df2/Guia+Como+encontrar+trabajo+con+poca+experiencia.png?format=300w"
                            alt="Guía: Cómo encontrar trabajo con poca experiencia"
                        />
                    </a>
                    <a href="https://info.top.education/ebook-construye-tu-marca-personal-con-%C3%A9xito" target="_blank" rel="noopener noreferrer" className="card-product">
                        <img
                            src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/500ef00b-9648-4713-8ee4-d242416969c8/eBook+Construye+tu+marca+personal+con+exito.png?format=300w"
                            alt="eBook: Construye tu marca personal con éxito"
                        />
                    </a>
                    <a href="https://info.top.education/ebook-crea-tu-ruta-de-aprendizaje-virtual-personalizada" target="_blank" rel="noopener noreferrer" className="card-product">
                        <img
                            src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/d57b30ad-b920-450a-b076-849d8724878b/eBook+Crea+tu+ruta+de+aprendizaje+virtual+personalizada.png?format=300w"
                            alt="eBook: Crea tu ruta de aprendizaje virtual personalizada"
                        />
                    </a>
                    <a href="https://info.top.education/estrategias-para-aprender-online" target="_blank" rel="noopener noreferrer" className="card-product">
                        <img
                            src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/ce4f1a0f-edaf-406f-9aec-3341a0685fb1/eBook+Estrategias+para+aprender+online.png?format=300w"
                            alt="eBook: Estrategias para aprender online"
                        />
                    </a>
                    <a href="https://info.top.education/capacitaci%C3%B3n-empresarial-del-futuro-e-learning-para-el-desarrollo-empresarial" target="_blank" rel="noopener noreferrer" className="card-product">
                        <img
                            src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/aed11f9d-1ff5-4fa1-8993-40d1e9ef0a55/Whitepaper+-+Capacitacio%CC%81n+empresarial+del+futuro+elearning+para+el+desarrollo+profesional.png?content-type=image%2Fpng"
                            alt="Paper: Capacitación empresarial del futuro"
                        />
                    </a>
                </div>

            </div>
            </div>
            

            <div id="blog-section">

                <div id="title-and-search-blog-section">

                    

                    <div id="wrapper-title-blogs-section">
                        <h1><strong>Explora <span><mark>y aprende</mark></span></strong></h1>
                    </div>
                    <div id="wrapper-blogs-search-bar">
                        <BlogSearchBar/>
                    </div>
                </div>

                <BlogsGrid/>
                

            </div>

            <div id="newsletter-section">
            <img src="/assets/Piezas/ellipse-1-newsletter.png" alt="ellipse" id="ellipse-1-newsletter" />
            <img src="/assets/Piezas/ellipse-2-newsletter.png" alt="ellipse" id="ellipse-2-newsletter" />
                <div id="left-wrapper">
                    <div id="left-content-wrapper">
                        <img src="/assets/Piezas/icon-newsletter.png" alt="icon-red" />
                         <h2><strong><em>Entérate de todas las novedades</em></strong></h2>
                         <p><strong><em>Únete a nuestra comunidad suscribiéndote a nuestro boletín informativo!</em></strong></p>
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
