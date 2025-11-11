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
              flex items-center gap-3 px-4 py-3 mb-4 rounded-lg font-medium transition-all duration-300
              bg-gradient-to-r from-[#2B1055] via-[#4B1E75] to-[#1A1A40]
              dark:from-[#2A1846] dark:via-[#4B1E75] dark:to-[#101020]
              text-gray-100 dark:text-gray-50
              hover:from-[#3B1570] hover:via-[#5C2A8E] hover:to-[#222244]
              hover:text-white
              shadow-[0_0_12px_rgba(100,70,255,0.3)] hover:shadow-[0_0_20px_rgba(130,90,255,0.45)]
              backdrop-blur-sm border border-white/10
            "
          >
            <ArrowBigLeftDash className="w-5 h-5 opacity-90" />
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