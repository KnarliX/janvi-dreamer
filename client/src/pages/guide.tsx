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
  fetchMarkdown
} from '@/lib/guide-utils';
import type { Doc, Language } from '@/lib/guide-types';
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
  const [showAlert, setShowAlert] = useState<{ type: 'language' | 'document'; message: string } | null>(null);

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
        setShowAlert({ type: 'document', message: 'Document not available' });
        setLoading(false);
        if (docs.length > 0) {
          docId = docs[0].id;
          setSelectedDocId(docs[0].id);
        }
      } else {
        docId = typeParam;
        setSelectedDocId(typeParam);
      }
    } else if (docs.length > 0) {
      docId = docs[0].id;
      setSelectedDocId(docs[0].id);
    }

    if (docId) {
      const doc = getDocById(docId);
      if (doc) {
        if (langParam) {
          const langAvailable = doc.lang.find(l => l.id === langParam);
          if (langAvailable) {
            setSelectedLangId(langParam);
          } else if (prefs.lang) {
            const prefLangAvailable = doc.lang.find(l => l.id === prefs.lang);
            if (prefLangAvailable) {
              setSelectedLangId(prefs.lang);
            }
          }
        } else if (prefs.lang) {
          const prefLangAvailable = doc.lang.find(l => l.id === prefs.lang);
          if (prefLangAvailable) {
            setSelectedLangId(prefs.lang);
          }
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
      setShowAlert(prev => {
        if (prev?.type === 'document') return prev;
        return { type: 'language', message: 'Language not available for this guide' };
      });
      const defaultLang = getLanguageForDoc(doc);
      if (defaultLang) {
        setSelectedLangId(defaultLang.id);
        return;
      }
    } else {
      setShowAlert(prev => {
        if (prev?.type === 'document') return prev;
        return null;
      });
    }

    if (language) {
      setLoading(true);
      setError(null);
      
      document.title = `${doc.name} | Guide`;

      fetchMarkdown(language.location)
        .then((content) => {
          setMarkdown(content);
          setLoading(false);
          
          if (selectedLangId) {
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

  return (
    <div className="guide-container min-h-screen">
      <Header
        theme={theme}
        onThemeChange={handleThemeChange}
        availableLanguages={availableLanguages}
        selectedLanguage={selectedLangId || currentDoc?.defaultlang}
        onLanguageChange={handleLanguageChange}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
      />

      {showAlert && (
        <div className="guide-alert fixed top-[var(--header-height)] left-0 right-0 z-40">
          <div className="alert-content">
            <p className="alert-message">{showAlert.message}</p>
            <button
              onClick={() => setShowAlert(null)}
              className="alert-button"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <Sidebar
        docs={docs}
        selectedDocId={selectedDocId || undefined}
        onSelectDoc={handleDocSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="guide-content pt-[calc(var(--header-height)+1rem)]">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="loading-spinner" />
              <p className="loading-text">Loading guide...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center space-y-4 py-12">
            <p className="error-text">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-button"
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
