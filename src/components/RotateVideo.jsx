import React from "react";

const RotateVideo = ({ onClick }) => {
    const styles = {
        container: {
          position: 'relative',
          width: '200px',
          height: '200px',
          margin: '50px auto'
        },
        rotatingCircle: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          animation: 'rotate 10s linear infinite'
        },
        text: {
          position: 'absolute',
          width: '100%',
          height: '100%'
        },
        circleText: {
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transformOrigin: '0 150px',
          color: 'white',
          fontSize: '20px',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        },
        playButton: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }
    };

    const text = "Más sobre top Education Más sobre top Education ";
    const characters = text.split('');
    const angleStep = 360 / characters.length;

    return (
        <div style={styles.container}>
          <style>
            {`
              @keyframes rotate {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }
            `}
          </style>
          <div style={styles.rotatingCircle}>
            {characters.map((char, index) => (
              <span 
                key={index} 
                style={{
                  ...styles.circleText,
                  transform: `rotate(${index * angleStep}deg)`
                }}
              >
                {char}
              </span>
            ))}
          </div>
          <div style={styles.playButton}
            onClick={onClick}
            >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="55" 
              height="55" 
              viewBox="0 0 24 24" 
              fill="#ffffff"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
            </svg>
          </div>
        </div>
    );
};

export default RotateVideo;