import React from 'react';

const RightPop = () => {

    return (
        <div className="container-right-pop px-6 py-8">
            <h2 className='text-size-32 md:text-4xl font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-8 md:leading-8 aos-init aos-animate'>¿Aún no eres miembro de top.education?</h2>
            <p>Con una membresía, tendrás acceso a esta certificación y a cientos más.</p>
            <a href="/empieza-ahora" className='btn btn-col-1 font-bold my-3 py-2 px-4 m-auto rounded-full'>¡Haz la prueba ahora!</a>
            <span className='w-full'>¿Te interesa contratar nuestros servicios para tu empresa?</span>
            <a href="/para-equipos" className='btn btn-col-2 font-bold my-3 py-2 px-[15px] mx-[-15px] m-auto leading-[1.1em] rounded-full' target="_blank" rel="noopener noreferrer">Conoce nuestra solución para equipos.</a>
        </div>
    )
}

export default RightPop;