import { useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
// Componente de el slider para las rutas del conocimiento
const RoutesComponent = ({ images,time,classSlider}) => {
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const scrollAmount = 145;
    const handleItemMenuClick = (category, tag) => {
        console.log(category, tag);
  
        const initialTags = {
            [category]: [tag]
        };
        navigate('/explora/filter?page=1&page_size=15&', {
            state: {selectedTags: initialTags},
            replace: true
        });
        // Redirigir a la página con los parámetros correspondientes
        //navigate(`/explora/filter/?category=${category}&tag=${tag}`);
    };
    
    useEffect(() => {
        const container = sliderRef.current;
        if (container) {
            container.scrollLeft += scrollAmount;
            if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
                container.scrollLeft = 0; // Volver al inicio
            }
        }
    }, []);
    
    return (
        <>
            <div className={`container-slider ${classSlider}`}>
                <button
                    className='slider-btn'
                    onClick={() => {
                        const container = sliderRef.current;
                        container.scrollLeft -= scrollAmount;
                        if (container.scrollLeft < 0) {
                            container.scrollLeft = container.scrollWidth - container.clientWidth; // Volver al final
                        }
                    }}  
                >
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#ffffff"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
                </button>
                <div className='images-container' ref={sliderRef}>
                    {images.map((image) => (
                        <a key={image?.id} onClick={() => handleItemMenuClick(image?.category, image?.link)}>
                            <img
                            className='image'
                            alt='sliderImage'
                            src={image?.url}
                            />
                            <div className='slider-text'>
                                <h3>{image?.title}</h3>
                                <p>{image?.desc}</p>
                            </div>
                        </a>
                    ))}
                </div>
                <button
                    className='slider-btn'
                    onClick={() => {
                        const container = sliderRef.current;
                        container.scrollLeft += scrollAmount;
                        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
                            container.scrollLeft = 0; // Volver al inicio
                        }
                    }}
    
                >
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#ffffff"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
                </button>
            </div>
        </>
    );
}

export default RoutesComponent;