import React from 'react';
import { FaFacebook, FaWhatsapp, FaLinkedin, FaInstagram, FaLink } from 'react-icons/fa';

const openPopup = (url, name = 'share', w = 600, h = 550) => {
  const y = (window.top?.outerHeight ?? h) / 2 + (window.top?.screenY ?? 0) - (h / 2);
  const x = (window.top?.outerWidth ?? w) / 2 + (window.top?.screenX ?? 0) - (w / 2);
  window.open(url, name, `toolbar=0,status=0,width=${w},height=${h},top=${y},left=${x}`);
};

const ShareButtons = ({ url, title }) => {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || (typeof document !== 'undefined' ? document.title : '');

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const waUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('¡Enlace copiado al portapapeles!');
    } catch {
      const el = document.createElement('input');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const handleInstagramShare = async () => {
    // Web Share API: en móviles permitirá elegir Instagram si está instalada
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareTitle, url: shareUrl });
        return;
      } catch {
        // usuario canceló o falló — continúa con fallback
      }
    }
    // Fallback: copiamos el link y abrimos Instagram en otra pestaña
    await handleCopyLink();
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <button
        onClick={() => openPopup(fbUrl, 'fb-share')}
        title="Compartir en Facebook"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <FaFacebook size={24} color="#1877F2" />
      </button>

      <a href={waUrl} target="_blank" rel="noopener noreferrer" title="Compartir en WhatsApp">
        <FaWhatsapp size={24} color="#25D366" />
      </a>

      <button
        onClick={() => openPopup(liUrl, 'li-share')}
        title="Compartir en LinkedIn"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <FaLinkedin size={24} color="#0A66C2" />
      </button>

      <button
        onClick={handleInstagramShare}
        title="Compartir en Instagram"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <FaInstagram size={24} color="#E1306C" />
      </button>

      <button
        onClick={handleCopyLink}
        title="Copiar enlace"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <FaLink size={24} color="#555" />
      </button>
    </div>
  );
};

export default ShareButtons;
