// src/utils/levelMapper.js

const LEVEL_MAP = {
  // PRINCIPIANTE
  introductory: 'Principiante',
  intro: 'Principiante',
  beginner: 'Principiante',
  basic: 'Principiante',
  inicial: 'Principiante',

  // INTERMEDIO
  intermediate: 'Intermedio',
  intermedio: 'Intermedio',
  medium: 'Intermedio',

  // AVANZADO
  advanced: 'Avanzado',
  avanzado: 'Avanzado',
  expert: 'Avanzado',

  // OPCIONAL
  professional: 'Profesional'
};

export function getLevelLabel(value) {
  if (!value || value === 'NONE') {
    return null; // 👈 no se renderiza
  }

  const normalized = value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return LEVEL_MAP[normalized] || 'Nivel no especificado';
}
