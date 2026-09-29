import endpoints from "../config/api";

/*
 * Peticiones actualmente en ejecución.
 *
 * Sirve para evitar que React lance dos requests iguales
 * simultáneamente, algo común en desarrollo con StrictMode.
 *
 * Ejemplo:
 *
 * request 1:
 * /related-grid/?amount=9
 *
 * request 2 simultáneo:
 * /related-grid/?amount=9
 *
 * Ambos reutilizan la misma Promise y al backend solo
 * debería llegar una petición.
 */
const pendingRequests = new Map();


const relatedCertificationsFetcher = {
  async getRelatedCertifications(slug, amount = 9) {
    /*
     * =========================================================
     * VALIDACIÓN
     * =========================================================
     */

    if (!slug) {
      return [];
    }

    /*
     * Mantenemos el amount dentro del mismo límite
     * que dejamos en backend.
     */
    const safeAmount = Math.max(
      1,
      Math.min(
        Number(amount) || 9,
        24
      )
    );

    /*
     * Clave única para esta petición.
     *
     * Si cambia slug o amount, se considera una petición nueva.
     */
    const requestKey = `${slug}:${safeAmount}`;


    /*
     * =========================================================
     * DEDUPLICACIÓN
     * =========================================================
     *
     * Si ya existe exactamente la misma petición ejecutándose,
     * reutilizamos esa Promise.
     *
     * NO es cache permanente.
     */
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }


    /*
     * =========================================================
     * REQUEST
     * =========================================================
     */

    const requestPromise = fetch(
      `${endpoints.relatedCertificationsGrid(
        slug
      )}?amount=${safeAmount}`,
      {
        method: "GET",

        headers: {
          Accept: "application/json",
        },

        credentials: "include",
      }
    )
      .then(async (response) => {
        /*
         * =====================================================
         * ERRORES HTTP
         * =====================================================
         */

        if (!response.ok) {
          let errorMessage = `HTTP error ${response.status}`;

          try {
            const errorData =
              await response.json();

            errorMessage =
              errorData?.detail ||
              errorData?.error ||
              errorData?.message ||
              errorMessage;

          } catch {
            /*
             * La respuesta puede no ser JSON.
             * Conservamos el error HTTP original.
             */
          }

          throw new Error(
            errorMessage
          );
        }


        /*
         * =====================================================
         * NORMALIZAR DATA
         * =====================================================
         */

        const data =
          await response.json();


        /*
         * Backend actual:
         *
         * [
         *   {...},
         *   {...}
         * ]
         */
        if (Array.isArray(data)) {
          return data;
        }


        /*
         * Compatibilidad con paginación DRF:
         *
         * {
         *   results: [...]
         * }
         */
        if (
          Array.isArray(
            data?.results
          )
        ) {
          return data.results;
        }


        /*
         * Compatibilidad futura si alguna respuesta viene:
         *
         * {
         *   data: [...]
         * }
         */
        if (
          Array.isArray(
            data?.data
          )
        ) {
          return data.data;
        }


        return [];
      })
      .finally(() => {
        /*
         * =====================================================
         * LIMPIEZA
         * =====================================================
         *
         * Cuando la petición termina —bien o mal— eliminamos
         * la Promise del Map.
         *
         * De esta forma:
         *
         * curso A → request
         * curso B → request
         * curso C → request
         *
         * siguen siendo peticiones independientes.
         *
         * Solo evitamos duplicados simultáneos.
         */
        pendingRequests.delete(
          requestKey
        );
      });


    /*
     * Registramos la petición antes de devolverla.
     */
    pendingRequests.set(
      requestKey,
      requestPromise
    );


    return requestPromise;
  },
};


export default relatedCertificationsFetcher;