import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = ({ toggleMenu, openIndexResponsiveMenu, isMenuOpen }) => {

  const [position, setPosition] = useState(0);

  useEffect(() => {
    const headerElement = document.querySelector("header");

    if (headerElement) {
      setTimeout(() => {
        headerElement.classList.add("moved-header");
      }, 1000);
    }
  }, []);

  return (
    <header>

      {/* Navigation bar */}
      <nav className="nav-main">
        {/* Burguer button */}
        <div className="container-burguer-button">

        <svg onClick={() => {
              openIndexResponsiveMenu();
            }}xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#ffffff"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>

        </div>

        {/* Navigation bar Logo */}
        <div className="wrapper-logo-nav">
          <a href="/">
            <img
              src="/assets/logos/TOPEDUCATIONLOGONAV.png"
              alt="Logo Top Education"
              className="logo-nav"
              data-logo-responsive="src\assets\logos\TOPEDUCATIONLOGONAV.png"
            ></img>
          </a>
        </div>

        {/* Navigation menu */}
        <div className="navigation-menu">
          <ul>
            <li>
              <Link to="/explora">Explora</Link>
            </li>
            <li>
              <a href="/para-equipos">Para equipos</a>
            </li>
            <li>
              <a href="/recursos">Recursos</a>
            </li>
            <li>
              <a id="start-now" href="/empieza-ahora">
                Empieza ahora
              </a>
            </li>
            {/** <li><a href="/rutas-del-conocimiento">Rutas de conocimiento</a></li>*/}
          </ul>
        </div>
      </nav>

      {/* Menu responsive */}

      <div className={`menu-responsive-1 ${position ? "position" : ""}`}>
        <div className="navigation-menu-responsive">
          <ul>
            <li>
              <a
                href="example.com"
                className="button-explore"
                onClick={toggleMenu}
              >
                <Link to="/explora">Explora</Link>
              </a>
            </li>
            <li>
              <a href="/para-equipos">Para Equipos</a>
            </li>
            <li>
              <a href="/recursos">Recursos</a>
            </li>
          </ul>
        </div>
        <button className="button-start-now-responsive">Empiezá ahora</button>
      </div>

      {/* Dropdown menu */}
      <div className="dropdown-menu" id="dropdown-menu">
        {/* Universities menu section */}
        <div className="menu-universities">
          <h3>Universidad</h3>
          <div className="wrapper-flags">
            <a
              className="flag-object"
              href="https://www.top.education/certificaciones/universidad/norteamerica/columbia"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/ad8627c9-6ce0-474f-af56-d312c3f44038/Columbia+university+flag.png?content-type=image%2Fpng"
                alt="bandera-columbia"
              />
            </a>
            <a
              href="https://www.top.education/certificaciones/universidad/norteamerica/harvard-university"
              className="flag-object"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/59549e33-1fdd-4586-ac9a-204b8485b373/Harvard+university+flag.png?content-type=image%2Fpng"
                alt="bandera-harvard"
              />
            </a>
            <a
              href="https://www.top.education/certificaciones/universidad/norteamerica/yale-university"
              className="flag-object"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/e5dc675a-3bd5-4616-bcd9-735558171055/Yale+university+flag.png?content-type=image%2Fpng"
                alt="bandera-yale"
              />
            </a>
            <a
              href="https://www.top.education/certificaciones/universidad/norteamerica/University-of-chicago"
              className="flag-object"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/5e4a36cb-2b58-4156-9c9d-c7ef3da06e32/The+university+of+chicago.png?content-type=image%2Fpng"
                alt="bandera-universidad-de-chicago"
              />
            </a>
            <a
              href="https://www.top.education/certificaciones/universidad/norteamerica/stanford-university"
              className="flag-object"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/68e9ad78-8835-4667-b5ec-dd4fc7d197ff/Stanford+university+flag+1.png?content-type=image%2Fpng"
                alt="bandera-stanford"
              />
            </a>
            <a
              href="https://www.top.education/certificaciones/universidad/norteamerica/mit"
              className="flag-object"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/34a6b357-a5fd-4391-9c54-77c84735c7e5/MIT+University+flag.png?content-type=image%2Fpng"
                alt="bandera-mit"
              />
            </a>
            <a
              href="https://www.top.education/certificaciones/universidad/norteamerica/berklee-college-of-music"
              className="flag-object"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/53128cbd-7f3c-4569-8bf1-05d7ba95ba5b/Berklee+university+flag.png?content-type=image%2Fpng"
                alt="bandera-berklee"
              />
            </a>
            <a
              href="https://www.top.education/certificaciones/universidad/norteamerica/university-of-pennsylvania"
              className="flag-object"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/5b6a6a5f-7744-4b79-927b-ce8fc79028a4/Penn+university+flag.png?content-type=image%2Fpng"
                alt="bandera-pennsylvania"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Platform menu */}
      <div className="platform-menu">
        <h3>Plataforma</h3>
        <div className="wrapper-platforms">
          <a
            href="https://www.top.education/certificaciones/plataforma/masterclass"
            className="platform-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/6f4b11cd-0e51-4450-83c8-1f8c6de13eea/TOP-EDUCATION-MASTERCLASS.png?content-type=image%2Fpng"
              alt="logo-masterclass"
            />
          </a>
          <a
            href="https://www.top.education/certificaciones/plataforma/edx"
            className="platform-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/9d6b2145-cced-400d-8d08-8c602683b4e7/TOP-EDUCATION-EDX.png?content-type=image%2Fpng"
              alt="logo-edx"
            />
          </a>
          <a
            href="https://www.top.education/certificaciones/plataforma/coursera"
            className="platform-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/dcec8e53-2165-4240-8355-2c69fa157d65/TOP-EDUCATION-COURSERA.png?content-type=image%2Fpng"
              alt="logo-coursera"
            />
          </a>
        </div>
      </div>

      {/*MENU CON TEMAS DISPONIBLES EN LA PLATAFORMA*/}
      <div className="topics-menu">
        <h3>Temas</h3>
        <div className="wrapper-topics">
          <a
            href="https://www.top.education/certificaciones/temas/arte-y-humanidades"
            className="topic-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/1b0794ce-4058-47b7-9b5d-de284d4488c6/TE-ICONO-ARTES+Y+HUMANIDADES.png"
              alt="logo-artes-y-humanidades"
            />
            Artes y Humanidades
          </a>
          <a
            href="https://www.top.education/certificaciones/temas/negocios"
            className="topic-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/0cfa8c38-199b-403e-a05d-b49850ca617f/TE-ICONO-NEGOCIOS.png"
              alt="logo-negocios"
            />
            Negocios
          </a>
          <a
            href="https://www.top.education/certificaciones/temas/ciencias-de-la-computacion"
            className="topic-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/d8dd5eae-3f58-492d-8d05-1cc5113f5f25/TE-ICONO-CIENCIAS+DE+LA+COMPUTACION.png"
              alt="logo-ciencias-de-la-computación"
            />
            Ciencias de la Computación
          </a>
          <a
            href="https://www.top.education/certificaciones/temas/ciencias-de-datos"
            className="topic-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/918380b3-8296-4eb3-b26c-f97bf01de5eb/TE-ICONO-CIENCIA+Y+DATOS.png"
              alt="logo-ciencia-de-datos"
            />
            Ciencias de Datos
          </a>
          <a
            href="https://www.top.education/certificaciones/temas/tecnologa-de-informacion"
            className="topic-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/75995000-8559-48bb-96ed-871fdd7066f9/TE-ICONO-TECNOLOGIA+E+INFORMACION.png"
              alt="logo-tecnologia-de-información"
            />
            Tecnología de información
          </a>
          <a
            href="https://www.top.education/certificaciones/temas/salud"
            className="topic-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/234a2a55-0888-4369-a6ae-64f6a7a99618/TE-ICONO-SALUD.png"
              alt="logo-salud"
            />
            Salud
          </a>
          <a
            href="https://www.top.education/certificaciones/temas/matematicas-y-logica"
            className="topic-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/b6393b7b-f672-4a8a-be48-72799e17cf28/TE-ICONO-MATEMATICAS+Y+LOGICA.png"
              alt="Matemáticas-y-Logica"
            />
            Matemáticas y Lógica
          </a>
          <a
            href="https://www.top.education/certificaciones/temas/desarrollo-personal"
            className="topic-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/cd93c4ba-b356-4b01-87a6-6700c8839a4d/TE-ICONO-DESARROLLO+PERSONAL.png"
              alt="logo-Desarrollo-Personal"
            />
            Desarrollo Personal
          </a>
          <a
            href="https://www.top.education/certificaciones/temas/ciencias-fisica-e-ingeria"
            className="topic-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/eaea7635-0af1-4704-8cf6-03281c209dd3/TE-ICONO-CIENCIAS+F%C3%8DSICAS+E+INGENIERIA.png"
              alt="logo-Ciencias-fisica-e-ingenieria"
            />
            Ciencias Físicas e Ingeniería
          </a>
          <a
            href="https://www.top.education/certificaciones/temas/ciencias-sociales"
            className="topic-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/c9f4926a-b119-4287-96e3-f456a789d9b0/TE-ICONO-CIENCIAS+SOCIALES.png"
              alt="logo-Ciencias-Sociales"
            />
            Ciencias Sociales
          </a>
          <a
            href="https://www.top.education/certificaciones/temas/aprendizaje-de-idioma"
            className="topic-item"
          >
            <img
              src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/318a66f7-8cf8-4053-a4bc-e2764aa6a704/TE-ICONO-LENGUAJES.png"
              alt="logo-aprendizaje-de-idioma"
            />
            Aprendizaje de un Idioma
          </a>
        </div>

        {/* Skills menu */}
        <div className="skills-menu">
          <h3>Habilidades</h3>
          <div className="wrapper-skills">
            <a
              className="skill-item"
              href="https://www.top.education/certificaciones/habilidades/bienestar"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/a77359c8-7df4-47a6-907d-3b3d42618caf/TE-ICONO-BIENESTAR.png"
                alt="bienestar"
              />
              Bienestar
            </a>
            <a
              className="skill-item"
              href="https://www.top.education/certificaciones/habilidades/estrategia"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/d64dd080-d117-463e-8429-02dfe4fb88fc/TE-ICONO-ESTRATEGIA.png"
                alt="Estrategia"
              />
              Estrategia
            </a>
            <a
              className="skill-item"
              href="https://www.top.education/certificaciones/habilidades/liderazgo"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/37ffffa5-cda9-412e-bb48-8e802cfdc044/TE-ICONO-LIDERAZGO.png"
                alt="Liderazgo"
              />
              Liderazgo
            </a>
            <a
              className="skill-item"
              href="https://www.top.education/certificaciones/habilidades/productividad"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/91a0e3d3-4578-431c-b09d-08b25497adbc/TE-ICONO-PRODUCTIVIDAD.png"
                alt="Productividad"
              />
              Productividad
            </a>
            <a
              className="skill-item"
              href="https://www.top.education/certificaciones/habilidades/personas-y-cultura"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/bb36fc68-859e-4d86-b0b6-97e79d83b644/TE-ICONO-PERSONAS+Y+CULTURA.png"
                alt="Personas y
                    cultura"
              />
              Personas y cultura
            </a>
            <a
              className="skill-item"
              href="https://www.top.education/certificaciones/habilidades/diversidad-equidad-e-inclusion"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/e6b3b49a-b7c8-4dff-90ba-824523adbe4e/TE-ICONO-DIVERSIDAD_EQUIDAD+E+INCLUSI%C3%93N.png"
                alt="Diversidad,equidad e inclusión"
              />
              Diversidad, equidad e inclusión
            </a>
            <a
              className="skill-item"
              href="https://www.top.education/certificaciones/habilidades/trabajo-en-equipo"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/ce129121-32c3-474d-81d6-287097cb2a65/TE-ICONO-TRABAJO+EN+EQUIPO.png"
                alt="Trabajo en equipo"
              />
              Trabajo en equipo
            </a>
            <a
              className="skill-item"
              href="https://www.top.education/certificaciones/habilidades/crecimiento-personal"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/079bb2bb-84f0-4a1f-9929-1112f978ca24/TE-ICONO-CRECIMIENTO+PERSONAL.png"
                alt="Crecimiento personal"
              />
              Crecimiento personal
            </a>
            <a
              className="skill-item"
              href="https://www.top.education/certificaciones/habilidades/creatividad"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/62c55e44-97c0-4afc-8e3f-1f1873a89052/TE-ICONO-CREATIVIDAD.png"
                alt="Creatividad"
              />
              Creatividad
            </a>
            <a
              className="skill-item"
              href="https://www.top.education/certificaciones/habilidades/comunicacion"
            >
              <img
                src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/29500fce-c04f-4260-bc08-70944a061d95/TE-ICONO-COMUNICACION.png"
                alt="Comunicación"
              />
              Comunicación
            </a>
          </div>
        </div>

        {/* Button to close the dropdown menu */}

        <div className="close-dropdownMenu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-back-up"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 14l-4 -4l4 -4" />
            <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
          </svg>
        </div>
      </div>
    </header>
  );
};
export default Header;
