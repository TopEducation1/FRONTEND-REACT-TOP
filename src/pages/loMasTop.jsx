import React from 'react'
import { Helmet } from "react-helmet";
import AnimatedCounter from "../components/AnimatedCounter";
import BlogsGrid from "../components/BlogsGrid";

export default function LoMasTop() {
  return (
    <>
      {/**SEO ELEMENTS WITH REACT -HELMET */}
      <Helmet>
          <title>Lo más top! | Top.education</title>
          <meta name="description" content="Descubre ebooks y blogs exclusivos de Top.education. Accede a contenido valioso para potenciar tu conocimiento y alcanzar tus metas personales y profesionales." />
          <meta property="og:title" content="Top Education | Aprende con edX, Coursera y MasterClass" />
          <meta name="author" content="Top Education" />
          <meta name="robots" content="index, follow" />
          <meta property="og:description" content="Descubre ebooks y blogs exclusivos de Top Education. Accede a contenido valioso para potenciar tu conocimiento y alcanzar tus metas personales y profesionales." />
          <meta property="og:type" content="website" />
      </Helmet>
      <section className="wrapper h-[80vh] w-full flex justify-center items-center bg-gradient-to-t from-[#1c1c1c] to-transparent">
        <div className="container m-auto mx-auto gap-2  sect-h-pequ">
            <div className='m-auto max-w-[50vw] pt-50'>
                <h1 className="text-[#F6F4EF] text-7xl font-normal font-[Lora] text-center leading-[1em] z-10 relative sm:text-6xl md:text-6xl lg:text-6xl xl:text-8xl">Lo más <span className='top-italic'>Top!</span></h1>
                <p className="mt-5 text-[2.125rem] text-[#F6F4EF]  text-center z-10 relative"> Encuentra tu próxima certificación</p>
                <p className="mt-5 text-[1.125rem] text-[#a8a8a8] text-center z-10 relative">
                  Explora los programas más demandados, descubre las mejores oportunidades de formación y mantente al día con todo lo que necesitas para avanzar en tu carrera.
                </p>                        
            </div>
            <div className='text-center px-6 md:px-16 mt-20 mb-[-130px]'>
              <input
                type="text"
                placeholder="Buscar entre miles de certificaciones..."
                className="w-full max-w-xl px-4 py-2 rounded-full text-black mb-4"
              />
              <p className="text-sm text-[#F6F4EF] mb-2"> Busca por tema, habilidad, universidad o institución
</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs mt-4">
                {['Certificados', 'Google', 'Amazon', 'Desarrollo Personal', 'Programación', 'Negocios', 'Marketing', 'IA'].map((tag, idx) => (
                  <span key={idx} className="bg-[#F6F4EF] px-3 py-1 rounded-full hover:bg-neutral-400 cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* Proveedores / Universidades / Instituciones */}
      <section className="wrapper mt-30">
        <div className='m-auto container'>
          <h3 className="text-2xl font-semibold text-center mb-10">
            Encuentra los mejores cursos, donde sea que estén
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {/* Universidades */}
            <div>
              <h4 className="text-[2rem] font-semibold mb-3 text-[#F6F4EF]"> <AnimatedCounter end={100} title="Universidades" /></h4>
              <ul className="space-y-1 text-gray-300">
                {['Harvard', 'Stanford', 'MIT', 'Oxford', 'Cornell', 'U. Michigan', 'Duke', 'Open University'].map((uni, i) => (
                  <li key={i}>🏫 {uni}</li>
                ))}
              </ul>
              <button className="mt-4 text-[#F6F4EF] hover:underline">Ver universidades →</button>
            </div>

            {/* Instituciones */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-[#F6F4EF]"><AnimatedCounter end={40} title="Instituciones" /></h4>
              <ul className="space-y-1 text-gray-300">
                {['Google', 'Microsoft', 'Amazon', 'IBM', 'ONU', 'Smithsonian'].map((inst, i) => (
                  <li key={i}>🏢 {inst}</li>
                ))}
              </ul>
              <button className="mt-4 text-[#F6F4EF] hover:underline">Ver instituciones →</button>
            </div>
        </div>
        </div>
        
      </section>

      {/* Rankings Section */}
      <section className="py-12 px-6 md:px-16 text-center">
        <h3 className="text-[4rem] font-bold text-[#F6F4EF] top-italic mb-2">Rankings de lo más Top!</h3>
        <p className="text-gray-300 mb-8">
          Más de 250,000 reseñas escritas por usuarios te ayudan a elegir los mejores cursos.
        </p>

        <div className="flex flex-col md:flex-row justify-center mt-10 items-center gap-6">
          <div className="bg-[#5CC781] p-4 rounded-xl flex w-[30%] hover:scale-105 transition">
            <div className='w-[40%]'>
              <img src="/assets/category/top-rankings.webp" className='!w-full mt-[-30px] ml-[-30px] mr-[-50px]' alt="" />
            </div>
            <div className='w-[60%] text-left'>
                <h4 className="text-[1.5rem]  font-bold leading-[1.2em]  mb-2">Las 50 Universidades<br></br> <span className='text-[2.75rem]'>más Top!</span></h4>
                <p className="text-[1rem] text-[#F6F4EF]">De todos los tiempos</p>
            </div>
          </div>
          <div className="bg-[#034694] p-4 rounded-xl flex w-[30%] hover:scale-105 transition">
            <div className='w-[35%]'>
              <img src="/assets/category/top-ranking-cert.webp" className='!w-full mt-[-50px] ml-[-20px]' alt="" />
            </div>
            <div className='w-[65%] text-left flex flex-wrap items-center'>
              <div>
                <h4 className="text-[1.2rem] text-[#F6F4EF]  font-bold leading-[1.2em] ">100 de las Certificaciones<br></br> <span className='text-[2.2rem]'>Más Populares</span></h4>
                <p className="text-[1rem] text-[#F6F4EF]">del año 2025</p>
              </div> 
            </div>
          </div>   
        </div>
      </section>
      <section className="wrapper">
          <div className="container m-auto">
              <BlogsGrid/>
          </div>
      </section>

    </>
  )
}
