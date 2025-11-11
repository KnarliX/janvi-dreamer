import docsData from './docs.json';
import type { Language, Doc, GuidePreferences } from './guide-types';

export type { Language, Doc, GuidePreferences };

const STORAGE_KEY = 'guide';

export const getDocs = (): Doc[] => {
  return docsData as Doc[];
};

export const getDocById = (id: string): Doc | undefined => {
  return getDocs().find(doc => doc.id === id);
};

export const getLanguageForDoc = (doc: Doc, langId?: string): Language | undefined => {
  if (!langId) {
    return doc.lang.find(l => l.id === doc.defaultlang) || doc.lang[0];
  }
  return doc.lang.find(l => l.id === langId);
};

export const savePreferences = (prefs: Partial<GuidePreferences>): void => {
  const current = getPreferences();
  const updated = { ...current, ...prefs };
  
  const toSave: any = { theme: updated.theme };
  if (updated.lang) {
    toSave.lang = updated.lang;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
};

export const getPreferences = (): GuidePreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        lang: parsed.lang,
        theme: parsed.theme || 'system'
      };
    }
  } catch (e) {
    console.error('Failed to load guide preferences:', e);
  }
  
  return { theme: 'system' };
};

export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

export const getEffectiveTheme = (theme: 'light' | 'dark' | 'system'): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const fetchMarkdown = async (location: string): Promise<string> => {
  try {
    const response = await fetch(location);
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching markdown:', error);
    throw error;
  }
};
