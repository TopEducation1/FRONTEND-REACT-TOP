import { useNavigate } from 'react-router-dom';

const FlagsHome = () => {
  const navigate = useNavigate();

  const handleUniversityClick = (tag) => {
    const initialTags = {
      "Universidad": [tag]
    };
    
    navigate('/library', {
      state: { selectedTags: initialTags },
      replace: true
    });
  };

  return (
    <div id="fourth-home-section">
      <h2>Aprende con las universidades líderes del mundo</h2>
      <div id="fourth-flags-upper">
        <img 
          src="/assets/Piezas/InternationalFlags.svg" 
          alt="International Universities Flags" 
          useMap="#world-universities-map"
        />
        <map name="world-universities-map">
          {/* Ejemplo de áreas - ajusta las coordenadas según tu imagen */}
          <area 
            shape="rect" 
            coords="0,0,100,50" 
            alt="University of Toronto"
            onClick={() => handleUniversityClick("University of Toronto")}
            title="University of Toronto"
          />
          <area 
            shape="rect" 
            coords="110,0,210,50" 
            alt="University of Michigan"
            onClick={() => handleUniversityClick("University of Michigan")}
            title="University of Michigan"
          />
          {/* Añade más áreas según necesites */}
        </map>
      </div>

      <h2>y de habla hispana</h2>
      <div id="fourth-flags-lower">
        <img 
          src="/assets/Piezas/LatamFlags.svg" 
          alt="Hispanic Universities Flags"
          useMap="#hispanic-universities-map"
        />
        <map name="hispanic-universities-map">
          {/* Ejemplo de áreas - ajusta las coordenadas según tu imagen */}
          <area 
            shape="rect" 
            coords="499,285,0,56" 
            alt="Universidad Anáhuac"
            onClick={() => handleUniversityClick("Universidad Anáhuac")}
            title="Universidad Anáhuac"
          />
          <area 
            shape="rect" 
            coords="499,568,0,339" 
            alt="Universidad de los Andes"
            onClick={() => handleUniversityClick("Universidad de los Andes")}
            title="Universidad de los Andes"
          />
          <area 
            shape="rect" 
            coords="499,857,0,628" 
            alt="Universidad Autónoma de Barcelona"
            onClick={() => handleUniversityClick("Universidad Autónoma de Barcelona")}
            title="Universidad Autónoma de Barcelona"
          />
          <area 
            shape="rect" 
            coords="1130,283,631,54" 
            alt="Pontificia Universidad Catolica de Chile"
            onClick={() => handleUniversityClick("Pontificia Universidad Catolica de Chile")}
            title="Pontificia Universidad Catolica de Chile"
          />
          <area 
            shape="rect" 
            coords="1132,852,633,623" 
            alt="Universitat de Barcelona"
            onClick={() => handleUniversityClick("Universitat de Barcelona")}
            title="Universitat de Barcelona"
          />
          <area 
            shape="rect" 
            coords="1133,1144,634,915" 
            alt="Universidad Nacional de Colombia"
            onClick={() => handleUniversityClick("Universidad Nacional de Colombia")}
            title="Universidad Nacional de Colombia"
          />
          <area 
            shape="rect" 
            coords="1759,287,1260,58" 
            alt="Universidad de Palermo"
            onClick={() => handleUniversityClick("Universidad de Palermo")}
            title="Universidad de Palermo"
          />
          <area 
            shape="rect" 
            coords="1760,573,1261,344" 
            alt="UNAM"
            onClick={() => handleUniversityClick("UNAM")}
            title="UNAM"
          />
          <area 
            shape="rect" 
            coords="1750,857,1251,628" 
            alt="Tecnológico de Monterrey"
            onClick={() => handleUniversityClick("Tecnológico de Monterrey")}
            title="Tecnológico de Monterrey"
          />
        </map>
      </div>
    </div>
  );
};

export default FlagsHome;