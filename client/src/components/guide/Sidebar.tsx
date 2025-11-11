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
              flex items-center gap-3 px-4 py-3 mb-4 rounded-lg font-semibold transition-all duration-300
              text-sm tracking-wide
              border backdrop-blur-sm shadow-sm
            bg-gradient-to-r from-[#f0f0f3] via-[#e7e7ec] to-[#d9d9e2]
              text-[#222] border-[#d2d2da]/70
              hover:from-[#e8e8ee] hover:via-[#dcdce5] hover:to-[#ccccd8]
              hover:shadow-[0_2px_10px_rgba(0,0,0,0.1)]
              hover:text-black
          dark:from-[#2B1055] dark:via-[#4B1E75] dark:to-[#1A1A40]
              dark:text-gray-100 dark:border-white/10
              dark:hover:from-[#3B1570] dark:hover:via-[#5C2A8E] dark:hover:to-[#222244]
              dark:hover:shadow-[0_0_20px_rgba(130,90,255,0.4)]
            "
          >
            <ArrowBigLeftDash className="w-5 h-5 opacity-90" />
            <span>Back to Home</span>
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