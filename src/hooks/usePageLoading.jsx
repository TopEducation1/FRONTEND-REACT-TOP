import {useState, useEffect} from 'react';


export const usePageLoading = () => {
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const handleLoad = () => {
            setIsLoading(false);
        };


        if (document.readyState === 'complete') {
            setIsLoading(false);
        } else {
            window.addEventListener('load', handleLoad);

            const timeoutId = setTimeout(() => {
                setIsLoading(false)
            }, 3000);


            return () => {
                window.removeEventListener('load', handleLoad);
                clearTimeout(timeoutId);
            }
        }
    }, []);

    return isLoading;
}