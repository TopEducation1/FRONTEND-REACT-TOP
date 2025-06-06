import React from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
  FaLink,
} from 'react-icons/fa';

const ShareButtons = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    alert('¡Enlace copiado al portapapeles!');
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Compartir en Facebook"
      >
        <FaFacebook size={24} color="#3b5998" />
      </a>

      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Compartir en WhatsApp"
      >
        <FaWhatsapp size={24} color="#25D366" />
      </a>

      <a
        href={`https://www.instagram.com/`} // Instagram no permite compartir directo por URL
        target="_blank"
        rel="noopener noreferrer"
        title="Compartir en Instagram"
      >
        <FaInstagram size={24} color="#E1306C" />
      </a>

      <a
        href={`https://www.tiktok.com/`} // TikTok tampoco permite compartir directo por URL
        target="_blank"
        rel="noopener noreferrer"
        title="Compartir en TikTok"
      >
        <FaTiktok size={24} color="#000000" />
      </a>

      <button onClick={handleCopyLink} title="Copiar enlace" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <FaLink size={24} color="#555" />
      </button>
    </div>
  );
};

export default ShareButtons;
