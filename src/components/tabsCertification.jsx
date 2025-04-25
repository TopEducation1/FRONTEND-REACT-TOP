import React, { useState } from 'react';
import tailwindcss from "tailwindcss";

const TabsCertification = () => {
    const [activeTab, setActiveTab] = useState('tab1');

    return (
        <div className="nav-tab-wrapper px-8 py-5 ">
            <ul id="tabs-nav" class="flex course-tab mb-8">
                <li>
                  <a className={`px-4 py-2 rounded ${activeTab === 'tab1' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} onClick={() => setActiveTab('tab1')}>
                  Descripción
                  </a>
                </li>
                <li>
                  <a className={`px-4 py-2 rounded ${activeTab === 'tab2' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} onClick={() => setActiveTab('tab2')}>
                  Habilidades
                  </a>
                </li>
                <li>
                  <a className={`px-4 py-2 rounded ${activeTab === 'tab3' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} onClick={() => setActiveTab('tab3')}>
                  Contenido
                  </a>
                </li>
            </ul>
            <div className="mt-4">
                {activeTab === 'tab1' && <div><p>Contenido del Tab 1</p></div>}
                {activeTab === 'tab2' && <div><p>Contenido del Tab 2</p></div>}
                {activeTab === 'tab3' && <div><p>Contenido del Tab 3</p></div>}
            </div>
        </div>
    );
};

export default TabsCertification;
