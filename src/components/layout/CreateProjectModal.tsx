import React, { useState } from 'react';
import { X, Plus, FolderPlus, DollarSign, MapPin, Maximize2, Calendar } from 'lucide-react';
import { archMindStore } from '../../services/store';
import { ProjectType } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (projectId: string) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('Renovation');
  const [location, setLocation] = useState('Bangalore, India');
  const [budgetLimit, setBudgetLimit] = useState(2850000);
  const [builtUpArea, setBuiltUpArea] = useState(2280);
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');
  const [targetDate, setTargetDate] = useState('2025-10-31');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProj = archMindStore.addProject({
      name: name.trim(),
      description: description.trim() || 'A new architectural transformation project.',
      projectType,
      status: 'Planning',
      location: location.trim(),
      currency,
      budgetLimit: Number(budgetLimit),
      builtUpArea: Number(builtUpArea),
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: targetDate,
      progressPercentage: 5,
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    });

    onCreated(newProj.id);
    onClose();
  };

  const projectTypes: ProjectType[] = [
    'Renovation',
    'Interior Redesign',
    'New Construction',
    'Furnishing',
    'Property Purchase',
    'Exterior Redesign',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E6E9ED] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E6E9ED] flex items-center justify-between bg-gray-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E4F3F4] text-[#006B7B] flex items-center justify-center font-semibold">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-base">Create New Project</h2>
              <p className="text-xs text-gray-500">Initiate an integrated home design & renovation project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block font-medium text-gray-700 mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Modern Terrace House, Damansara Villa"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as ProjectType)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-800 text-xs"
              >
                {projectTypes.map((pt) => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-800 text-xs"
              >
                <option value="INR">INR - Indian Rupee (₹)</option>
                <option value="USD">USD - US Dollar ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Target Budget ({currency})</label>
              <input
                type="number"
                min={1000}
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900 text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Built-up Area (sq ft)</label>
              <input
                type="number"
                min={100}
                value={builtUpArea}
                onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bangsar, Kuala Lumpur"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900 text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Target Completion Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900 text-xs"
            />
          </div>

          <div className="pt-3 border-t border-[#E6E9ED] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl font-medium text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl font-medium shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
