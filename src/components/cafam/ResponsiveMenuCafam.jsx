import { useEffect, useState } from "react"
import styles from '../../cafam-responsive-menu.module.css';
import IndexCategoriesCafam from "./IndexCategoriesCafam";

const ResponsiveMenuCafam = ({ onTagSelect, isOpen, onClose }) => {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' && window.innerWidth < 1025
    );

    useEffect(() => {
        const handleResize = () => {
            const nowMobile = window.innerWidth < 1025;
            setIsMobile(nowMobile);
            if (!nowMobile) onClose();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [onClose]);

    useEffect(() => {
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }


        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isMobile || !isOpen) {
        return null;
    }

    

    return (
        <div className={`${styles.cafamMenuResponsive} ${isOpen ? styles.open : ''}`}>
            <div className={`${styles.menuContentContainer}`}>
                <IndexCategoriesCafam onTagSelect={onTagSelect}/>
            </div>
            
            
            <div className={styles.wrapperCloseResponsiveMenuCafam}>
                <svg 
                    onClick={onClose}
                    xmlns="http://www.w3.org/2000/svg"  
                    width="30"  
                    height="30"  
                    viewBox="0 0 24 24"  
                    fill="none"  
                    stroke="blue"  
                    strokeWidth="2"  
                    strokeLinecap="round"  
                    strokeLinejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                </svg>
            </div>
        </div>
    );
};

export default ResponsiveMenuCafam;