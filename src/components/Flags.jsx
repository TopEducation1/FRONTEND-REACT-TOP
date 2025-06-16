import { useNavigate } from "react-router-dom";

const Flags = ({ direction, logos , onFlagSelect }) => {
  const navigate = useNavigate();

  const handleItemMenuClick = (category, tag) => {
        console.log(category, tag);

      const categoryParam = category; // asegura que esté en minúsculas
      const tagParam = encodeURIComponent(tag); // codifica y pone en minúscula

      const query = `${categoryParam}=${tagParam}&page=1&page_size=15`;
      navigate(`/explora/filter?${query}`);
    };

  const repeatLogos = Array(3).fill(logos).flat();

  <div className="carousel-container">
    <div className={`carousel-track ${direction}`}>
      {repeatLogos.map((logo, index) => (
        <a
          key={index}
          className="logo-item"
          href={logo.url}
          onClick={(e) => {
            e.preventDefault();
            handleItemMenuClick(logo.type,logo.company);
          }}
        >
          <img src={logo.img} alt={logo.alt} />
        </a>
      ))}
    </div>
  </div>;

  return (
    <div className="carousel-container">
      <div className={`carousel-track ${direction}`}>
        {logos.map((logo, index) => (
          <a
            key={`set1-${index}`}
            className="logo-item"
            href={logo.url}
            onClick={(e) => {
              e.preventDefault();
                handleItemMenuClick(logo.type,logo.company);
            }}
          >
            <img src={logo.img} alt={logo.alt} />
          </a>
        ))}

        {/* Segunda copia */}
        {logos.map((logo, index) => (
          <a
            key={`set2-${index}`}
            className="logo-item"
            href={logo.url}
            onClick={(e) => {
              e.preventDefault();
              handleItemMenuClick(logo.type,logo.company);
            }}
          >
            <img src={logo.img} alt={logo.alt} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Flags;
