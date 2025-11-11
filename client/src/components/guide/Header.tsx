import React, { useState } from 'react';
import { Moon, Sun, MonitorCog, Menu, Languages, Search, X } from 'lucide-react';
import { Doc, Language } from '@/lib/guide-utils';

interface HeaderProps {
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  availableLanguages: Language[];
  selectedLanguage?: string;
  onLanguageChange: (langId: string) => void;
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  availableLanguages,
  selectedLanguage,
  onLanguageChange,
  onMenuToggle
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [langSearch, setLangSearch] = useState('');

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

  return (
    <header className="guide-header bg-black bg-opacity-80">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg md:text-xl font-bold">Guide</h1>
          <a
            href="/portal"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-semibold shadow-lg hover:shadow-purple-500/50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Portal
          </a>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="/portal"
            className="sm:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            aria-label="Back to Portal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </a>
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowThemeMenu(false);
                setLangSearch('');
              }}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors flex items-center gap-2"
              aria-label="Change language"
            >
              <Languages className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">{selectedLangName}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-black border border-white border-opacity-20 rounded-lg shadow-xl z-50">
                <div className="p-2 border-b border-white border-opacity-10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white text-opacity-50" />
                    <input
                      type="text"
                      placeholder="Search language..."
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-md text-sm focus:outline-none focus:border-opacity-30"
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
                        className={`w-full text-left px-4 py-2.5 hover:bg-white hover:bg-opacity-10 transition-colors text-sm ${
                          selectedLanguage === lang.id ? 'bg-white bg-opacity-5' : ''
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-white text-opacity-50">
                      No languages found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowLangMenu(false);
              }}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
              aria-label="Change theme"
            >
              <CurrentThemeIcon className="w-5 h-5" />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-black border border-white border-opacity-20 rounded-lg shadow-xl z-50">
                {(['light', 'dark', 'system'] as const).map((t) => {
                  const Icon = themeIcons[t];
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        onThemeChange(t);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-white hover:bg-opacity-10 transition-colors flex items-center gap-3 text-sm ${
                        theme === t ? 'bg-white bg-opacity-5' : ''
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