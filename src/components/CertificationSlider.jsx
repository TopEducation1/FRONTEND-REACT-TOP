import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import masterclassGridFetcher from '../services/MasterclassGridFetcher';

const CertificationSlider = () => {
    const { slug: currentSlug } = useParams(); 
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [certifications, setCertifications] = useState([]);

  const amount = 9;

  const loadMasterclassData = useCallback(async () => {
    setLoading(true);
    try {
      const fetchData = await masterclassGridFetcher.getMasterclassGrid(amount);
      console.log("Datos recibidos:", fetchData);

        if (fetchData && Array.isArray(fetchData)) {
            const filtered = fetchData.filter(cert => cert.slug != currentSlug);
            const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, 9);
            setCertifications(shuffled);
        }
        else {
        setCertifications([]);
        setError('Invalid data form received');
      }
    } catch (error) {
        console.error("Error al cargar certificaciones:", error);

      setError('Error loading certifications');
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  }, [currentSlug]);

  useEffect(() => {
    loadMasterclassData();
  }, [loadMasterclassData]);

  const handleCertificationClick = (certification) => {
    try {
      if (!certification) throw new Error("No certification data provided");
      navigate(`/certificacion/${certification.slug}`);
    } catch (error) {
      setError("Error al navegar hacia la certificación");
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (loading) return <div>Cargando certificaciones...</div>;

  return (
    <div className="certification-slider">
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{
          0: { slidesPerView: 1 },       // 👈 Para móviles
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}

      >
        {certifications.map((cert, index) => (
          <SwiperSlide key={index}>
            <div className="cert-card" onClick={() => handleCertificationClick(cert)}>
              <img src={cert.universidad_certificacion?.univ_img || cert.empresa_certificacion?.empr_img || cert.imagen_final} alt={cert.nombre} />
              <div className='card-tit'><h3>{cert.nombre}</h3></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CertificationSlider;
