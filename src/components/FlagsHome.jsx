import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const FlagsHome = () => {
  const navigate = useNavigate();
  // Referencias para ambas imágenes y mapas
  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);
  const mapRef1 = useRef(null);
  const mapRef2 = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState({ img1: false, img2: false });


  const handleUniversityClick = (tag) => {
    //console.log('Clicked:', tag);
    const initialTags = {
      "Universidad": [tag]
    };

    navigate('/explora', {
      state: { selectedTags: initialTags },
      replace: true
    });

    window.scrollTo(0,0);

  };

  const resizeMap = (mapRef, imageRef, originalWidth) => {
    if (!mapRef.current || !imageRef.current) return;

    const areas = mapRef.current.getElementsByTagName('area');
    const currentWidth = imageRef.current.clientWidth;
    const scale = currentWidth / originalWidth;

    //console.log('Resizing map:', { originalWidth, currentWidth, scale });

    Array.from(areas).forEach(area => {

      if (!area.dataset.originalCoords) {
        area.dataset.originalCoords = area.coords;
      }

      const originalCoords = area.dataset.originalCoords.split(',');
      const newCoords = originalCoords.map(coord => Math.round(parseInt(coord) * scale));
      area.coords = newCoords.join(',');
    });
  };

  const handleImageLoad = (imageNum) => {

    setImagesLoaded(prev => ({
      ...prev,
      [imageNum]: true
    }));

  };

  useEffect(() => {

    if (imagesLoaded.img1) {
      resizeMap(mapRef1, imageRef1, 192); // Ancho original de la primera imagen
    }

    if (imagesLoaded.img2) {
      resizeMap(mapRef2, imageRef2, 1761); // Ancho original de la segunda imagen
    }

    const handleResize = () => {

      if (imagesLoaded.img1) {
        resizeMap(mapRef1, imageRef1, 1920);
      }
      if (imagesLoaded.img2) {
        resizeMap(mapRef2, imageRef2, 1761);
      }
      
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded]);


  return (
    <div id="fourth-home-section">
      <h2>Aprende con las universidades líderes del mundo</h2>
      <div id="fourth-flags-upper">
        <img 
            ref={imageRef1}
          src="/assets/Piezas/InternationalFlags.svg" 
          alt="International Universities Flags" 
          useMap="#world-universities-map"
          onLoad={() => handleImageLoad('img1')}
          style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        />
        <map name="world-universities-map" ref={mapRef1}>
        <area 
            shape="rect" 
            coords="0,23,53,50" 
            alt="University of Michigan"
            onClick={() => handleUniversityClick("University of Michigan")}
            title="University of Michigan"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover
          />
          <area 
            shape="rect" 
            coords="4,53,57,80" 
            alt="Berklee College of Music"
            onClick={() => handleUniversityClick("Berklee College of Music")}
            title="Berklee College of Music"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover
          />
          <area 
            shape="rect" 
            coords="15,77,68,104" 
            alt="Peking University"
            onClick={() => handleUniversityClick("Peking University")}
            title="Peking University"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover
          />
          <area 
            shape="rect" 
            coords="68,6,116,26" 
            alt="Columbia University"
            onClick={() => handleUniversityClick("Columbia University")}
            title="Columbia University"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover
          />
          <area 
            shape="rect" 
            coords="64,29,117,56" 
            alt="Harvard University"
            onClick={() => handleUniversityClick("Harvard University")}
            title="Harvard University"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover
          />
          <area 
            shape="rect" 
            coords="64,55,117,82" 
            alt="Yale University"
            onClick={() => handleUniversityClick("Yale University")}
            title="Yale University"
            on
            MouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover
          />
          <area 
            shape="rect" 
            coords="64,82,117,109" 
            alt="Stanford University"
            onClick={() => handleUniversityClick("Stanford University")}
            title="Stanford University"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover
          />
          <area 
            shape="rect" 
            coords="138,9,191,36" 
            alt="University of Toronto"
            onClick={() => handleUniversityClick("University of Toronto")}
            title="University of Toronto"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover
          />
          <area 
            shape="rect" 
            coords="136,33,189,60" 
            alt="University of Toronto"
            onClick={() => handleUniversityClick("University of Toronto")}
            title="University of Toronto"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover
          />
          <area 
            shape="rect" 
            coords="125,64,178,91" 
            alt="Massachusetts Institute of Technology"
            onClick={() => handleUniversityClick("Massachusetts Institute of Technology")}
            title="Massachusetts Institute of Technology"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover
          />
          <area 
            shape="rect" 
            coords="118,89,171,116" 
            alt="The University of Chicago"
            onClick={() => handleUniversityClick("The University of Chicago")}
            title="The University of Chicago"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover
          />
        </map>
      </div>

      <h2>y de habla hispana</h2>
      <div id="fourth-flags-lower" >
        <img 
          ref={imageRef2}
          src="/assets/Piezas/LatamFlags.svg" 
          alt="Hispanic Universities Flags"
          useMap="#hispanic-universities-map"
          onLoad={() => handleImageLoad('img2')}
          style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        />
        <map name="hispanic-universities-map" ref={mapRef2}>
          {/* Mantén tus areas existentes */}
          <area 
            shape="rect" 
            coords="0,56,499,285" 
            alt="Universidad Anáhuac"
            onClick={() => handleUniversityClick("Universidad Anáhuac")}
            title="Universidad Anáhuac"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover
          />
          <area 
            shape="rect" 
            coords="0,339,499,568" 
            alt="Universidad de los Andes"
            onClick={() => handleUniversityClick("Universidad de los Andes")}
            title="Universidad de los Andes"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover

          />
          <area 
            shape="rect" 
            coords="0,628,499,857" 
            alt="Universidad Autónoma de Barcelona"
            onClick={() => handleUniversityClick("Universidad Autónoma de Barcelona")}
            title="Universidad Autónoma de Barcelona"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover

          />
          <area 
            shape="rect" 
            coords="1136,569,637,340 "
            alt="Pontificia Universidad Catolica de Chile"
            onClick={() => handleUniversityClick("Pontificia Universidad Catolica de Chile")}
            title="Pontificia Universidad Catolica de Chile"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover

          />
          <area 
            shape="rect" 
            coords="633,623,1132,852" 
            alt="Universitat de Barcelona"
            onClick={() => handleUniversityClick("Universitat de Barcelona")}
            title="Universitat de Barcelona"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover

          />
          <area 
            shape="rect" 
            coords="634,915,1133,1144" 
            alt="Universidad Nacional de Colombia"
            onClick={() => handleUniversityClick("Universidad Nacional de Colombia")}
            title="Universidad Nacional de Colombia"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover

          />
          <area 
            shape="rect" 
            coords="1260,58,1759,287" 
            alt="Universidad de Palermo"
            onClick={() => handleUniversityClick("Universidad de Palermo")}
            title="Universidad de Palermo"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover

          />
          <area 
            shape="rect" 
            coords="1261,344,1760,573" 
            alt="UNAM"
            onClick={() => handleUniversityClick("UNAM")}
            title="UNAM"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover

          />
          <area 
            shape="rect" 
            coords="1251,628,1750,857" 
            alt="Tecnológico de Monterrey"
            onClick={() => handleUniversityClick("Tecnológico de Monterrey")}
            title="Tecnológico de Monterrey"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover

          />
          <area 
            shape="rect" 
            coords="1135,284,636,55" 
            alt="IESE Business School"
            onClick={() => handleUniversityClick("IESE Business School")}
            title="IESE Business School"
            onMouseEnter={(e) => console.log('Hover:', e.target.alt)} // Debug hover

          />
        </map>
      </div>

      <style>
        {`
          area {
            cursor: pointer !important;
          }
          
          area:hover {
            outline: 2px solid red !important;
            background: rgba(255,0,0,0.3) !important;
          }
          
          img[useMap] {
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
          }
        `}
      </style>
    </div>
  );
};

export default FlagsHome;