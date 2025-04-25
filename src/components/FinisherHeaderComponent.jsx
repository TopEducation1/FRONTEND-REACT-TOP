import React, { useState, useEffect } from 'react';
//import ReactModal from 'react-modal';

//ReactModal.setAppElement('#root');
const FinisherHeaderComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (window.FinisherHeader) {
            new window.FinisherHeader({
                "count": 6,
                "size": {
                    "min": 853,
                    "max": 1300,
                    "pulse": 0
                },
                "speed": {
                    "x": {
                    "min": 0.1,
                    "max": 0.5
                    },
                    "y": {
                    "min": 0.1,
                    "max": 0.5
                    }
                },
                "colors": {
                    "background": "#040404",
                    "particles": [
                    "#353535",
                    "#4f4f4f",
                    "#000000"
                    ]
                },
                "blending": "overlay",
                "opacity": {
                    "center": 1,
                    "edge": 0.1
                },
                "skew": -1.8,
                "shapes": [
                    "c"
                ]
            });
        }
    }, []);

    return (
        
        <div id="finisher-header" className="container header finisher-header mx-auto px-4 justify-center-safe gap-2" >
            <span class="w-5/15 lg:w-5/15 aspect-square bg-gradient-to-tr from-blue-500 to-blue-900 absolute top-20 lg:left-150 rounded-full skew-y-0 blur-2xl opacity-40 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
            <span class="w-5/15 lg:w-5/15 aspect-square bg-gradient-to-tr from-green-500 to-green-900 absolute top-40 lg:left-50 rounded-full skew-y-0 blur-2xl opacity-40 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
            <span class="w-5/15 lg:w-5/15 aspect-square bg-gradient-to-tr from-red-500 to-red-900 absolute top-80 lg:left-100 rounded-full skew-y-0 blur-2xl opacity-40 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
            <div className="grid columns-1 justify-items-center content-evenly gap-4 z-10">
                <h1 className="text-7xl text-white text-center leading-21">Conecta los puntos,<br></br>forma tu historia</h1>
                <p className="text-white text-center font-['Montserrat'] text-2xl">Crea tu ruta de aprendizaje con los mas top del mundo.</p>
                <button className="btn btn-col-4 py-3 px-5 w-auto">¿Qués es <span id='top'>Top</span><span id='education'>.Education</span>?</button>
                
                {/*<ReactModal
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
                </ReactModal>*/}
                <div id="root"></div>
            </div>
        </div>
    );
};

export default FinisherHeaderComponent;