import React, { useEffect, useMemo, useState } from 'react';
import BlurText from "./BlurText";
import Particles, { initParticlesEngine } from "@tsparticles/react";

//import Particles from './Particles';
import ReactModal from 'react-modal';
import { loadSlim } from "@tsparticles/slim";

ReactModal.setAppElement('#root');
const handleAnimationComplete = () => {
    console.log('Animation completed!');
};

const generateRandomPosition = () => ({
    top: `${Math.random() * 80}%`,
    left: `${Math.random() * 80}%`,
});

const FinisherHeaderComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [positions, setPositions] = useState([]);
    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };
    const [init, setInit] = useState(false);
    

    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
            // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
            // starting from v2 you can add only the features you need reducing the bundle size
            //await loadAll(engine);
            //await loadFull(engine);
            await loadSlim(engine);
            //await loadBasic(engine);
        }).then(() => {
            setInit(true);
        });
        
        const newPositions = Array(3).fill().map(() => generateRandomPosition());
        setPositions(newPositions);

    }, []);

    const colors = ['blue', 'green', 'red'];

    const particlesLoaded = (container) => {
    console.log(container);
    };

    const options = useMemo(
    () => ({
        background: {
        color: {
            value: "",
        },
        },
        fpsLimit: 200,
        interactivity: {
        events: {
            onClick: {
            enable: false,
            mode: "push",
            },
            onHover: {
            enable: true,
            mode: "repulse",
            },
        },
        modes: {
            push: {
            quantity: 4,
            },
            repulse: {
            distance: 100,
            duration: 0.4,
            },
        },
        },
        particles: {
        color: {
            value: "#b0b0b0",
        },
        links: {
            color: "#b0b0b0",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
        },
        move: {
            direction: "none",
            enable: true,
            outModes: {
            default: "bounce",
            },
            random: false,
            speed: 2,
            straight: false,
        },
        number: {
            density: {
            enable: false,
            },
            value: 50,
        },
        opacity: {
            value: 0.5,
        },
        shape: {
            type: "circle",
        },
        size: {
            value: { min: 1, max: 5 },
        },
        },
        detectRetina: false,
    }),
    [],
    );


    return (
        
        <div  className="header finisher-header sticky w[100%] h-[100vh] top-0 mx-auto px-4 justify-center-safe gap-2" >
            <Particles
                id="tsparticles"
                particlesLoaded={particlesLoaded}
                options={options}
            />
            
            {positions.map((pos, index) => (
                <span
                    key={index}
                    className={`blob ${colors[index]}`}
                    style={{
                        top: pos.top,
                        left: pos.left,
                        animationDelay: `${index * 0.5}s`,
                    }}
                />
            ))}

            {/*<span class="w-2/10 aspect-square bg-gradient-to-tr from-[#034694] to-[#034694] absolute top-30 lg:left-190 rounded-full skew-y-0 blur-2xl opacity-70 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
            <span class="w-2/10 aspect-square bg-gradient-to-tr from-[#5CC781] to-[#5CC781] absolute top-30 lg:left-120 rounded-full skew-y-0 blur-2xl opacity-70 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
            <span class="w-2/10 aspect-square bg-gradient-to-tr from-[#D33B3E] to-[#D33B3E] absolute top-80 lg:left-155 rounded-full skew-y-0 blur-2xl opacity-70 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>*/}
            <div className="grid columns-1 justify-items-center content-evenly gap-4 z-10">
                {/*<h1 className="">Conecta los puntos,<br></br>forma tu historia</h1>*/}
                <BlurText text="Conecta los puntos, forma tu historia"
                delay={150}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="text-8xl w-full  xl:w-[50vw] text-white text-center leading-30"
                />
                <p className="text-white text-center font-['Montserrat'] text-2xl">Crea tu ruta de aprendizaje con los mas top del mundo.</p>
                <button className="btn btn-col-4 py-3 px-5 w-auto" onClick={openModal}>¿Qué es<span id='top'>top</span><span id='education'>.education</span>?</button>
                
                <ReactModal
                isOpen={isOpen}
                onRequestClose={closeModal}
                contentLabel="Video Pop-up"
                className="modal"
                overlayClassName="overlay"
                >
                    <button onClick={closeModal} className="btn btn-close"> x
                    </button>
                    <div className="video-container">
                        <video src="/assets/video/main-video.mp4" controls="true"></video>
                        
                    </div>
                </ReactModal>
            </div>
        </div>
    );
};

export default FinisherHeaderComponent;