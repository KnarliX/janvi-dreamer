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
            href="/portal"
            className="
              flex items-center gap-3 px-4 py-3 mb-4 rounded-xl font-semibold transition-all duration-300
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
              hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 
              text-white shadow-md hover:shadow-lg hover:shadow-purple-500/40
              dark:shadow-purple-500/30 dark:hover:shadow-purple-400/50
              relative overflow-hidden
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
            "
          >
            <ArrowBigLeftDash className="w-5 h-5 drop-shadow-sm" />
            <span className="text-sm tracking-wide">Back to Home</span>
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