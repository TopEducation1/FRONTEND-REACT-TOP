import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBarBrand from "../components/brand/searchBarBrand";
import BrandExploreSection from "../components/brand/BrandExploreSection";
import BrandExploreWhiteLabel from "../components/brand/BrandExploreWhiteLabel";
import BrandBlogsGrid from "../components/brand/BrandBlogsGrid";

const API_BASE = "https://app.top.education"; 
//const API_BASE = process.env.URL_ENV 

// --- Secciones (aquí luego conectas tus componentes reales) ---

function AboutSection({ brand }) {
  return (
    <section className="wrapper">
        <div className="container m-auto h-[80vh] mx-auto px-4 pt-[200px] bg-red pb-[50px] flex justify-center items-center gap-2 sect-h-pequ">
            <div className="flex flex-wrap mx-[-15px] xl:mx-[-35px] lg:mx-[-20px] !mt-[-30px] !mb-[4.5rem] items-center">
                <div className="xl:w-7/12 lg:w-7/12 w-full flex-[0_0_auto] xl:!px-[35px] lg:!px-[20px] !px-[15px]  max-w-full !relative">
                    <h1 className="text-neutral-950 text-6xl font-normal font-[Lora] text-left leading-[1.1em] font-bold relative sm:text-5xl md:text-6xl lg:text-6xl font-[Montserrat]">{brand.phrase || "Aprende hoy...transforma tu futuro"}</h1>
                    <p>{brand.about_us || "Pronto más información sobre esta marca."}</p>
                    <button className="text-white font-bold py-2 px-4 mt-3 rounded-full" style={{ background: brand.color_principal || "#0F090B" }}>Explorar certificaciones</button>
                </div>
                <div className="xl:w-5/12 lg:w-5/12 w-full flex-[0_0_auto] xl:!px-[35px] lg:!px-[20px] !px-[15px] !mt-[25px] max-w-full">
                    {brand.banner && (
                        <div className="w-full rounded-[12px] flex items-center justify-center overflow-hidden">
                        <img
                            src={brand.banner}
                            alt={brand.nombre}
                            className="max-h-[60vh] w-auto object-contain"
                        />
                        </div>
                    )}
                    
                </div>                        
            </div>
        </div>
    </section>
  );
}

function ExploreSection({ brand }) {
  return (
    <section className="wrapper rounded-t-[50px]" style={{ background: brand.color_principal || "#0F090B" }}>
      <div className="container m-auto mx-auto px-4  py-[50px] flex justify-center items-center gap-2">
        <BrandExploreWhiteLabel brandSlug={brand.slug} />
      </div>
    </section>
  );
}

function TopSection({ brand }) {
  return (
    <section className="bg-white">
      
    </section>
  );
}

function BlogSection() {
  return (
    <section className="bg-white">
      <div className="container m-auto mx-auto px-4  py-[50px] flex justify-center items-center gap-2">
        <BrandBlogsGrid
          category=""           // o la categoría que uses para esta marca
          title="Blog"
          showSearch={true}     // o false si no quieres buscador
        />
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-2">Habilidades</h2>
      <p className="text-sm text-gray-700">
        Habilidades que se potencian con las certificaciones de esta marca.
      </p>
    </section>
  );
}

function TopicsSection() {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-2">Temas</h2>
      <p className="text-sm text-gray-700">
        Temas clave asociados a esta marca (puedes conectar tu TopicGrid aquí).
      </p>
    </section>
  );
}


// Mapa de clave de permiso -> componente
const SECTION_COMPONENTS = {
  about_us: AboutSection,
  explora: ExploreSection,
  los_mas_top: TopSection,
  blog: BlogSection,
  habilidades: SkillsSection,
  temas: TopicsSection,
};

export default function BrandLandingPage() {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
  const footer = document.querySelector("footer");
  if (footer) {
    footer.style.display = "none";
  }
  const header = document.querySelector("header");
  if (header) {
    header.style.display = "none";
  }

  // Cuando salimos de la página, lo mostramos de nuevo
  return () => {
    if (footer) {
      footer.style.display = "";
    }
  };
}, []);
  useEffect(() => {
    async function fetchBrand() {
      try {
        setLoading(true);
        setNotFound(false);

        const res = await fetch(`${API_BASE}/api/brand/${slug}/`);
        if (!res.ok) {
          if (res.status === 404) setNotFound(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setBrand(data);
      } catch (error) {
        console.error("Error cargando marca blanca:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchBrand();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-gray-500">Cargando marca...</p>
      </div>
    );
  }

  if (notFound || !brand) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Marca no encontrada
        </h1>
        <p className="text-sm text-gray-600 max-w-md text-center">
          Verifica el enlace que te compartieron. Es posible que la marca esté
          inactiva o no exista.
        </p>
      </div>
    );
  }

  // Filtrar y ordenar secciones visibles
  const visibleSections = (brand.permisos || [])
    .filter((p) => p.visible)
    .sort((a, b) => a.orden - b.orden);

  return (
    <div
      className="min-h-screen"
      style={{
        background: brand.color_secundario || "#F6F4EF",
      }}
    >
        
      {/* Header de la marca */}
      <nav
        className="w-full fixed w-full z-10"
      >
        <div className="flex justify-between relative mx-2 w-[90vw] md:w-[60vw] mt-[15px] rounded-[36px] border border-white/80 px-4 py-3 backdrop-blur-md dark:border-white-700/80 dark:backdrop-blur-md md:flex md:items-center md:justify-between md:px-6 md:py-0 lg:px-8 xl:mx-auto"
        style={{ background: brand.color_principal || "#0F090B" }}>
            <div className="flex py-[8px] items-center gap-2">
                {brand.logo && (
                    <div className="h-[45px] rounded-[12px] flex items-center justify-center overflow-hidden shadow">
                    <img
                        src={brand.logo}
                        alt={brand.nombre}
                        className="h-full w-full object-contain"
                    />
                    </div>
                )}
                <div className="flex flex-col ">
                    {/*<h2 className="text-[20px] md:text-[24px] font-semibold text-white">
                    {brand.nombre}
                    </h2>
                    brand.descripcion && (
                    <p className="text-xs md:text-sm text-white/80 line-clamp-2">
                        {brand.descripcion}
                    </p>
                    )*/}
                </div>
                
            </div>
            <div className="w-[40%]">
                <SearchBarBrand />
            </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="mx-auto space-y-6">
        {visibleSections.length === 0 && (
          <p className="text-sm text-gray-600">
            Aún no hay secciones configuradas para esta marca.
          </p>
        )}

        {visibleSections.map((perm) => {
          const SectionComp = SECTION_COMPONENTS[perm.nombre_permiso];
          if (!SectionComp) return null;
          return (
            <SectionComp
              key={perm.id || perm.nombre_permiso}
              brand={brand}
              permission={perm}
            />
          );
        })}

      </main>
      
    </div>
  );
}
