import React, { useEffect, useRef } from 'react';

const SliderEditorial = () => {
    const containerRef = useRef(null);
    const [scrollAmount, setScrollAmount] = React.useState(0);
    
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    }, []);

    const handleScroll = (direction) => {
        if (!containerRef.current) return;

        const cards = containerRef.current.querySelectorAll('.card-product');
        if (cards.length === 0) return;

        const card = cards[0];
        const cardStyle = window.getComputedStyle(card);
        const cardWidth = card.getBoundingClientRect().width + 
                         (parseFloat(cardStyle.marginRight) * 2);

        if (direction === 'left') {
            const newScroll = Math.max(scrollAmount - cardWidth, 0);
            setScrollAmount(newScroll);
            containerRef.current.scrollTo({
                top: 0,
                left: newScroll,
                behavior: 'smooth'
            });
        } else {
            const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
            const newScroll = Math.min(scrollAmount + cardWidth, maxScroll);
            setScrollAmount(newScroll);
            containerRef.current.scrollTo({
                top: 0,
                left: newScroll,
                behavior: 'smooth'
            });
        }
    };

    const lineStyles = {
        top: 400,
        width: '91%',
        position: 'absolute'
    };

    const pointLeftStyles = {
        top: 0,
        left: 0,
        background: '#D33B3E'
    };

    const pointRightStyles = {
        top: 0,
        right: 0,
        background: '#D33B3E'
    };

    const lineInnerStyles = {
        top: 5,
        left: 0,
        background: '#D33B3E'
    };

    return (
        <div className="container-slider">
            <div className="wrapper-slide" ref={containerRef}>
                <a href="https://info.top.education/es-mx/como-encontrar-trabajo-con-poca-experiencia" target="_blank" className="card-product">
                    <span className="label-type">Guía</span>
                    <img src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/c2013e1d-caf8-4923-a748-cc1486259df2/Guia+Como+encontrar+trabajo+con+poca+experiencia.png?format=300w" alt="product-img"/>
                </a>
                <a href="https://info.top.education/ebook-construye-tu-marca-personal-con-%C3%A9xito" target="_blank" className="card-product">
                    <span className="label-type">eBook</span>
                    <img src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/500ef00b-9648-4713-8ee4-d242416969c8/eBook+Construye+tu+marca+personal+con+exito.png?format=300w" alt="product-img"/>
                </a>
                <a href="https://info.top.education/ebook-crea-tu-ruta-de-aprendizaje-virtual-personalizada" target="_blank" className="card-product">
                    <span className="label-type">eBook</span>
                    <img src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/d57b30ad-b920-450a-b076-849d8724878b/eBook+Crea+tu+ruta+de+aprendizaje+virtual+personalizada.png?format=300w" alt="product-img"/>
                </a>
                <a href="https://info.top.education/estrategias-para-aprender-online" target="_blank" className="card-product">
                    <span className="label-type">eBook</span>
                    <img src="https://images.squarespace-cdn.com/content/v1/654306c68517a21d500a928b/ce4f1a0f-edaf-406f-9aec-3341a0685fb1/eBook+Estrategias+para+aprender+online.png?format=300w" alt="product-img"/>
                </a>
                <a href="https://info.top.education/capacitaci%C3%B3n-empresarial-del-futuro-e-learning-para-el-desarrollo-empresarial" target="_blank" className="card-product">
                    <span className="label-type">Paper</span>
                    <img src="https://images.squarespace-cdn.com/content/654306c68517a21d500a928b/aed11f9d-1ff5-4fa1-8993-40d1e9ef0a55/Whitepaper+-+Capacitacio%CC%81n+empresarial+del+futuro+elearning+para+el+desarrollo+profesional.png?content-type=image%2Fpng" alt="product-img"/>
                </a>
            </div>
            <button className="button-left" onClick={() => handleScroll('left')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#d43b3e" className="icon icon-tabler icons-tabler-filled icon-tabler-arrow-big-left">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9.586 4l-6.586 6.586a2 2 0 0 0 0 2.828l6.586 6.586a2 2 0 0 0 2.18 .434l.145 -.068a2 2 0 0 0 1.089 -1.78v-2.586h7a2 2 0 0 0 2 -2v-4l-.005 -.15a2 2 0 0 0 -1.995 -1.85l-7 -.001v-2.585a2 2 0 0 0 -3.414 -1.414z"/>
                </svg>
            </button>
            <button className="button-right" onClick={() => handleScroll('right')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#d43b3e" className="icon icon-tabler icons-tabler-filled icon-tabler-arrow-big-right">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12.089 3.634a2 2 0 0 0 -1.089 1.78l-.001 2.586h-6.999a2 2 0 0 0 -2 2v4l.005 .15a2 2 0 0 0 1.995 1.85l6.999 -.001l.001 2.587a2 2 0 0 0 3.414 1.414l6.586 -6.586a2 2 0 0 0 0 -2.828l-6.586 -6.586a2 2 0 0 0 -2.18 -.434l-.145 .068z"/>
                </svg>
            </button>
            <div className="cont-line" style={lineStyles}>
                <div className="point" style={pointLeftStyles}></div>
                <div className="point" style={pointRightStyles}></div>
                <div className="line" style={lineInnerStyles}></div>
            </div>
        </div>
    );
};

export default SliderEditorial;