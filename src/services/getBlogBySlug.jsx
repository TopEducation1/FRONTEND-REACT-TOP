import endpoints from "../config/api";

const getBlogBySlug = async  (slug) => {

    try {

        const url = endpoints.blog_detail(slug);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)

        }

        const data = await response.json();
        return data;

    } catch (error) {

        console.error("Error fetching blog results", error);
        throw error;
    }
};


export default getBlogBySlug;