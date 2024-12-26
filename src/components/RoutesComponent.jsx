import { useRef, useState } from 'react';

// Componente de el slider para las rutas del conocimiento
const RoutesComponent = () => {

    const sliderRef = useRef(null);
    const scrollAmount = 400;
    const images = [
        {
            id: 1,
            url: "assets/SliderImages/1.png"
        },
        {
            id: 2,
            url: "assets/SliderImages/2.png"
        },
        {
            id: 3,
            url: "assets/SliderImages/3.png"
        },
        {
            id: 4,
            url: "assets/SliderImages/4.png"
        },
        {
            id: 5,
            url: "assets/SliderImages/5.png"
        },
        {
            id: 6,
            url: "assets/SliderImages/6.png"
        },
        {
            id: 7,
            url:"assets/SliderImages/7.png"
        }
    ]

    return (
        <>
            <div className="container-title-search">
                <h2>¿Encontraste lo que estabas buscando?</h2>
            </div>
            <p>Quizás te interese explorar nuestras Rutas del Conocimiento, donde podrás seguir el camino de grandes figuras históricas y aprender de los mejores en cada campo. ¡Descubre cursos inspirados en Einstein, Da Vinci, Marie Curie y más!</p>

            <div className="container-slider">
                <button
                    className='slider-btn'
                    onClick={() => {
                        const container = sliderRef.current;
                        container.scrollLeft -= scrollAmount;
                    }}
                    
                >
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#ffffff"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
                </button>
                <div className='images-container' ref={sliderRef}>
                    {images.map((image) => {
                        return (
                            <img
                            className='image'
                            alt='sliderImage'
                            key={image?.id}
                            src={image?.url}
                            />
                        );
                    })}
                </div>
                <button
                    className='slider-btn'
                    onClick={() => {
                        const container = sliderRef.current;
                        container.scrollLeft += scrollAmount;
                    }}
                >
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#ffffff"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
                </button>
            </div>
        </>
    )
}

export default RoutesComponent;