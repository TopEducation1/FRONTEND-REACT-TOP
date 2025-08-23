import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlurText from "../components/BlurText";

import endpoints from '../config/api';

const TopList = () => {
  const { tipo } = useParams(); // ← esto capturará 'universidades' o 'empresas'
  const [selectedTags, setSelectedTags] = useState({});
  const [entidades, setEntidades] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    let url = "";

    if (tipo === "universidades") {
      url = endpoints.universities;
    } else if (tipo === "empresas") {
      url = endpoints.empresas;
    } else {
      return; // tipo no válido
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const habilitados = data.filter(ent => {
          if (tipo === "universidades") return ent.univ_est === "enabled";
          if (tipo === "empresas") return ent.empr_est === "enabled";
          return false;
        });

        // Ordenar por univ_top o empr_top
        const ordenados = habilitados.sort((a, b) => {
          const campoOrden = tipo === "universidades" ? "univ_top" : "empr_top";
          return (a[campoOrden] || Infinity) - (b[campoOrden] || Infinity);
        });

        setEntidades(ordenados);
      });
  }, [tipo]);

  function navigateWithTransition(path, options = {}) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(path, options);
      });
    } else {
      navigate(path, options);
    }
  }

  const handleItemMenuClick = (tagsObject) => {
    setSelectedTags((prevTags) => {
      const updatedTags = { ...prevTags };
      for (const [category, tag] of Object.entries(tagsObject)) {
        if (!updatedTags[category]) {
          updatedTags[category] = [tag];
        } else if (!updatedTags[category].includes(tag)) {
          updatedTags[category].push(tag);
        }
      }
      const queryParams = new URLSearchParams();
      for (const [cat, tags] of Object.entries(updatedTags)) {
        tags.forEach((tag) => queryParams.append(cat, tag));
      }
      navigateWithTransition(`/explora/filter?${queryParams.toString()}`, {
        replace: true,
        state: { selectedTags: updatedTags },
      });
      return updatedTags;
    });
  };

  const handleAnimationComplete = () => {
  console.log('Animation completed!');
};
  const getTitulo = () => {
    if (tipo === "universidades") return "Universidades";
    if (tipo === "empresas") return "Empresas";
    return "Top Entidades";
  };

  const tipoSingularCapitalizado = tipo === "universidades" ? "Universidad" : "Empresa";

  const destacados = entidades.slice(0, 4);
  const resto = entidades.slice(4);

  return (
    <section className="wrapper">
      <div className="container m-auto pt-30">
        <h1 className="text-5xl text-center text-[#F6F4EF] mb-6">Lo más <span className="top-italic">top</span> de<br></br>
        <BlurText
            text={getTitulo()}
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-[5rem]"
          />
        </h1>

        {/* 🔹 Sección destacada */}
        {destacados.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {destacados.map((ent) => (
              <div
                key={ent.id}
                onClick={() =>
                  handleItemMenuClick({
                    [tipoSingularCapitalizado]: ent.nombre,
                  })
                }
                className="rounded-xl px-5 py-4 flex flex-col items-center text-center md:bg-gradient-to-t from-[#F6F4EF]/30 to-[#F6F4EF] hover:shadow-md hover:bg-[#F6F4EF] hover:shadow-[0px_0px_5px_3px_#F6F4EF] transition cursor-pointer hover:scale-105 duration-200"
              >
                <img src={ent.univ_img || ent.empr_img} className="w-[80%] object-contain" alt="" />
                {/*<h2 className="text-lg font-bold leading-[1em]">{ent.nombre}</h2>*/}
                <span className="mt-2 inline-flex items-center rounded-full bg-[#F6F4EF]/80 px-4 py-[2px] mt-[-5px] text-[0.8rem] md:text-[1.5rem] text-[#0F090B] font-medium ">
                  {ent.total_certificaciones} Certificaciones
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 🔹 Resto de entidades */}
        <div className="grid grid-cols-2 lg:grid-cols-3 md:grid-cols-2 gap-1 lg:gap-3">
          {resto.map((ent) => (
            <div
              key={ent.id}
              onClick={() =>
                handleItemMenuClick({
                  [tipoSingularCapitalizado]: ent.nombre,
                })
              }
              className="rounded-xl px-2 md:px-5 py-2 flex items-center gap-1 lg:gap-2 shadow hover:shadow-md transition cursor-pointer hover:bg-[#1c1c1c]/80"
            >
              <div className="w-[20%]">
                <img src={ent.univ_ico || ent.empr_ico} className="w-full" alt="" />
              </div>
              <div className="w-[80%]">
                <h2 className="text-[1.2rem] font-semibold text-white leading-[1.2rem]">{ent.nombre}</h2>
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-[#F6F4EF] px-2 py-[2px] text-[.8rem] font-medium text-[#0F090B] ">
                    {ent.total_certificaciones} Certificaciones
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopList;
