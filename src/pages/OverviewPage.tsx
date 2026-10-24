import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  Folder,
  ArrowRight,
  TrendingUp,
  PieChart,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  ShoppingBag,
  Leaf,
  Clock,
  Play,
  Calendar,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { formatINR } from '../utils/formatters';

interface OverviewPageProps {
  onNavigate: (route: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const [, setTick] = useState(0);
  useEffect(() => {
    return archMindStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const user = archMindStore.getUser();
  const activeProject = archMindStore.getActiveProject();
  const projects = archMindStore.getProjects();
  const designs = archMindStore.getDesigns();
  const tasks = archMindStore.getTasks();
  const summary = archMindStore.getBudgetSummary();

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Dynamic Greeting & Date Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] tracking-tight">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-[#667085] mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span className="text-[#006B7B] font-semibold">Active: {activeProject?.name}</span>
          </p>
        </div>

        <button
          onClick={() => onNavigate('/app/design-studio')}
          className="flex items-center gap-2 px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Launch AI Studio</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 4 TOP SUMMARY KPI CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* KPI 1: Active Projects */}
        <div
          onClick={() => onNavigate('/app/projects')}
          className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs hover:border-gray-300 transition-colors cursor-pointer"
        >
          <div className="text-xs font-medium text-gray-500 mb-1 flex items-center justify-between">
            <span>Active Projects</span>
            <Folder className="w-4 h-4 text-[#006B7B]" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
          <div className="text-[11px] text-gray-400 mt-1">{projects.filter(p => p.status === 'In Progress').length} in progress</div>
        </div>

        {/* KPI 2: Saved Designs */}
        <div
          onClick={() => onNavigate('/app/designs/des_modern_living')}
          className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs hover:border-gray-300 transition-colors cursor-pointer"
        >
          <div className="text-xs font-medium text-gray-500 mb-1 flex items-center justify-between">
            <span>Saved Designs</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{designs.length + 3}</div>
          <div className="text-[11px] text-gray-400 mt-1">Across {designs.length} rooms</div>
        </div>

        {/* KPI 3: Budget in Use */}
        <div
          onClick={() => onNavigate('/app/budget')}
          className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs hover:border-gray-300 transition-colors cursor-pointer"
        >
          <div className="text-xs font-medium text-gray-500 mb-1 flex items-center justify-between">
            <span>Budget in Use</span>
            <PieChart className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatINR(summary.committedOrPaid, { compact: true })}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            {summary.allocatedPercentage}% of {formatINR(summary.budgetLimit, { compact: true })}
          </div>
        </div>

        {/* KPI 4: Pending Tasks */}
        <div
          onClick={() => onNavigate(`/app/projects/${activeProject?.id}`)}
          className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs hover:border-gray-300 transition-colors cursor-pointer"
        >
          <div className="text-xs font-medium text-gray-500 mb-1 flex items-center justify-between">
            <span>Pending Tasks</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{pendingTasks.length}</div>
          <div className="text-[11px] text-gray-400 mt-1">
            {tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length} urgent items
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* AI DESIGN STUDIO HERO PROMO BANNER */}
      {/* ========================================================= */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#004F5C] via-[#006B7B] to-teal-800 rounded-3xl text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-[11px] font-semibold text-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Design Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
            Design My Room
          </h2>
          <p className="text-xs text-teal-100/90 leading-relaxed">
            Upload any room photo to generate photorealistic architectural transformations with matching product specifications and cost calculations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('/app/design-studio')}
              className="px-5 py-2.5 bg-white text-[#006B7B] hover:bg-teal-50 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload a Space Photo</span>
            </button>
            <button
              onClick={() => onNavigate('/app/designs/des_modern_living')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Try a Sample</span>
            </button>
          </div>
        </div>

        {/* Before / After Thumbnail showcase */}
        <div className="relative w-72 h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl flex-shrink-0 hidden md:block">
          <img
            src="/assets/sample_room_ai_recommended.jpg"
            alt="Living room after"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-[10px] rounded-lg font-semibold">
            Natural Modern • Kuala Lumpur
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2-COLUMN DASHBOARD SECTIONS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Recent Projects + Quick Actions */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Recent Projects */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">Recent Projects</h3>
              <button
                onClick={() => onNavigate('/app/projects')}
                className="text-xs text-[#006B7B] font-medium hover:underline flex items-center gap-1"
              >
                <span>View All Projects</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onNavigate(`/app/projects/${proj.id}`)}
                  className="p-3.5 bg-gray-50/70 hover:bg-[#E4F3F4]/30 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={proj.coverImage}
                      alt={proj.name}
                      className="w-14 h-14 rounded-xl object-cover shadow-2xs flex-shrink-0"
                    />
                    <div>
                      <div className="font-bold text-gray-900 text-xs group-hover:text-[#006B7B]">
                        {proj.name}
                      </div>
                      <div className="text-[11px] text-gray-500">{proj.location} • {proj.projectType}</div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        Budget: {formatINR(proj.budgetLimit)} • {proj.builtUpArea} sqft
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full sm:w-44 flex flex-col gap-1">
                    <div className="flex justify-between text-[11px] text-gray-600">
                      <span>Progress</span>
                      <span className="font-semibold text-gray-900">{proj.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        style={{ width: `${proj.progressPercentage}%` }}
                        className="bg-[#006B7B] h-2 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <button
                onClick={() => onNavigate('/app/design-studio')}
                className="p-3.5 bg-gray-50 hover:bg-[#E4F3F4]/50 rounded-xl border border-gray-100 text-gray-800 transition-colors flex flex-col items-center gap-2"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#006B7B] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">AI Design</span>
              </button>

              <button
                onClick={() => onNavigate('/app/floor-plans')}
                className="p-3.5 bg-gray-50 hover:bg-[#E4F3F4]/50 rounded-xl border border-gray-100 text-gray-800 transition-colors flex flex-col items-center gap-2"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Floor Plans</span>
              </button>

              <button
                onClick={() => onNavigate('/app/products')}
                className="p-3.5 bg-gray-50 hover:bg-[#E4F3F4]/50 rounded-xl border border-gray-100 text-gray-800 transition-colors flex flex-col items-center gap-2"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Products</span>
              </button>

              <button
                onClick={() => onNavigate('/app/budget')}
                className="p-3.5 bg-gray-50 hover:bg-[#E4F3F4]/50 rounded-xl border border-gray-100 text-gray-800 transition-colors flex flex-col items-center gap-2"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <PieChart className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Budget</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Budget summary widget + Tasks + Sustainability */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Budget Widget */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-xs">Budget Summary</h3>
              <button
                onClick={() => onNavigate('/app/budget')}
                className="text-[11px] text-[#006B7B] font-semibold hover:underline"
              >
                Open Planner →
              </button>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-gray-400">Total Estimate</div>
                <div className="text-base font-bold text-gray-900">{formatINR(summary.totalEstimated)}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-400">Committed / Paid</div>
                <div className="text-base font-bold text-[#006B7B]">{formatINR(summary.committedOrPaid)}</div>
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-gray-500 pt-1">
              <span>Allocated: {summary.allocatedPercentage}%</span>
              <span>Items: {summary.itemCount}</span>
            </div>
          </div>

          {/* Pending Tasks & Reminders */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#006B7B]" />
                <span>Pending Reminders</span>
              </h3>
              <span className="text-[10px] text-gray-400">{pendingTasks.length} left</span>
            </div>

            <div className="space-y-2 text-xs">
              {pendingTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  onClick={() => archMindStore.toggleTaskStatus(task.id)}
                  className="p-2.5 bg-gray-50/80 hover:bg-[#E4F3F4]/50 rounded-xl border border-gray-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center hover:border-[#006B7B]">
                      {task.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-gray-800 text-[11px] font-medium">{task.title}</span>
                  </div>
                  <span className="text-[9px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-semibold">
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sustainability Tip */}
          <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Sustainability Impact Tip</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Incorporate cross-ventilation in your terrace layout to reduce air-conditioning load by up to 28% annually.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
