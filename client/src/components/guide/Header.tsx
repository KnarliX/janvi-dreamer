import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, MonitorCog, Menu, Languages, Search, X } from 'lucide-react';
import type { Language } from '@/lib/guide-types';
import { getEffectiveTheme } from '@/lib/guide-utils';

interface HeaderProps {
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  availableLanguages: Language[];
  selectedLanguage?: string;
  onLanguageChange: (langId: string) => void;
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  availableLanguages,
  selectedLanguage,
  onLanguageChange,
  onMenuToggle,
  isSidebarOpen
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark');
  
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEffectiveTheme(getEffectiveTheme(theme));
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
        setLangSearch('');
      }
    };

    if (showThemeMenu || showLangMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showThemeMenu, showLangMenu]);

  useEffect(() => {
    if (isSidebarOpen) {
      setShowLangMenu(false);
      setShowThemeMenu(false);
      setLangSearch('');
    }
  }, [isSidebarOpen]);

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: MonitorCog
  };

  const CurrentThemeIcon = themeIcons[theme];

  const filteredLanguages = availableLanguages.filter(lang =>
    lang.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    lang.id.toLowerCase().includes(langSearch.toLowerCase())
  );

  const selectedLangName = availableLanguages.find(l => l.id === selectedLanguage)?.name || 'Select Language';

  const isLight = effectiveTheme === 'light';

  return (
    <header className={`guide-header ${isLight ? 'bg-white bg-opacity-90' : 'bg-black bg-opacity-90'}`}>
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isLight 
                ? 'hover:bg-black hover:bg-opacity-10 text-black' 
                : 'hover:bg-white hover:bg-opacity-10 text-white'
            }`}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className={`text-lg md:text-xl font-bold ${isLight ? 'text-black' : 'text-white'}`}>
            Guide
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowThemeMenu(false);
                setLangSearch('');
              }}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                isLight 
                  ? 'hover:bg-black hover:bg-opacity-10 text-black' 
                  : 'hover:bg-white hover:bg-opacity-10 text-white'
              }`}
              aria-label="Change language"
            >
              <Languages className="w-5 h-5" />
              <span className={`hidden sm:inline text-sm ${isLight ? 'text-black' : 'text-white'}`}>
                {selectedLangName}
              </span>
            </button>

            {showLangMenu && (
              <div className={`absolute right-0 mt-2 w-64 border rounded-lg shadow-xl z-50 ${
                isLight 
                  ? 'bg-white border-black border-opacity-20' 
                  : 'bg-black border-white border-opacity-20'
              }`}>
                <div className={`p-2 border-b ${
                  isLight ? 'border-black border-opacity-10' : 'border-white border-opacity-10'
                }`}>
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      isLight ? 'text-black text-opacity-50' : 'text-white text-opacity-50'
                    }`} />
                    <input
                      type="text"
                      placeholder="Search language..."
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none ${
                        isLight 
                          ? 'bg-black bg-opacity-5 border-black border-opacity-10 text-black placeholder-black placeholder-opacity-50 focus:border-opacity-30' 
                          : 'bg-white bg-opacity-5 border-white border-opacity-10 text-white placeholder-white placeholder-opacity-50 focus:border-opacity-30'
                      }`}
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
                        className={`w-full text-left px-4 py-2.5 transition-colors text-sm ${
                          isLight
                            ? `hover:bg-black hover:bg-opacity-10 text-black ${selectedLanguage === lang.id ? 'bg-black bg-opacity-5' : ''}`
                            : `hover:bg-white hover:bg-opacity-10 text-white ${selectedLanguage === lang.id ? 'bg-white bg-opacity-5' : ''}`
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))
                  ) : (
                    <div className={`px-4 py-6 text-center text-sm ${
                      isLight ? 'text-black text-opacity-50' : 'text-white text-opacity-50'
                    }`}>
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
              className={`p-2 rounded-lg transition-colors ${
                isLight 
                  ? 'hover:bg-black hover:bg-opacity-10 text-black' 
                  : 'hover:bg-white hover:bg-opacity-10 text-white'
              }`}
              aria-label="Change theme"
            >
              <CurrentThemeIcon className="w-5 h-5" />
            </button>

            {showThemeMenu && (
              <div className={`absolute right-0 mt-2 w-48 border rounded-lg shadow-xl z-50 ${
                isLight 
                  ? 'bg-white border-black border-opacity-20' 
                  : 'bg-black border-white border-opacity-20'
              }`}>
                {(['light', 'dark', 'system'] as const).map((t) => {
                  const Icon = themeIcons[t];
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        onThemeChange(t);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 transition-colors flex items-center gap-3 text-sm ${
                        isLight
                          ? `hover:bg-black hover:bg-opacity-10 text-black ${theme === t ? 'bg-black bg-opacity-5' : ''}`
                          : `hover:bg-white hover:bg-opacity-10 text-white ${theme === t ? 'bg-white bg-opacity-5' : ''}`
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
