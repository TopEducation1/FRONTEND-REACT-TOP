import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const FlagsHome = () => {
  const navigate = useNavigate();

  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);
  const mapRef1 = useRef(null);
  const mapRef2 = useRef(null);

  const [imagesLoaded, setImagesLoaded] = useState({
    img1: false,
    img2: false,
  });

  const handleUniversityClick = (tag) => {
    navigate(
      `/explora?Universidad=${encodeURIComponent(tag)}&idioma=es&idioma=en&page=1&page_size=16`,
      { replace: false }
    );
  };

  const resizeMap = (mapRef, imageRef, originalWidth) => {
    if (!mapRef.current || !imageRef.current) return;

    const areas = mapRef.current.getElementsByTagName("area");
    const currentWidth = imageRef.current.clientWidth;
    const scale = currentWidth / originalWidth;

    Array.from(areas).forEach((area) => {
      if (!area.dataset.originalCoords) {
        area.dataset.originalCoords = area.coords;
      }

      const originalCoords = area.dataset.originalCoords.split(",");
      const newCoords = originalCoords.map((coord) =>
        Math.round(parseInt(coord, 10) * scale)
      );

      area.coords = newCoords.join(",");
    });
  };

  const handleImageLoad = (imageNum) => {
    setImagesLoaded((prev) => ({
      ...prev,
      [imageNum]: true,
    }));
  };

  useEffect(() => {
    if (imagesLoaded.img1) {
      resizeMap(mapRef1, imageRef1, 192);
    }

    if (imagesLoaded.img2) {
      resizeMap(mapRef2, imageRef2, 1761);
    }

    const handleResize = () => {
      if (imagesLoaded.img1) {
        resizeMap(mapRef1, imageRef1, 192);
      }

      if (imagesLoaded.img2) {
        resizeMap(mapRef2, imageRef2, 1761);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imagesLoaded]);

  const internationalAreas = [
    ["0,23,53,50", "University of Michigan"],
    ["4,53,57,80", "Berklee College of Music"],
    ["15,77,68,104", "Peking University"],
    ["68,6,116,26", "Columbia University"],
    ["64,29,117,56", "Harvard University"],
    ["64,55,117,82", "Yale University"],
    ["64,82,117,109", "Stanford University"],
    ["138,9,191,36", "University of Toronto"],
    ["136,33,189,60", "University of Toronto"],
    ["125,64,178,91", "Massachusetts Institute of Technology"],
    ["118,89,171,116", "The University of Chicago"],
  ];

  const hispanicAreas = [
    ["0,56,499,285", "Universidad Anáhuac"],
    ["0,339,499,568", "Universidad de los Andes"],
    ["0,628,499,857", "Universidad Autónoma de Barcelona"],
    ["637,340,1136,569", "Pontificia Universidad Catolica de Chile"],
    ["633,623,1132,852", "Universitat de Barcelona"],
    ["634,915,1133,1144", "Universidad Nacional de Colombia"],
    ["1260,58,1759,287", "Universidad de Palermo"],
    ["1261,344,1760,573", "UNAM"],
    ["1251,628,1750,857", "Tecnológico de Monterrey"],
    ["636,55,1135,284", "IESE Business School"],
  ];

  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 md:py-28">
      <div className="pointer-events-none absolute left-[-120px] top-20 h-[340px] w-[340px] rounded-full bg-[#1941cf]/5 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-10 right-[-140px] h-[360px] w-[360px] rounded-full bg-[#5CC781]/8 blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <div className="mx-auto mb-14 max-w-[820px] text-center">
          <span className="mb-5 inline-flex rounded-full border border-black/10 bg-black px-5 py-2 font-['Montserrat'] text-[12px] font-bold uppercase tracking-[0.16em] text-[#1941cf] shadow-sm">
            Universidades líderes
          </span>

          <h2 className="font-['Montserrat'] text-[2.4rem] font-bold leading-[1.05em] tracking-[-0.05em] text-[#111111] md:text-[4rem]">
            Aprende con las universidades líderes del mundo
          </h2>

          <p className="mx-auto mt-5 max-w-[620px] font-['Montserrat'] text-[1rem] leading-[1.8em] text-neutral-600">
            Explora certificaciones creadas por instituciones reconocidas
            globalmente y encuentra nuevas rutas para tu crecimiento profesional.
          </p>
        </div>

        <div className="rounded-[32px] border border-black/10 bg-[#F8F7F4] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.06)] md:p-8">
          <div className="mx-auto max-w-[520px]">
            <img
              ref={imageRef1}
              src="/assets/Piezas/InternationalFlags.svg"
              alt="International Universities Flags"
              useMap="#world-universities-map"
              onLoad={() => handleImageLoad("img1")}
              className="block h-auto w-full select-none"
              draggable="false"
            />

            <map name="world-universities-map" ref={mapRef1}>
              {internationalAreas.map(([coords, name]) => (
                <area
                  key={`${name}-${coords}`}
                  shape="rect"
                  coords={coords}
                  alt={name}
                  title={name}
                  className="cursor-pointer"
                  onClick={() => handleUniversityClick(name)}
                />
              ))}
            </map>
          </div>
        </div>

        <div className="mx-auto my-14 max-w-[720px] text-center">
          <h3 className="font-['Montserrat'] text-[2rem] font-bold leading-[1.08em] tracking-[-0.04em] text-[#111111] md:text-[3.2rem]">
            y de habla hispana
          </h3>

          <p className="mx-auto mt-4 max-w-[560px] font-['Montserrat'] text-[1rem] leading-[1.8em] text-neutral-600">
            También puedes encontrar programas de universidades referentes en
            Latinoamérica y España.
          </p>
        </div>

        <div className="rounded-[32px] border border-black/10 bg-white p-4 shadow-[0_24px_80px_rgba(0,0,0,0.06)] md:p-8">
          <div className="overflow-x-auto pb-2" data-lenis-prevent>
            <div className="min-w-[760px] md:min-w-0">
              <img
                ref={imageRef2}
                src="/assets/Piezas/LatamFlags.svg"
                alt="Hispanic Universities Flags"
                useMap="#hispanic-universities-map"
                onLoad={() => handleImageLoad("img2")}
                className="block h-auto w-full select-none"
                draggable="false"
              />

              <map name="hispanic-universities-map" ref={mapRef2}>
                {hispanicAreas.map(([coords, name]) => (
                  <area
                    key={`${name}-${coords}`}
                    shape="rect"
                    coords={coords}
                    alt={name}
                    title={name}
                    className="cursor-pointer"
                    onClick={() => handleUniversityClick(name)}
                  />
                ))}
              </map>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
            <span className="font-['Montserrat'] text-xs font-medium text-neutral-500">
              Desliza horizontalmente para ver más universidades
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlagsHome;