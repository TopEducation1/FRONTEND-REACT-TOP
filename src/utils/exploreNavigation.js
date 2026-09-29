export const EXPLORE_LANGUAGE_IDS = {
  ES: 1,
  EN: 2,
};

export const DEFAULT_EXPLORE_LANGUAGE_IDS = [
  EXPLORE_LANGUAGE_IDS.ES,
  EXPLORE_LANGUAGE_IDS.EN,
];

const isValidValue = (value) =>
  value !== undefined &&
  value !== null &&
  value !== "";

const appendValue = (
  params,
  key,
  value
) => {
  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (isValidValue(item)) {
        params.append(
          key,
          String(item)
        );
      }
    });

    return;
  }

  if (isValidValue(value)) {
    params.append(
      key,
      String(value)
    );
  }
};

export const buildExploreUrl = (
  filters = {},
  {
    path = "/explora/filter",
    page = 1,
    pageSize = 16,
    languageIds =
      DEFAULT_EXPLORE_LANGUAGE_IDS,
  } = {}
) => {
  const params =
    new URLSearchParams();

  /*
   * Idiomas predeterminados para enlaces
   * externos a Explora.
   *
   * Español = 1
   * Inglés  = 2
   */
  languageIds.forEach(
    (languageId) => {
      params.append(
        "idioma_id",
        String(languageId)
      );
    }
  );

  Object.entries(
    filters || {}
  ).forEach(([key, value]) => {
    appendValue(
      params,
      key,
      value
    );
  });

  params.set(
    "page",
    String(page)
  );

  params.set(
    "page_size",
    String(pageSize)
  );

  return `${path}?${params.toString()}`;
};

export const getExploreFilterKey = (
  category
) => {
  const normalized =
    String(category || "")
      .trim()
      .toLowerCase();

  const map = {
    universidad:
      "universidad_id",

    universidades:
      "universidad_id",

    plataforma:
      "plataforma_id",

    plataformas:
      "plataforma_id",

    aliado:
      "plataforma_id",

    aliados:
      "plataforma_id",

    empresa:
      "empresa_id",

    empresas:
      "empresa_id",

    tema:
      "tema_id",

    temas:
      "tema_id",

    habilidad:
      "habilidad_id",

    habilidades:
      "habilidad_id",
  };

  return map[normalized] || null;
};