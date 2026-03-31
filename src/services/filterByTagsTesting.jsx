import { endpoints } from "../config/api";

class TagFilterService {
  constructor(baseUrl = endpoints.certificaciones_tags) {
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
      return tag.nombre || tag.translate || tag.slug || "";
    }

    return String(tag).trim();
  }

  buildQueryString(tags, page = 1, pageSize = 16) {
    const searchParams = new URLSearchParams();

    searchParams.set("page", page);
    searchParams.set("page_size", pageSize);

    Object.entries(tags || {}).forEach(([category, tagList]) => {
      if (!Array.isArray(tagList) || !tagList.length) return;

      const categoryParam = this.normalizeCategoryKey(category);

      tagList.forEach((tag) => {
        const value = this.getTagValue(category, tag);

        if (value) {
          searchParams.append(categoryParam, value);
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

      console.log("TagFilterService URL:", url);
      console.log("TagFilterService selectedTags:", selectedTags);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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