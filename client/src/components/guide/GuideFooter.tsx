import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Doc } from '@/lib/guide-types';

interface GuideFooterProps {
  currentDoc: Doc | null;
  allDocs: Doc[];
  onDocChange: (docId: string) => void;
}

export const GuideFooter: React.FC<GuideFooterProps> = ({
  currentDoc,
  allDocs,
  onDocChange
}) => {
  const currentIndex = currentDoc ? allDocs.findIndex(doc => doc.id === currentDoc.id) : -1;
  const previousDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return (
    <footer className="guide-footer-container">
      <div className="guide-footer-navigation">
        <button
          onClick={() => previousDoc && onDocChange(previousDoc.id)}
          disabled={!previousDoc}
          className="guide-footer-nav-button prev-button"
        >
          <ChevronLeft className="w-5 h-5" />
          <div className="nav-button-content">
            <span className="nav-button-label">Previous Page</span>
            {previousDoc && <span className="nav-button-title">{previousDoc.name}</span>}
          </div>
        </button>

        <button
          onClick={() => nextDoc && onDocChange(nextDoc.id)}
          disabled={!nextDoc}
          className="guide-footer-nav-button next-button"
        >
          <div className="nav-button-content">
            <span className="nav-button-label">Next Page</span>
            {nextDoc && <span className="nav-button-title">{nextDoc.name}</span>}
          </div>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </footer>
  );
};