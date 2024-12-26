import React, { useEffect, useRef } from 'react';

const AnimatedCarousel = () => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (wrapperRef.current) {
      const wrapper = wrapperRef.current;
      const totalWidth = wrapper.scrollWidth;
      const animationDuration = totalWidth / 100; 
      wrapper.style.animationDuration = `${animationDuration}s`;
    }
  }, []);

  return (
    <div className="carousel-container">
      <div 
        ref={wrapperRef}
        className="carousel-wrapper"
        style={{
          animation: 'move-left linear infinite',
          display: 'flex',
          flexWrap: 'nowrap'
        }}
      >
        
        <a class="a-image" href="https://www.top.education/certificaciones/empresa/big-interview">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/844d70cd-c9d8-4ac1-b4dd-1ba134386729/1.png?content-type=image%2Fpng" class="carousel-image" alt="Big interview"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/ubits">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/c2b7f9fc-a1bd-4baa-9a96-d6528bd8cee5/2.png?content-type=image%2Fpng" class="carousel-image" alt="UBITS"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/hubspot-academy">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/a0e3e552-3a13-4bf0-992e-45fa19a3d3bd/3.png?content-type=image%2Fpng" class="carousel-image" alt="Hubspot Academy"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/microsoft">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/795bf7a7-52b5-42f2-b615-5b6acc23d6b3/4.png?content-type=image%2Fpng" class="carousel-image" alt="Microsoft"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/sv-academy">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/74c6368f-1eb2-45e8-9103-12372e9e6608/5.png?content-type=image%2Fpng" class="carousel-image" alt="SV Academy"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/pathstream">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/5a4b93b0-c2cf-4f31-8b94-b37a4b04d82a/6.png?content-type=image%2Fpng" class="carousel-image" alt="Pathstream"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/salesforce">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/7601eb5d-9ac1-41c4-82c7-a20488dced2c/7.png?content-type=image%2Fpng" class="carousel-image" alt="Salesforce"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/google">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/d81692e0-100b-4072-ab2f-d9d651c63743/8.png?content-type=image%2Fpng" class="carousel-image" alt="Google"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/the-museum-of-modern-art">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/6172a009-b534-4e63-8411-0225e403248c/9.png?content-type=image%2Fpng" class="carousel-image" alt="MoMA"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/yad-vashem">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/bbfbb000-c051-4fda-9893-3e962c23616d/10.png?content-type=image%2Fpng" class="carousel-image" alt="Yad Vashem"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/banco-interamericano-de-desarrollo">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/995e0524-aecc-4840-bbc3-8dbb3046a0be/11.png?content-type=image%2Fpng" class="carousel-image" alt="BID"/>
          </a>
          
          <a class="a-image" href="">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/4ed2514f-f8f1-41b1-bbe3-410b55eecd05/12.png?content-type=image%2Fpng" class="carousel-image" alt="Pathstream"/>
          </a>
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/big-interview">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/844d70cd-c9d8-4ac1-b4dd-1ba134386729/1.png?content-type=image%2Fpng" class="carousel-image" alt="Big interview"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/ubits">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/c2b7f9fc-a1bd-4baa-9a96-d6528bd8cee5/2.png?content-type=image%2Fpng" class="carousel-image" alt="UBITS"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/hubspot-academy">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/a0e3e552-3a13-4bf0-992e-45fa19a3d3bd/3.png?content-type=image%2Fpng" class="carousel-image" alt="Hubspot Academy"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/microsoft">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/795bf7a7-52b5-42f2-b615-5b6acc23d6b3/4.png?content-type=image%2Fpng" class="carousel-image" alt="Microsoft"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/sv-academy">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/74c6368f-1eb2-45e8-9103-12372e9e6608/5.png?content-type=image%2Fpng" class="carousel-image" alt="SV Academy"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/pathstream">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/5a4b93b0-c2cf-4f31-8b94-b37a4b04d82a/6.png?content-type=image%2Fpng" class="carousel-image" alt="Pathstream"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/salesforce">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/7601eb5d-9ac1-41c4-82c7-a20488dced2c/7.png?content-type=image%2Fpng" class="carousel-image" alt="Salesforce"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/google">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/d81692e0-100b-4072-ab2f-d9d651c63743/8.png?content-type=image%2Fpng" class="carousel-image" alt="Google"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/the-museum-of-modern-art">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/6172a009-b534-4e63-8411-0225e403248c/9.png?content-type=image%2Fpng" class="carousel-image" alt="MoMA"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/yad-vashem">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/bbfbb000-c051-4fda-9893-3e962c23616d/10.png?content-type=image%2Fpng" class="carousel-image" alt="Yad Vashem"/>
          </a>
          
          <a class="a-image" href="https://www.top.education/certificaciones/empresa/banco-interamericano-de-desarrollo">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/995e0524-aecc-4840-bbc3-8dbb3046a0be/11.png?content-type=image%2Fpng" class="carousel-image" alt="BID"/>
          </a>
          
          <a class="a-image" href="">
            <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/4ed2514f-f8f1-41b1-bbe3-410b55eecd05/12.png?content-type=image%2Fpng" class="carousel-image" alt="Pathstream"/>
          </a>      </div>
    </div>
  );
};

export default AnimatedCarousel;