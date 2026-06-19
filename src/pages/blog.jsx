import { useEffect, useRef } from "react";
import BlogsGrid from "../components/BlogsGrid";
import { Helmet } from "react-helmet";

function BlogPage() {
  const clientifyRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://api.clientify.net/web-marketing/superforms/script/288488.js";

    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Recursos | Top.education</title>
        <meta
          name="description"
          content="Descubre ebooks y blogs exclusivos de Top.education. Accede a contenido valioso para potenciar tu conocimiento y alcanzar tus metas personales y profesionales."
        />
        <meta property="og:title" content="Top Education | Aprende con edX, Coursera y MasterClass" />
        <meta name="author" content="Top Education" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:description"
          content="Descubre ebooks y blogs exclusivos de Top Education. Accede a contenido valioso para potenciar tu conocimiento y alcanzar tus metas personales y profesionales."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="pt-32 pb-20 px-8 bg-[#FFFFFF]">
        <div className="container m-auto mx-auto gap-2 sect-h-pequ">
          <div className="text-center mb-14">
            <h1 className="text-[#0F090B] text-7xl font-normal font-[Lora] text-center leading-[1em] z-10 relative sm:text-6xl md:text-6xl lg:text-6xl xl:text-8xl">
              <span className="font-te-it !text-[3.8rem] leading-[1em]">
                Editorial
              </span>
              <br />
              <span id="top">top</span>
              <span id="education">.education</span>
            </h1>

            <p className="text-[#6B6560] text-center text-base mt-3 mb-2 max-w-[560px] mx-auto leading-relaxed">
              Descarga gratis nuestros recursos exclusivos. Encuentra la
              información que necesitas para alcanzar tus metas educativas,
              personales y profesionales. Te ofrecemos herramientas poderosas
              para enriquecer tu vida y potenciar tu crecimiento.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              {
                type: "Guía",
                color: "bg-[#5CC781]",
                title: "Cómo encontrar trabajo con poca experiencia",
                link: "https://info.top.education/como-encontrar-trabajo-con-poca-experiencia",
                image:
                  "/assets/content/resources/Guia-Como-encontrar trabajo-con-poca-experiencia.webp",
              },
              {
                type: "eBook",
                color: "bg-[#1941cf]",
                title: "Construye tu marca personal con éxito",
                link: "https://info.top.education/ebook-construye-tu-marca-personal-con-exito",
                image:
                  "/assets/content/resources/eBook-Construye-tu-marca-personal-con-exito.webp",
              },
              {
                type: "eBook",
                color: "bg-[#1941cf]",
                title: "Crea tu ruta de aprendizaje virtual personalizada",
                link: "https://info.top.education/ebook-crea-tu-ruta-de-aprendizaje-virtual-personalizada",
                image:
                  "/assets/content/resources/eBook-Crea-tu-ruta-de-aprendizaje-virtual-personalizada.webp",
              },
              {
                type: "eBook",
                color: "bg-[#1941cf]",
                title: "Estrategias para aprender online",
                link: "https://info.top.education/estrategias-para-aprender-online",
                image:
                  "/assets/content/resources/eBook-Estrategias-para-aprender-online.webp",
              },
              {
                type: "Paper",
                color: "bg-[#034694]",
                title: "Capacitación empresarial del futuro",
                link: "https://info.top.education/capacitacion-empresarial-del-futuro-e-learning",
                image:
                  "/assets/content/resources/eBook-Capacitacion-empresarial-del futuro.webp",
              },
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-[18px] border border-[#E7E7E7] bg-white transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
              >
                <div className="relative overflow-hidden bg-[#120B0E]">
                  <span
                    className={`absolute left-4 top-4 z-10 rounded-full px-4 py-1.5 text-xs font-bold text-white ${item.color}`}
                  >
                    {item.type}
                  </span>

                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-[285px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                </div>

                <div className="p-4 flex flex-col flex-1 gap-2">
                  <h3 className="text-[#0F090B] !font-[Montserrat] font-semibold text-[13px] leading-snug group-hover:text-[#2563EB] transition-colors line-clamp-3">
                    {item.title}
                  </h3>

                  <p
                    className={`flex items-center gap-1 text-xs mt-auto pt-1 ${
                      item.type === "Guía"
                        ? "text-[#5CC781]"
                        : item.type === "Paper"
                        ? "text-[#034694]"
                        : "text-[#1941cf]"
                    }`}
                  >
                    Descargar gratis →
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-2 md:px-8 relative overflow-hidden bg-[#0F090B]">
        <div className="container m-auto">
          <h2 className="text-white text-[3.2rem] font-te leading-tight mb-4 text-center">
            <span className="font-te-it">Explora</span> y aprende
          </h2>

          <p className="text-[#a8a8a8] text-base text-center max-w-[600px] mx-auto leading-relaxed mb-8">
            Amplía tus conocimientos con contenido de calidad seleccionado por
            expertos. Descubre nuevas habilidades, profundiza en temas de tu
            interés y accede a recursos educativos que te acercan a tus
            objetivos.
          </p>

          <BlogsGrid category="Desarrollo personal, Desarrollo profesional, Top education originals" />
        </div>
      </section>

      <section className="wrapper relative overflow-hidden bg-[#0F090D] px-4 pt-10 pb-24">
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#3A2B33 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        <span className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1941cf]/10 blur-[120px]" />

        <div className="container relative z-10 mx-auto">
          <div className="mx-auto flex max-w-[1080px] py-6 flex-col items-center text-center">
            <h2 className="font-te text-[2rem] leading-[0.95em] text-[#F8F7F4] sm:text-[3rem] md:text-[3.8rem]">
              <span className="font-te-it mr-4">Entérate</span>
              de todas <br />
              las novedades
            </h2>

            <p className="mt-3 max-w-[560px] text-[1.05rem] leading-[1.2em] text-[#9B989E]">
              Únete a nuestra comunidad para informarte y recibir tu inspiración
              semanal.
            </p>

            <div
              id="clientify-form"
              className="mt-10 w-full max-w-[560px] min-h-[160px]"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogPage;