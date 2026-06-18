import { endpoints } from "../config/api";

class TagFilterService {
  constructor(baseUrl = endpoints.certificaciones_filter) {
    this.baseUrl = baseUrl;
  }

  normalizeCategoryKey(category) {
    const map = {
      Tema: "Tema",
      Temas: "Tema",
      temas: "Tema",

      Habilidad: "Habilidad",
      Habilidades: "Habilidad",
      habilidades: "Habilidad",

      Plataforma: "Plataforma",
      plataforma: "Plataforma",
      Aliados: "Plataforma",
      aliados: "Plataforma",

      Empresa: "Empresa",
      Empresas: "Empresa",
      empresas: "Empresa",

      Universidad: "Universidad",
      Universidades: "Universidad",
      universidades: "Universidad",

      Idioma: "idioma",
      idioma: "idioma",
    };

    return map[category] || category;
  }

  getParamName(category, tag) {
    const normalizedCategory = this.normalizeCategoryKey(category);
    const hasId = tag && typeof tag === "object" && tag.id;

    if (hasId) {
      if (normalizedCategory === "Plataforma") return "plataforma_id";
      if (normalizedCategory === "Empresa") return "empresa_id";
      if (normalizedCategory === "Universidad") return "universidad_id";
    }

    return normalizedCategory;
  }

  getTagValue(category, tag) {
    if (tag == null) return "";

    const normalizedCategory = this.normalizeCategoryKey(category);

    if (normalizedCategory === "Tema" || normalizedCategory === "Habilidad") {
      if (typeof tag === "object") {
        return tag.slug || "";
      }

      return String(tag).trim();
    }

    if (normalizedCategory === "idioma") {
      return String(tag).trim().toLowerCase();
    }

    if (typeof tag === "object") {
      if (
        normalizedCategory === "Plataforma" ||
        normalizedCategory === "Empresa" ||
        normalizedCategory === "Universidad"
      ) {
        return tag.id || tag.value || tag.nombre || "";
      }

      return tag.slug || tag.nombre || tag.translate || "";
    }

    return String(tag).trim();
  }

  buildQueryString(tags, page = 1, pageSize = 16) {
    const searchParams = new URLSearchParams();

    searchParams.set("page", String(page));
    searchParams.set("page_size", String(pageSize));

    Object.entries(tags || {}).forEach(([category, tagList]) => {
      if (!Array.isArray(tagList) || !tagList.length) return;

      tagList.forEach((tag) => {
        const paramName = this.getParamName(category, tag);
        const value = this.getTagValue(category, tag);

        if (value) {
          searchParams.append(paramName, String(value));
        }
      });
    });

    const query = searchParams.toString();
    return query ? `?${query}` : "";
  }

  async filterByTags(selectedTags, page = 1, pageSize = 16) {
    try {
      const queryString = this.buildQueryString(selectedTags, page, pageSize);
      const url = `${this.baseUrl}${queryString}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in TagFilterService:", error);
      throw error;
    }
  }
}

export const tagFilterService = new TagFilterService();
export default tagFilterService;