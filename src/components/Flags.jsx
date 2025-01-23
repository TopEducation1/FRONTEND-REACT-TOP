import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Flags = ({ direction = 'left', onFlagSelect }) => {
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const handleLogoClick = (company) => {
    const initialTags = {
      "Empresa": [company]
    };

    navigate('/library', {
      state: { selectedTags: initialTags },
      replace: true
    });
  };

  const logos = [
    { url: "https://www.top.education/certificaciones/empresa/big-interview", img: "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/844d70cd-c9d8-4ac1-b4dd-1ba134386729/1.png", alt: "Big interview", company: "Big Interview" },
    { url: "https://www.top.education/certificaciones/empresa/ubits", img: "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/c2b7f9fc-a1bd-4baa-9a96-d6528bd8cee5/2.png", alt: "UBITS", company: "UBITS" },
    { url: "https://www.top.education/certificaciones/empresa/hubspot-academy", img: "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/a0e3e552-3a13-4bf0-992e-45fa19a3d3bd/3.png", alt: "Hubspot Academy", company: "HubSpot Academy" },
    { url: "https://www.top.education/certificaciones/empresa/microsoft", img: "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/795bf7a7-52b5-42f2-b615-5b6acc23d6b3/4.png", alt: "Microsoft", company: "Microsoft" },
    { url: "https://www.top.education/certificaciones/empresa/sv-academy", img: "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/74c6368f-1eb2-45e8-9103-12372e9e6608/5.png", alt: "SV Academy", company: "SV Academy" },
    { url: "https://www.top.education/certificaciones/empresa/pathstream", img: "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/5a4b93b0-c2cf-4f31-8b94-b37a4b04d82a/6.png", alt: "Pathstream", company: "Pathstream" },
    { url: "https://www.top.education/certificaciones/empresa/salesforce", img: "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/7601eb5d-9ac1-41c4-82c7-a20488dced2c/7.png", alt: "Salesforce", company: "Salesforce" },
    { url: "https://www.top.education/certificaciones/empresa/google", img: "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/d81692e0-100b-4072-ab2f-d9d651c63743/8.png", alt: "Google", company: "Google" },
    { url: "https://www.top.education/certificaciones/empresa/the-museum-of-modern-art", img: "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/6172a009-b534-4e63-8411-0225e403248c/9.png", alt: "MoMA", company: "MoMA" },
    { url: "https://www.top.education/certificaciones/empresa/yad-vashem", img: "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/bbfbb000-c051-4fda-9893-3e962c23616d/10.png", alt: "Yad Vashem", company: "Yad Vashem" },
    { url: "https://www.top.education/certificaciones/empresa/banco-interamericano-de-desarrollo", img: "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/995e0524-aecc-4840-bbc3-8dbb3046a0be/11.png", alt: "BID", company: "Banco Interamericano de Desarrollo" },
    { url: "", img: "https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/4ed2514f-f8f1-41b1-bbe3-410b55eecd05/12.png", alt: "Pathstream", company: "Pathstream" },
  ];

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
          if (onFlagSelect) {
            onFlagSelect("empresas", logo.company);
          } else {
            handleLogoClick(logo.company);
          }
        }}
      >
        <img src={logo.img} alt={logo.alt} />
      </a>
    ))}
  </div>
</div>


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
              if (onFlagSelect) {
                onFlagSelect("empresas", logo.company);
              } else {
                handleLogoClick(logo.company);
              }
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
              if (onFlagSelect) {
                onFlagSelect("empresas", logo.company);
              } else {
                handleLogoClick(logo.company);
              }
            }}
          >
            <img src={logo.img} alt={logo.alt} />
          </a>
        ))}
      </div>
      <style jsx>{`
  .carousel-container {
    width: 100%;
    height: 200px; /* Ajusta según tu preferencia */
    overflow: hidden;
    position: relative;
  }

  .carousel-track {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: max-content;
    height: 100%;
    animation: scroll 40s linear infinite;
  }

  .carousel-track.right {
    animation-direction: reverse;
  }

  .logo-item {
    flex: 0 0 auto; /* Asegura que cada logo tenga un ancho adaptable */
    width: 200px; /* Ajusta el ancho según tus necesidades */
    height: auto; /* Ajusta la altura aquí */
    margin: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .logo-item img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain; 
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  @media (max-width: 768px) {
    .logo-item {
      width: 150px; /* Ajusta para móviles */
      height: 120px;
    }

    .carousel-container {
      height: 120px;
    }
  }
`}</style>

    </div>
  );
};

export default Flags;