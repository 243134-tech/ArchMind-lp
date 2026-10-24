import React, { useState } from 'react';
import {
  Plus,
  Folder,
  Calendar,
  DollarSign,
  Maximize2,
  ChevronRight,
  TrendingUp,
  Trash2,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { CreateProjectModal } from '../components/layout/CreateProjectModal';
import { formatINR } from '../utils/formatters';

interface ProjectsPageProps {
  onNavigate: (route: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const projects = archMindStore.getProjects();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = projects.filter((p) => {
    if (filterStatus !== 'All' && p.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-[#006B7B] uppercase tracking-wider mb-0.5">
            Project Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] tracking-tight">
            Your Projects
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Every room transformation, floor plan, product selection, and cost breakdown belongs to a project.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'In Progress', 'Planning', 'Idea', 'Completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterStatus === status
                ? 'bg-[#006B7B] text-white font-semibold shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-[#E6E9ED]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((proj) => {
          const isActive = proj.id === archMindStore.getActiveProjectId();
          return (
            <div
              key={proj.id}
              onClick={() => {
                archMindStore.setActiveProjectId(proj.id);
                onNavigate(`/app/projects/${proj.id}`);
              }}
              className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md ${
                isActive ? 'border-2 border-[#006B7B] ring-2 ring-teal-600/10' : 'border-[#E6E9ED]'
              }`}
            >
              <div>
                {/* Cover Image */}
                <div className="relative rounded-xl overflow-hidden aspect-16/10 mb-3 bg-gray-100">
                  <img
                    src={proj.coverImage}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold rounded-lg">
                    {proj.projectType}
                  </span>
                  {isActive && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#006B7B] text-white text-[10px] font-bold rounded-lg shadow-xs">
                      Active Project
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#006B7B] transition-colors truncate">
                  {proj.name}
                </h3>
                <div className="text-[11px] text-gray-500 mt-0.5">{proj.location}</div>
                <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 py-3 my-3 border-y border-gray-100">
                  <div>
                    <div className="text-[10px] text-gray-400">Target Budget</div>
                    <div className="font-bold text-gray-900 mt-0.5">
                      {formatINR(proj.budgetLimit)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400">Built-up Area</div>
                    <div className="font-bold text-gray-900 mt-0.5">
                      {proj.builtUpArea} sq ft
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-bold text-gray-900">{proj.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${proj.progressPercentage}%` }}
                      className="bg-[#006B7B] h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs font-semibold text-[#006B7B]">
                <span>Open Project Workspace</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(id) => onNavigate(`/app/projects/${id}`)}
      />

    </div>
  );
};
