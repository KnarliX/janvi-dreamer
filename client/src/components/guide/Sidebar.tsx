import React from 'react';
import * as LucideIcons from 'lucide-react';
import { FileText } from 'lucide-react';

interface Doc {
  id: string;
  name: string;
  icon?: string;
  defaultlang: string;
  lang: Array<{
    id: string;
    name: string;
    location: string;
  }>;
}

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
        className={`guide-sidebar ${isOpen ? 'mobile-open' : ''} theme-dark:bg-black theme-dark:border-white theme-dark:border-opacity-10 theme-light:bg-white theme-light:border-black theme-light:border-opacity-10 border-r`}
      >
        <div className="p-4">
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