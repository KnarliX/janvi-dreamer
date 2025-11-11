import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { Doc } from '@/lib/guide-types';
import { FileText } from 'lucide-react';
import { ArrowBigLeftDash } from 'lucide-react';

interface SidebarProps {
  docs: Doc[];
  selectedDocId?: string;
  onSelectDoc: (docId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  docs,
  selectedDocId,
  onSelectDoc,
  isOpen,
  onClose
}) => {
  const getIcon = (iconName?: string) => {
    if (!iconName) return FileText;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || FileText;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`guide-sidebar ${isOpen ? 'mobile-open' : ''}`}
      >
        <div className="p-4">
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
          >
            <ArrowBigLeftDash className="w-5 h-5" />
            <span className="text-sm">Back to Home</span>
          </a>
          <div className="space-y-1">
            {docs.map((doc) => {
              const Icon = getIcon(doc.icon);
              return (
                <div
                  key={doc.id}
                  className={`sidebar-item ${selectedDocId === doc.id ? 'active' : ''}`}
                  onClick={() => {
                    onSelectDoc(doc.id);
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                >
                  <Icon />
                  <span className="text-sm font-medium">{doc.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};