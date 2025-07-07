import React from 'react'

export default function LoMasTop() {
  return (
    <div className="text-white min-h-screen font-sans">

      {/* Hero Section */}
      <section className="text-center py-50 px-6 md:px-16 py-12 h-[80vh] ">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Encuentra tu curso ideal
        </h2>
        <input
          type="text"
          placeholder="Buscar entre miles de cursos..."
          className="w-full max-w-xl px-4 py-2 rounded-lg text-black mb-4"
        />
        <p className="text-sm text-gray-400 mb-2">O explora por categoría o institución</p>
        <div className="flex flex-wrap justify-center gap-2 text-xs mt-4">
          {['Certificados', 'Google', 'Amazon', 'Desarrollo Personal', 'Programación', 'Negocios', 'Marketing', 'IA'].map((tag, idx) => (
            <span key={idx} className="bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-700 cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Proveedores / Universidades / Instituciones */}
      <section className=" py-12 px-6 md:px-16">
        <h3 className="text-2xl font-semibold text-center mb-10">
          Encuentra los mejores cursos, donde sea que estén
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          {/* Universidades */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-purple-400">1300+ Universidades</h4>
            <ul className="space-y-1 text-gray-300">
              {['Harvard', 'Stanford', 'MIT', 'Oxford', 'Cornell', 'U. Michigan', 'Duke', 'Open University'].map((uni, i) => (
                <li key={i}>🏫 {uni}</li>
              ))}
            </ul>
            <button className="mt-4 text-purple-400 hover:underline">Ver universidades →</button>
          </div>

          {/* Proveedores */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-purple-400">85 Proveedores</h4>
            <ul className="space-y-1 text-gray-300">
              {['Coursera', 'edX', 'Udemy', 'FutureLearn', 'Skillshare', 'LinkedIn Learning'].map((prov, i) => (
                <li key={i}>📦 {prov}</li>
              ))}
            </ul>
            <button className="mt-4 text-purple-400 hover:underline">Ver proveedores →</button>
          </div>

          {/* Instituciones */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-purple-400">1700+ Instituciones</h4>
            <ul className="space-y-1 text-gray-300">
              {['Google', 'Microsoft', 'Amazon', 'IBM', 'ONU', 'Smithsonian'].map((inst, i) => (
                <li key={i}>🏢 {inst}</li>
              ))}
            </ul>
            <button className="mt-4 text-purple-400 hover:underline">Ver instituciones →</button>
          </div>
        </div>
      </section>

      {/* Rankings Section */}
      <section className="py-12 px-6 md:px-16 text-center">
        <h3 className="text-2xl font-bold text-orange-400 mb-2">🏆 Rankings</h3>
        <p className="text-gray-300 mb-8">
          Más de 250,000 reseñas escritas por usuarios te ayudan a elegir los mejores cursos.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="bg-orange-600 p-6 rounded-xl w-64 hover:scale-105 transition">
            <h4 className="text-lg font-bold mb-2">⭐ Los Mejores Cursos</h4>
            <p className="text-sm text-white">De todos los tiempos</p>
          </div>
          <div className="bg-blue-700 p-6 rounded-xl w-64 hover:scale-105 transition">
            <h4 className="text-lg font-bold mb-2">🔥 Más Populares</h4>
            <p className="text-sm text-white">2025</p>
          </div>
        </div>

        <button className="mt-6 text-orange-400 hover:underline">
          Ver todos los rankings →
        </button>
      </section>
    </div>
  )
}
