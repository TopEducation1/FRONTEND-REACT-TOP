import { endpoints } from "../config/api";

const getCertificationById = async (slug) => {
    try {
        const url = endpoints.certificaciones_by_name(slug);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
            
    } catch (error) {
        console.error("Error fetching certification data: ", error);
        throw error;
    }
};

export default getCertificationById;