import { endpoints } from "../config/api";

const fetchConfig = {

    method: 'GET', 

    headers: {
      'Accept': 'application/json',
    },

    mode: 'cors',
    credentials: 'include',

};

const BlogsFetcher = {

    async getAllBlogs(page =1, pageSize = 9) {

        try {

            const baseUrl = endpoints.blogs;

            const url = `${baseUrl}?page=${page}&page_size=${pageSize}`;

            const response = await fetch(url, fetchConfig);

            if (!response.ok) {

                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            //console.log("DATA DE BLOGS");
            //console.log(data);

            return data;

        } catch (error) {

            console.error("Error fetching certifications:", error);
            throw error;
        }
    }
};


export default BlogsFetcher;