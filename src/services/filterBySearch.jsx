import { endpoints } from "../config/api";


const FilterBySearch = {

    async getResults(stringQuery) {
        try {
            const response = await fetch(endpoints.certificaciones_busqueda,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({data: stringQuery}),
            });


            if (response.ok) {
                const data = await response.json();
                //console.log("Respuesta del back: ", data);
                return data;
            } else {
                console.error('Error al enviar datos: ', response.status);
            }
            
            

        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
    }
}


export default FilterBySearch;