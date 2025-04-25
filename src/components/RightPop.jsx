import React from 'react';

const RightPop = () => {

    return (
        <div className="container-right-pop p-8">
            <h2 className='text-size-32 md:text-4xl font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-8 md:leading-8 aos-init aos-animate'>¿Aún no eres miembro de Top Education?</h2>
            <p>Con una membresía en Top Education, tendrás acceso a esta certificación y cientos más. <br/><b>¡Haz la prueba ahora!</b></p>
            <a href="/empieza-ahora" className='btn btn-col-1 font-bold my-3 py-2 px-4 rounded-full'>
                Probar Top Education
            </a>
            <span>¿Te gustaría contratar nuestros servicios para tu empresa?</span>
            <a href="/para-equipos" target="_blank" rel="noopener noreferrer">Conoce Top Education for teams</a>
        </div>
    )
}

export default RightPop;