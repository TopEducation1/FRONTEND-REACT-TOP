import { endpoints } from "../config/api";

const TAG_CATEGORIES =  {
    TEMAS: 'Temas',
    HABILIDADES: 'Habilidades',
    EMPRESAS: 'Empresas',
    UNIVERSIDADES: 'Universidades'
};

class TagFilterService {
    constructor(baseUrl = endpoints.certificaciones_tags) {
        this.baseUrl = baseUrl;
    }


    buildQueryString(tags, page= 1, pageSize = 16) {
        const queryParts = [];

        queryParts.push(`page=${page}`);
        queryParts.push(`page_size=${pageSize}`);


        Object.entries(tags).forEach(([category, tagList]) => {
            if(tagList && tagList.length > 0) {
                // Convertir la categoria al formato esperado para el backend
                const categoryParam = category.toLowerCase();
                // Verificar el formato de los tags
                const tagsString = tagList.map(tag => encodeURIComponent(tag)).join(',');
                queryParts.push(`${categoryParam}=${tagsString}`);
            }
        });

        return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    }


    async filterByTags(selectedTags, page=1, pageSize = 16) {
        try {

            console.log('filtering with tags:', selectedTags);
            const queryString = this.buildQueryString(selectedTags, page, pageSize);
            const url = `${this.baseUrl}${queryString}`;




            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

           

            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


            const data = await response.json();
            /*console.log('Filter reponse data:', {
                count: data.count,
                resultsCount: data.results?.length,
                sampleResult : data.results?.[0],
                imageFields: data.results?.map(cert => ({
                    id: cert.id,
                    hasUnivImage: !!cert.url_imagen_universidad_certificacion,
                    hasEntImage: !!cert.url_imagen_empresa_certificacion,
                    hasPlatImage: !!cert.url_imagen_plataforma_certificacion,
                }))
            })*/
            return data;
        } catch (error) {
            console.error('Error en TagFilterService: ', error);
            throw error;
        }
    }



    validateTags(tags) {
        const validCategories = Object.values(TAG_CATEGORIES);


        return Object.entries(tags).every(([category, tagList]) => {
            return (
                validCategories.includes(category) &&
                Array.isArray(tagList) &&
                tagList.every(tag => typeof tag == 'string')
            );
        });
    }
}

export const tagFilterService = new TagFilterService();
export default tagFilterService;