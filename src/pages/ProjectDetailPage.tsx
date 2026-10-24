import React, { useState } from 'react';
import {
  ArrowLeft,
  Settings,
  Sparkles,
  Maximize2,
  PieChart,
  ShoppingBag,
  Clock,
  FileText,
  Users,
  CheckCircle2,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { formatINR } from '../utils/formatters';

interface ProjectDetailPageProps {
  projectId?: string;
  onNavigate: (route: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  projectId = 'proj_modern_terrace',
  onNavigate,
}) => {
  const project = archMindStore.getProject(projectId) || archMindStore.getActiveProject();
  const designs = archMindStore.getDesigns(project?.id);
  const floorPlans = archMindStore.getFloorPlans(project?.id);
  const tasks = archMindStore.getTasks(project?.id);
  const budgetSummary = archMindStore.getBudgetSummary(project?.id);
  const documents = archMindStore.getDocuments(project?.id);

  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Designs' | 'Floor Plans' | 'Budget' | 'Tasks' | 'Documents'
  >('Overview');

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    archMindStore.addTask({
      projectId: project?.id || 'proj_modern_terrace',
      title: newTaskTitle.trim(),
      category: 'General',
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      status: 'Pending',
      priority: 'Medium',
    });
    setNewTaskTitle('');
  };

  const tabs = ['Overview', 'Designs', 'Floor Plans', 'Budget', 'Tasks', 'Documents'];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('/app/projects')}
            className="flex items-center gap-1.5 text-xs text-[#006B7B] font-medium hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects</span>
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] tracking-tight">
              {project?.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E4F3F4] text-[#006B7B]">
              {project?.status}
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1">
            {project?.location} • {project?.projectType} • Target: {project?.targetCompletionDate}
          </p>
        </div>

        {/* Quick Launch Studio */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              archMindStore.setActiveProjectId(project?.id || '');
              onNavigate('/app/design-studio');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Open in AI Studio</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-3 px-3 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? 'border-[#006B7B] text-[#006B7B]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Project Summary Card */}
            <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
              <h3 className="font-bold text-gray-900 text-xs">Project Specifications</h3>
              <div className="space-y-2 text-xs divide-y divide-gray-100">
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500">Built-up Area</span>
                  <span className="font-semibold text-gray-900">{project?.builtUpArea} sq ft</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500">Target Budget</span>
                  <span className="font-semibold text-gray-900">{formatINR(project?.budgetLimit || 0)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500">Start Date</span>
                  <span className="font-semibold text-gray-900">{project?.startDate}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500">Completion Target</span>
                  <span className="font-semibold text-gray-900">{project?.targetCompletionDate}</span>
                </div>
              </div>
            </div>

            {/* Budget Snapshot */}
            <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-xs">Budget Status</h3>
                <button
                  onClick={() => onNavigate('/app/budget')}
                  className="text-[11px] text-[#006B7B] hover:underline"
                >
                  Manage →
                </button>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatINR(budgetSummary.committedOrPaid)}
              </div>
              <div className="text-[11px] text-gray-500">
                {budgetSummary.allocatedPercentage}% allocated of {formatINR(budgetSummary.budgetLimit)}
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div style={{ width: `${budgetSummary.allocatedPercentage}%` }} className="bg-[#006B7B] h-2 rounded-full" />
              </div>
            </div>

            {/* Renovation Tasks Snapshot */}
            <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-xs">Tasks Status</h3>
                <span className="text-[10px] text-gray-400">{tasks.length} total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {tasks.filter((t) => t.status === 'Completed').length} / {tasks.length}
              </div>
              <div className="text-[11px] text-gray-500">
                {tasks.filter((t) => t.status !== 'Completed').length} pending milestones
              </div>
              <button
                onClick={() => setActiveTab('Tasks')}
                className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold"
              >
                View Task Checklist
              </button>
            </div>

          </div>

          {/* Connected Modules Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => onNavigate('/app/designs/des_modern_living')}
              className="p-4 bg-white hover:bg-[#E4F3F4]/30 rounded-2xl border border-[#E6E9ED] shadow-xs cursor-pointer transition-colors"
            >
              <div className="font-bold text-gray-900 text-xs mb-1">Living Room Design</div>
              <div className="text-[11px] text-gray-500">Natural Modern concept ready with 4 variations.</div>
            </div>
            <div
              onClick={() => onNavigate('/app/floor-plans')}
              className="p-4 bg-white hover:bg-[#E4F3F4]/30 rounded-2xl border border-[#E6E9ED] shadow-xs cursor-pointer transition-colors"
            >
              <div className="font-bold text-gray-900 text-xs mb-1">Conceptual Floor Plans</div>
              <div className="text-[11px] text-gray-500">2,400 sq ft plot with 1,860 sq ft built-up layout.</div>
            </div>
            <div
              onClick={() => onNavigate('/app/budget')}
              className="p-4 bg-white hover:bg-[#E4F3F4]/30 rounded-2xl border border-[#E6E9ED] shadow-xs cursor-pointer transition-colors"
            >
              <div className="font-bold text-gray-900 text-xs mb-1">Cost Estimator & Items</div>
              <div className="text-[11px] text-gray-500">8 committed and estimated items totaling $285,000.</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DESIGNS */}
      {activeTab === 'Designs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Generated Design Concepts</h3>
            <button
              onClick={() => onNavigate('/app/design-studio')}
              className="px-3 py-1.5 bg-[#006B7B] text-white rounded-xl text-xs font-semibold"
            >
              + Create New Room Design
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {designs.map((d) => (
              <div
                key={d.id}
                onClick={() => onNavigate(`/app/designs/${d.id}`)}
                className="p-4 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs hover:border-gray-300 transition-colors cursor-pointer group"
              >
                <img
                  src={d.afterImageUrl}
                  alt={d.name}
                  className="w-full h-44 rounded-xl object-cover mb-3"
                />
                <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#006B7B]">{d.name}</h4>
                <div className="text-[11px] text-gray-500 mt-0.5">{d.style} • {d.roomType} • {d.variations.length} variations</div>
                <p className="text-xs text-gray-600 mt-2 line-clamp-2">{d.designNotes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TASKS */}
      {activeTab === 'Tasks' && (
        <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Renovation Tasks & Milestones</h3>
          </div>

          <form onSubmit={handleAddTask} className="flex gap-2 text-xs">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new project task or contractor milestone..."
              className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#006B7B] text-white rounded-xl font-semibold hover:bg-[#004F5C]"
            >
              Add Task
            </button>
          </form>

          <div className="space-y-2 text-xs">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center justify-between"
              >
                <div
                  onClick={() => archMindStore.toggleTaskStatus(task.id)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-md border border-gray-300 flex items-center justify-center bg-white">
                    {task.status === 'Completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div>
                    <div className={`font-semibold ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {task.title}
                    </div>
                    <div className="text-[10px] text-gray-400">Due {task.dueDate} • {task.category}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-semibold">
                    {task.priority}
                  </span>
                  <button
                    onClick={() => archMindStore.deleteTask(task.id)}
                    className="p-1 text-gray-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DOCUMENTS */}
      {activeTab === 'Documents' && (
        <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Project Documents</h3>
            <button
              onClick={() => onNavigate('/app/documents')}
              className="text-xs text-[#006B7B] font-semibold hover:underline"
            >
              Open Document Vault →
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#006B7B]" />
                  <div>
                    <div className="font-semibold text-gray-900">{doc.title}</div>
                    <div className="text-[10px] text-gray-400">{doc.category} • {doc.fileSize}</div>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Downloading ${doc.title}...`)}
                  className="text-xs text-[#006B7B] font-medium hover:underline"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FLOOR PLANS & BUDGET REDIRECTS */}
      {activeTab === 'Floor Plans' && (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#E6E9ED] space-y-3">
          <Maximize2 className="w-10 h-10 text-[#006B7B] mx-auto" />
          <h3 className="font-bold text-gray-900 text-base">Interactive Floor Plans Available</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            You have 3 active layout concepts for this 2,400 sq ft plot with deterministic area calculations.
          </p>
          <button
            onClick={() => onNavigate('/app/floor-plans')}
            className="px-5 py-2.5 bg-[#006B7B] text-white rounded-xl text-xs font-semibold"
          >
            Launch Floor Plans & Planning Studio
          </button>
        </div>
      )}

      {activeTab === 'Budget' && (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#E6E9ED] space-y-3">
          <PieChart className="w-10 h-10 text-[#006B7B] mx-auto" />
          <h3 className="font-bold text-gray-900 text-base">Full Budget Planner</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            8 cost items currently totaling ${budgetSummary.totalEstimated.toLocaleString()} across construction and furnishing.
          </p>
          <button
            onClick={() => onNavigate('/app/budget')}
            className="px-5 py-2.5 bg-[#006B7B] text-white rounded-xl text-xs font-semibold"
          >
            Launch Budget Planner Module
          </button>
        </div>
      )}

    </div>
  );
};
