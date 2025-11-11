export interface Language {
  id: string;
  name: string;
  location: string;
}

export interface Doc {
  id: string;
  name: string;
  icon?: string;
  defaultlang: string;
  lang: Language[];
}

export interface GuidePreferences {
  lang?: string;
  theme: 'light' | 'dark' | 'system';
}
