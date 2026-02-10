// utils/languageMapper.js

const LANGUAGE_MAP = {
  // INGLÉS
  en: 'Inglés',
  eng: 'Inglés',
  english: 'Inglés',
  ingles: 'Inglés',
  'en-us': 'Inglés',
  'en-gb': 'Inglés',

  // ESPAÑOL
  es: 'Español',
  espanol: 'Español',
  español: 'Español',
  spanish: 'Español',
  'es-es': 'Español',
  'es-la': 'Español',

  // PORTUGUÉS
  pt: 'Portugués',
  'pt-br': 'Portugués',
  'pt-pt': 'Portugués',
  portugues: 'Portugués',
  portuguese: 'Portugués',

  // FRANCÉS
  fr: 'Francés',
  french: 'Francés',
  frances: 'Francés',

  // ITALIANO
  it: 'Italiano',
  italian: 'Italiano',
  italiano: 'Italiano',

  // ALEMÁN
  de: 'Alemán',
  german: 'Alemán',
  aleman: 'Alemán',

  // CHINO
  zh: 'Chino',
  'zh-cn': 'Chino (Mandarín)',
  'zh-hans': 'Chino (Simplificado)',
  chinese: 'Chino',

  // JAPONÉS
  ja: 'Japonés',
  japanese: 'Japonés',

  // COREANO
  ko: 'Coreano',
  korean: 'Coreano',

  // OTROS
  ru: 'Ruso',
  russian: 'Ruso',

  ar: 'Árabe',
  arabic: 'Árabe'
};


export function getLanguageLabel(value) {
  if (!value || value === 'NONE') {
    return 'Inglés (Subtitulado en Español)';
  }

  const normalized = value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // elimina tildes

  return LANGUAGE_MAP[normalized] || 'Idioma no especificado';
}
