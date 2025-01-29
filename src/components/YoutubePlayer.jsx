import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import getCertificationById from "../services/getCertificationById";
import RightPop from "../components/RightPop";

// Nuevo componente YouTubePlayer
const YouTubePlayer = ({ url }) => {
    const getEmbedUrl = (url) => {
        if (!url) return '';
        
        let videoId = '';
        
        // Manejar diferentes formatos de URL de YouTube
        if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('embed/')) {
            videoId = url.split('embed/')[1].split('?')[0];
        }
        
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    return (
        <iframe
            src={getEmbedUrl(url)}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            
        />
    );
};

export default YouTubePlayer;