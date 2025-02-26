import endpoints from "../config/api";

const fetchConfig = {

    method: 'GET', 
    headers: {
      'Accept': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',

  };

const masterclassGridFetcher = {

    async getMasterclassGrid(amount = 3) {
        try {

            const baseUrl = endpoints.masterclassGrid;

            const url = `${baseUrl}?amount=${amount}`;

            const response = await fetch(url, fetchConfig);

            if(!response.ok) {

                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            console.log("HOLAAAAAAAAAAAAAA LOS DATOSSSSSSSSSSS");
            console.log(data)

            return data;
        } catch (error) {

            throw error;
        }

    }

}


export default masterclassGridFetcher;