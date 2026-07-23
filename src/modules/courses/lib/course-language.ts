export const courseLanguageValues = ['pt-BR', 'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT'] as const;

export type CourseLanguage = (typeof courseLanguageValues)[number];

export const defaultCourseLanguage: CourseLanguage = 'pt-BR';

type CourseLanguageConfig = {
  label: string;
  promptLabel: string;
  lessonSections: {
    overview: string;
    keyConcepts: string;
    examples: string;
    commonMistakes: string;
    summary: string;
  };
};

export const courseLanguageConfig: Record<CourseLanguage, CourseLanguageConfig> = {
  'pt-BR': {
    label: 'Português (Brasil)',
    promptLabel: 'Brazilian Portuguese',
    lessonSections: {
      overview: 'Visão geral',
      keyConcepts: 'Conceitos-chave',
      examples: 'Exemplos',
      commonMistakes: 'Erros comuns',
      summary: 'Resumo',
    },
  },
  'en-US': {
    label: 'English (United States)',
    promptLabel: 'American English',
    lessonSections: {
      overview: 'Overview',
      keyConcepts: 'Key Concepts',
      examples: 'Examples',
      commonMistakes: 'Common Mistakes',
      summary: 'Summary',
    },
  },
  'es-ES': {
    label: 'Español',
    promptLabel: 'Spanish',
    lessonSections: {
      overview: 'Descripción general',
      keyConcepts: 'Conceptos clave',
      examples: 'Ejemplos',
      commonMistakes: 'Errores comunes',
      summary: 'Resumen',
    },
  },
  'fr-FR': {
    label: 'Français',
    promptLabel: 'French',
    lessonSections: {
      overview: "Vue d'ensemble",
      keyConcepts: 'Concepts clés',
      examples: 'Exemples',
      commonMistakes: 'Erreurs fréquentes',
      summary: 'Résumé',
    },
  },
  'de-DE': {
    label: 'Deutsch',
    promptLabel: 'German',
    lessonSections: {
      overview: 'Überblick',
      keyConcepts: 'Schlüsselkonzepte',
      examples: 'Beispiele',
      commonMistakes: 'Häufige Fehler',
      summary: 'Zusammenfassung',
    },
  },
  'it-IT': {
    label: 'Italiano',
    promptLabel: 'Italian',
    lessonSections: {
      overview: 'Panoramica',
      keyConcepts: 'Concetti chiave',
      examples: 'Esempi',
      commonMistakes: 'Errori comuni',
      summary: 'Riepilogo',
    },
  },
};

export const courseLanguageOptions = courseLanguageValues.map((value) => ({
  value,
  label: courseLanguageConfig[value].label,
}));

export function isCourseLanguage(value: string | null | undefined): value is CourseLanguage {
  return Boolean(value && courseLanguageValues.includes(value as CourseLanguage));
}

export function getCourseLanguageLabel(value: string | null | undefined) {
  if (!isCourseLanguage(value)) {
    return courseLanguageConfig[defaultCourseLanguage].label;
  }

  return courseLanguageConfig[value].label;
}

export function getCourseLanguagePromptLabel(value: string | null | undefined) {
  if (!isCourseLanguage(value)) {
    return courseLanguageConfig[defaultCourseLanguage].promptLabel;
  }

  return courseLanguageConfig[value].promptLabel;
}

export function getLessonSectionHeadings(value: string | null | undefined) {
  if (!isCourseLanguage(value)) {
    return courseLanguageConfig[defaultCourseLanguage].lessonSections;
  }

  return courseLanguageConfig[value].lessonSections;
}
