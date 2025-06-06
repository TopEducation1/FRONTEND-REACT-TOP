import { endpoints } from "../config/api";

const TAG_CATEGORIES =  {
    TEMAS: 'Temas',
    HABILIDADES: 'Habilidades',
    EMPRESAS: 'Empresas',
    UNIVERSIDADES: 'Universidades',
    PLATAFORMAS: 'Plataformas'
};

class TagFilterService {
    constructor(baseUrl = endpoints.certificaciones_tags) {
        this.baseUrl = baseUrl;
    }

    buildQueryString(tags, page = 1, pageSize = 15) {
        const queryParts = [];
        queryParts.push(`page=${page}`);
        queryParts.push(`page_size=${pageSize}`);

        const categoryMap = {
            'Tema': 'temas',
            'Plataforma': 'plataforma',
            'Aliados': 'aliados',
            'Empresa': 'empresas',
            'Universidad': 'universidades',
            'Habilidad': 'habilidades'
        };

        Object.entries(tags).forEach(([category, tagList]) => {
            if (tagList?.length) {
                const categoryParam = categoryMap[category];
                if (categoryParam) {
                    queryParts.push(`${categoryParam}=${encodeURIComponent(tagList.join(','))}`);
                }
            }
        });

        return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    }

    async filterByTags(selectedTags, page = 1, pageSize = 16) {
        try {
            const queryString = this.buildQueryString(selectedTags, page, pageSize);
            const url = `${this.baseUrl}${queryString}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error in TagFilterService:', error);
            throw error;
        }
    }
}

export const tagFilterService = new TagFilterService();
export default tagFilterService;