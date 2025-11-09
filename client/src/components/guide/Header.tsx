import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Monitor, Menu, Languages, Search, X } from 'lucide-react';
import { Language } from '@/lib/guide-utils';

interface HeaderProps {
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  availableLanguages: Language[];
  selectedLanguage?: string;
  onLanguageChange: (langId: string) => void;
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  availableLanguages,
  selectedLanguage,
  onLanguageChange,
  onMenuToggle,
  sidebarOpen
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  };

  const CurrentThemeIcon = themeIcons[theme];

  const filteredLanguages = availableLanguages.filter(lang =>
    lang.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    lang.id.toLowerCase().includes(langSearch.toLowerCase())
  );

  const selectedLangName = availableLanguages.find(l => l.id === selectedLanguage)?.name || 'Select Language';

  useEffect(() => {
    if (sidebarOpen) {
      setShowThemeMenu(false);
      setShowLangMenu(false);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };

    if (showThemeMenu || showLangMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showThemeMenu, showLangMenu]);

  return (
    <header className="guide-header theme-light:bg-white theme-light:bg-opacity-95 theme-dark:bg-black theme-dark:bg-opacity-80">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 theme-light:hover:bg-black theme-light:hover:bg-opacity-10 theme-dark:hover:bg-white theme-dark:hover:bg-opacity-10 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg md:text-xl font-bold">Guide</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowThemeMenu(false);
                setLangSearch('');
              }}
              className="p-2 theme-light:hover:bg-black theme-light:hover:bg-opacity-10 theme-dark:hover:bg-white theme-dark:hover:bg-opacity-10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              aria-label="Change language"
            >
              <Languages className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">{selectedLangName}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-64 theme-light:bg-white theme-dark:bg-black theme-light:border-black theme-light:border-opacity-20 theme-dark:border-white theme-dark:border-opacity-20 border rounded-lg shadow-xl z-[100]">
                <div className="p-2 border-b theme-light:border-black theme-light:border-opacity-10 theme-dark:border-white theme-dark:border-opacity-10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 theme-light:text-black theme-light:text-opacity-50 theme-dark:text-white theme-dark:text-opacity-50" />
                    <input
                      type="text"
                      placeholder="Search language..."
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 theme-light:bg-black theme-light:bg-opacity-5 theme-light:border-black theme-light:border-opacity-10 theme-dark:bg-white theme-dark:bg-opacity-5 theme-dark:border-white theme-dark:border-opacity-10 border rounded-md text-sm focus:outline-none theme-light:focus:border-opacity-30 theme-dark:focus:border-opacity-30"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredLanguages.length > 0 ? (
                    filteredLanguages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          onLanguageChange(lang.id);
                          setShowLangMenu(false);
                          setLangSearch('');
                        }}
                        className={`w-full text-left px-4 py-2.5 theme-light:hover:bg-black theme-light:hover:bg-opacity-10 theme-dark:hover:bg-white theme-dark:hover:bg-opacity-10 transition-colors text-sm cursor-pointer ${
                          selectedLanguage === lang.id ? 'theme-light:bg-black theme-light:bg-opacity-5 theme-dark:bg-white theme-dark:bg-opacity-5' : ''
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm theme-light:text-black theme-light:text-opacity-50 theme-dark:text-white theme-dark:text-opacity-50">
                      No languages found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowLangMenu(false);
              }}
              className="p-2 theme-light:hover:bg-black theme-light:hover:bg-opacity-10 theme-dark:hover:bg-white theme-dark:hover:bg-opacity-10 rounded-lg transition-colors cursor-pointer"
              aria-label="Change theme"
            >
              <CurrentThemeIcon className="w-5 h-5" />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 theme-light:bg-white theme-dark:bg-black theme-light:border-black theme-light:border-opacity-20 theme-dark:border-white theme-dark:border-opacity-20 border rounded-lg shadow-xl z-[100]">
                {(['light', 'dark', 'system'] as const).map((t) => {
                  const Icon = themeIcons[t];
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        onThemeChange(t);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 theme-light:hover:bg-black theme-light:hover:bg-opacity-10 theme-dark:hover:bg-white theme-dark:hover:bg-opacity-10 transition-colors flex items-center gap-3 text-sm cursor-pointer ${
                        theme === t ? 'theme-light:bg-black theme-light:bg-opacity-5 theme-dark:bg-white theme-dark:bg-opacity-5' : ''
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="capitalize">{t}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};