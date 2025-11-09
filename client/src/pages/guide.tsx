import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Sidebar } from '@/components/guide/Sidebar';
import { Header } from '@/components/guide/Header';
import { MarkdownRenderer } from '@/components/guide/MarkdownRenderer';
import {
  getDocs,
  getDocById,
  getLanguageForDoc,
  savePreferences,
  getPreferences,
  getEffectiveTheme,
  fetchMarkdown,
  Doc,
  Language
} from '@/lib/guide-utils';
import '@/styles/fonts.css';
import '@/styles/cursor.css';
import '@/styles/index.css';
import '@/styles/guide.css';

const GuidePage: React.FC = () => {
  const [docs] = useState<Doc[]>(getDocs());
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedLangId, setSelectedLangId] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState<string | null>(null);

  useEffect(() => {
    const prefs = getPreferences();
    setTheme(prefs.theme);

    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    const langParam = params.get('lang');

    let docId: string | null = null;

    if (typeParam) {
      const doc = getDocById(typeParam);
      if (!doc) {
        setError('docs-not-available');
        setLoading(false);
        return;
      }
      docId = typeParam;
      setSelectedDocId(typeParam);
    } else if (docs.length > 0) {
      docId = docs[0].id;
      setSelectedDocId(docs[0].id);
    }

    if (langParam) {
      setSelectedLangId(langParam);
    } else if (prefs.lang && docId) {
      const doc = getDocById(docId);
      if (doc) {
        const langAvailable = doc.lang.find(l => l.id === prefs.lang);
        if (langAvailable) {
          setSelectedLangId(prefs.lang);
        }
      }
    }

    setLoading(false);
  }, [docs]);

  useEffect(() => {
    if (!selectedDocId) return;

    const doc = getDocById(selectedDocId);
    if (!doc) return;

    const langToUse = selectedLangId || doc.defaultlang;
    const language = getLanguageForDoc(doc, langToUse);

    if (!language) {
      setShowAlert('Language not available for this guide');
      const defaultLang = getLanguageForDoc(doc);
      if (defaultLang) {
        setSelectedLangId(defaultLang.id);
        return;
      }
    }

    if (language) {
      setLoading(true);
      setError(null);
      
      document.title = `${doc.name} | Guide`;

      fetchMarkdown(language.location)
        .then((content) => {
          setMarkdown(content);
          setLoading(false);
          
          if (selectedLangId && selectedLangId !== doc.defaultlang) {
            savePreferences({ lang: selectedLangId });
          }
        })
        .catch((err) => {
          console.error('Failed to fetch markdown:', err);
          setError('Failed to load guide content');
          setLoading(false);
        });
    }
  }, [selectedDocId, selectedLangId]);

  useEffect(() => {
    const effectiveTheme = getEffectiveTheme(theme);
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${effectiveTheme}`);
    
    if (effectiveTheme === 'dark') {
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
  }, [theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    savePreferences({ theme: newTheme });
  };

  const handleLanguageChange = (langId: string) => {
    setSelectedLangId(langId);
  };

  const handleDocSelect = (docId: string) => {
    setSelectedDocId(docId);
    setSelectedLangId(null);
    
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('type');
    newUrl.searchParams.delete('lang');
    window.history.pushState({}, '', newUrl.toString());
  };

  const currentDoc = selectedDocId ? getDocById(selectedDocId) : null;
  const availableLanguages = currentDoc?.lang || [];

  if (error === 'docs-not-available') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Document Not Available</h1>
          <p className="text-white text-opacity-70">The requested guide could not be found.</p>
          <button
            onClick={() => window.location.href = '/guide'}
            className="px-6 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
          >
            View Available Guides
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-container min-h-screen">
      <Header
        theme={theme}
        onThemeChange={handleThemeChange}
        availableLanguages={availableLanguages}
        selectedLanguage={selectedLangId || currentDoc?.defaultlang}
        onLanguageChange={handleLanguageChange}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <Sidebar
        docs={docs}
        selectedDocId={selectedDocId || undefined}
        onSelectDoc={handleDocSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="guide-content pt-[calc(var(--header-height)+1rem)]">
        {showAlert && (
          <div className="mb-4 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg">
            <p className="text-yellow-200">{showAlert}</p>
            <button
              onClick={() => setShowAlert(null)}
              className="mt-2 px-4 py-2 bg-yellow-500 bg-opacity-20 hover:bg-opacity-30 rounded-md text-sm transition-colors"
            >
              OK
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-white border-opacity-20 border-t-white rounded-full animate-spin mx-auto" />
              <p className="text-white text-opacity-70">Loading guide...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center space-y-4 py-12">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <MarkdownRenderer content={markdown} />
        )}
      </main>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<GuidePage />);
}
