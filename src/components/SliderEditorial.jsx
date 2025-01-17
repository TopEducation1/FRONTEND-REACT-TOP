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
        <div className="container-slider-top">
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
           
            
            <div className="cont-line" style={lineStyles}>
                <div className="point" style={pointLeftStyles}></div>
                <div className="point" style={pointRightStyles}></div>
                <div className="line" style={lineInnerStyles}></div>
            </div>
        </div>
    );
};

export default SliderEditorial;