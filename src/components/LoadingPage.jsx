import { useEffect, useState } from "react";

const LoadingPage = () => {
    return (
        
            <div className="page-loading">
                <div className="container-logo-loading"><img src="/assets/logos/TOPEDUCATIONLOGO-WHITE.png" alt="Logo Top Education" className="logo-nav"></img></div>
                <div className="balls">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        
    );
};

export default LoadingPage;
