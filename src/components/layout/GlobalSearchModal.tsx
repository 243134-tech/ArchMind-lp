import React, { useState, useEffect } from 'react';
import { Search, X, Folder, Image, ShoppingBag, FileText, User, ArrowRight } from 'lucide-react';
import { archMindStore } from '../../services/store';
import { formatINR } from '../../utils/formatters';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const projects = archMindStore.getProjects();
  const designs = archMindStore.getDesigns();
  const products = archMindStore.getProducts();
  const documents = archMindStore.getDocuments();
  const professionals = archMindStore.getProfessionals();

  const q = query.toLowerCase().trim();

  const filteredProjects = q ? projects.filter((p) => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)) : projects.slice(0, 2);
  const filteredDesigns = q ? designs.filter((d) => d.name.toLowerCase().includes(q) || d.style.toLowerCase().includes(q)) : designs.slice(0, 2);
  const filteredProducts = q ? products.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)) : products.slice(0, 3);
  const filteredDocs = q ? documents.filter((doc) => doc.title.toLowerCase().includes(q)) : documents.slice(0, 2);
  const filteredProfs = q ? professionals.filter((prof) => prof.name.toLowerCase().includes(q) || prof.role.toLowerCase().includes(q)) : professionals.slice(0, 2);

  const handleSelect = (route: string) => {
    onNavigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E6E9ED] overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E6E9ED] flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search properties, designs, products, documents, professionals..."
            className="flex-1 text-sm bg-transparent outline-none text-[#171C2C] placeholder-gray-400"
          />
          <kbd className="hidden sm:inline-block text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">
            ESC to close
          </kbd>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
          
          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1.5 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5" />
                <span>Projects</span>
              </div>
              <div className="space-y-1">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(`/app/projects/${p.id}`)}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-[#E4F3F4] text-left rounded-xl transition-colors group"
                  >
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-[#006B7B]">{p.name}</div>
                      <div className="text-gray-500 text-[11px]">{p.location} • {p.projectType}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#006B7B] transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Designs */}
          {filteredDesigns.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1.5 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5" />
                <span>AI Designs</span>
              </div>
              <div className="space-y-1">
                {filteredDesigns.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelect(`/app/designs/${d.id}`)}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-[#E4F3F4] text-left rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={d.afterImageUrl} alt={d.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-[#006B7B]">{d.name}</div>
                        <div className="text-gray-500 text-[11px]">{d.style} • {d.roomType}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#006B7B]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1.5 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Products & Materials</span>
              </div>
              <div className="space-y-1">
                {filteredProducts.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => handleSelect(`/app/products`)}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-[#E4F3F4] text-left rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={prod.imageUrl} alt={prod.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-[#006B7B]">{prod.name}</div>
                        <div className="text-gray-500 text-[11px]">{prod.brand} • {formatINR(prod.priceMin)}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                      {prod.matchType}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {filteredDocs.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Project Documents</span>
              </div>
              <div className="space-y-1">
                {filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleSelect(`/app/documents`)}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-[#E4F3F4] text-left rounded-xl transition-colors group"
                  >
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-[#006B7B]">{doc.title}</div>
                      <div className="text-gray-500 text-[11px]">{doc.category} • {doc.fileSize}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#006B7B]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {filteredProjects.length === 0 && filteredDesigns.length === 0 && filteredProducts.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              No matching records found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-[#E6E9ED] text-[11px] text-gray-500 flex justify-between items-center px-4">
          <span>Search spans projects, designs, catalog items, and documents</span>
          <span className="text-gray-400">ArchMind Live Index</span>
        </div>

      </div>
    </div>
  );
};
