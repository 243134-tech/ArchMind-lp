import React, { useState } from 'react';
import {
  Wrench,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  X,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { MaintenanceTask } from '../types';

interface MaintenancePageProps {
  onNavigate: (route: string) => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({ onNavigate }) => {
  const activeProject = archMindStore.getActiveProject();
  const tasks = archMindStore.getMaintenance();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MaintenanceTask['category']>('HVAC');
  const [frequency, setFrequency] = useState<MaintenanceTask['frequency']>('Quarterly');
  const [dueDate, setDueDate] = useState('2025-07-15');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    archMindStore.toggleMaintenanceStatus(
      archMindStore.getMaintenance()[0]?.id || ''
    ); // test reactive trigger

    // Custom add to store
    setAddModalOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-[#006B7B] uppercase tracking-wider mb-0.5">
            Asset Lifecycle & Care
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] tracking-tight">
            Home Maintenance
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Keep your newly renovated residence operating in peak condition with scheduled equipment servicing.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Maintenance Task</span>
        </button>
      </div>

      {/* AI Servicing Schedule Tip */}
      <div className="p-4 bg-teal-50/70 border border-teal-200/60 rounded-2xl flex items-center justify-between text-xs text-teal-950">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-[#006B7B] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold">AI Servicing Recommendation:</span>
            <span className="text-teal-800 ml-1">
              Your 4 inverter AC units require chemical coil service in June before peak summer heat.
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('/app/professionals')}
          className="text-xs font-bold text-[#006B7B] hover:underline flex-shrink-0 ml-2"
        >
          Book AC Technician →
        </button>
      </div>

      {/* Maintenance Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start sm:items-center gap-3.5">
              <button
                onClick={() => archMindStore.toggleMaintenanceStatus(task.id)}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 sm:mt-0 ${
                  task.status === 'Completed'
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-gray-300 hover:border-[#006B7B] bg-white'
                }`}
              >
                {task.status === 'Completed' && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <div>
                <div className={`font-semibold text-xs ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                  {task.title}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">{task.notes}</div>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1">
                  <span>Frequency: {task.frequency}</span>
                  <span>•</span>
                  <span>Category: {task.category}</span>
                  {task.lastCompletedDate && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700">Last Done: {task.lastCompletedDate}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="text-right text-xs">
                <div className="font-semibold text-gray-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Due {task.dueDate}</span>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-semibold">
                  {task.priority} Priority
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E6E9ED] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <h3 className="font-bold text-gray-900 text-sm">Add Maintenance Task</h3>
              <button onClick={() => setAddModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solar Inverter System Inspection"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
                  >
                    <option value="HVAC">HVAC</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Exterior">Exterior</option>
                    <option value="Appliances">Appliances</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Bi-annually">Bi-annually</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Next Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl font-medium"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
