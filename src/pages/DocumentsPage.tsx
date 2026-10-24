import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Search,
  Filter,
  Plus,
  X,
  FileCheck,
  Folder,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { DocumentCategory, ProjectDocument } from '../types';

interface DocumentsPageProps {
  onNavigate: (route: string) => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({ onNavigate }) => {
  const activeProject = archMindStore.getActiveProject();
  const documents = archMindStore.getDocuments();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('Quotations');

  const categories: string[] = [
    'All',
    'Floor Plans',
    'Quotations',
    'Contracts',
    'Permits',
    'Receipts',
    'Design References',
  ];

  const filtered = documents.filter((d) => {
    if (activeCategory !== 'All' && d.category !== activeCategory) return false;
    if (searchQuery && !d.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    archMindStore.addDocument({
      projectId: activeProject?.id || 'proj_modern_terrace',
      title: docTitle.trim().endsWith('.pdf') ? docTitle.trim() : `${docTitle.trim()}.pdf`,
      category: docCategory,
      fileSize: '1.4 MB',
      fileType: 'PDF',
      fileUrl: '#',
      uploadedBy: archMindStore.getUser().name,
    });

    setDocTitle('');
    setUploadModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this project document?')) {
      archMindStore.deleteDocument(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-[#006B7B] uppercase tracking-wider mb-0.5">
            Document Vault
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] tracking-tight">
            Project Documents
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Secure vault for architectural drawings, contractor quotations, permits, and approved contracts.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E6E9ED]">
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === c
                  ? 'bg-[#E4F3F4] text-[#006B7B] font-semibold border border-teal-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#006B7B]"
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-[#E6E9ED] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAFAF8] text-gray-500 text-[10px] uppercase font-semibold border-b border-gray-100">
            <tr>
              <th className="p-3.5">Document Title</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Size</th>
              <th className="p-3.5">Uploaded Date</th>
              <th className="p-3.5">Uploaded By</th>
              <th className="p-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-3.5 font-semibold text-gray-900 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#006B7B] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>{doc.title}</span>
                </td>
                <td className="p-3.5">
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[10px] font-medium">
                    {doc.category}
                  </span>
                </td>
                <td className="p-3.5 text-gray-500 font-mono text-[11px]">{doc.fileSize}</td>
                <td className="p-3.5 text-gray-500">{doc.uploadedAt}</td>
                <td className="p-3.5 text-gray-700">{doc.uploadedBy}</td>
                <td className="p-3.5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => alert(`Downloading verified document ${doc.title}`)}
                      className="p-1.5 text-gray-500 hover:text-[#006B7B] transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-xs">
            No documents found in this category.
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E6E9ED] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <h3 className="font-bold text-gray-900 text-sm">Upload Project Document</h3>
              <button onClick={() => setUploadModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Approved_Kitchen_Joinery_Quote.pdf"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as DocumentCategory)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
                >
                  <option value="Quotations">Quotations</option>
                  <option value="Contracts">Contracts</option>
                  <option value="Permits">Permits</option>
                  <option value="Floor Plans">Floor Plans</option>
                  <option value="Receipts">Receipts</option>
                  <option value="Design References">Design References</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#006B7B] bg-gray-50">
                <Upload className="w-6 h-6 text-[#006B7B] mx-auto mb-1" />
                <span className="font-semibold text-gray-800 text-[11px]">Select file from computer</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">PDF, DWG, PNG up to 25MB</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl font-medium"
                >
                  Add Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
