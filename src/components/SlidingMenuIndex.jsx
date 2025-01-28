import React, { useEffect, useState} from 'react';
import { use } from 'react';
import IndexCategories from './IndexCategories';
import { useOutletContext } from 'react-router-dom';

const SlidingMenuIndex = ({ onTagSelect }) => {
    const { isMenuOpen, closeIndexResponsiveMenu } = useOutletContext();



    return (
        <div className={`sliding-menu ${isMenuOpen ? 'open' : ''}`}>
                 <button className="close-menu" onClick={closeIndexResponsiveMenu}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-x"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6l-12 12" />
                        <path d="M6 6l12 12" />
                    </svg>
                </button>

                <IndexCategories onTagSelect={onTagSelect}/>


            
            </div>

    );
};


export default SlidingMenuIndex;