import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const FlagsHome = () => {
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const mapRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const handleUniversityClick = (tag) => {
    console.log('Clicked:', tag); // Debug log
    const initialTags = {
      "Universidad": [tag]
    };
    navigate('/library', {
      state: { selectedTags: initialTags },
      replace: true
    });
  };

  const resizeMap = () => {
    if (!mapRef.current || !imageRef.current) {
      console.log('Refs not ready:', { mapRef: !!mapRef.current, imageRef: !!imageRef.current }); // Debug log
      return;
    }

    const areas = mapRef.current.getElementsByTagName('area');
    const originalWidth = 1761;
    const currentWidth = imageRef.current.clientWidth;
    const scale = currentWidth / originalWidth;

    console.log('Resizing map:', { originalWidth, currentWidth, scale }); // Debug log

    Array.from(areas).forEach(area => {
      if (!area.dataset.originalCoords) {
        area.dataset.originalCoords = area.coords;
      }

      const originalCoords = area.dataset.originalCoords.split(',');
      const newCoords = originalCoords.map(coord => Math.round(parseInt(coord) * scale));
      area.coords = newCoords.join(',');
      
      console.log(`Area ${area.alt}:`, { original: area.dataset.originalCoords, new: area.coords }); // Debug log
    });
  };

  // Manejador para cuando la imagen carga
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageDimensions({
      width: imageRef.current.clientWidth,
      height: imageRef.current.clientHeight
    });
    resizeMap();
  };

  useEffect(() => {
    if (imageLoaded) {
      resizeMap();
    }
    window.addEventListener('resize', resizeMap);

    return () => {
      window.removeEventListener('resize', resizeMap);
    };
  }, [imageLoaded]);

  // Estilos en línea para debugging
  const debugStyles = {
    mapContainer: {
      position: 'relative',
      width: '100%',
    },
    debugInfo: {
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      zIndex: 1000,
      fontSize: '12px',
    }
  };

  return (
    <div id="fourth-home-section">
      {/* Debug info */}
      <div style={debugStyles.debugInfo}>
        <p>Image loaded: {imageLoaded.toString()}</p>
        <p>Width: {imageDimensions.width}</p>
        <p>Height: {imageDimensions.height}</p>
      </div>

      <h2>Aprende con las universidades líderes del mundo</h2>
      <div id="fourth-flags-upper">
        <img 
          src="/assets/Piezas/InternationalFlags.svg" 
          alt="International Universities Flags" 
          useMap="#world-universities-map"
          style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        />
        <map name="world-universities-map">
          {/* Areas for international universities */}
        </map>
      </div>

      <h2>y de habla hispana</h2>
      <div id="fourth-flags-lower" style={debugStyles.mapContainer}>
        <img 
          ref={imageRef}
          src="/assets/Piezas/LatamFlags.svg" 
          alt="Hispanic Universities Flags"
          useMap="#hispanic-universities-map"
          onLoad={handleImageLoad}
          style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        />
        <map name="hispanic-universities-map" ref={mapRef}>
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