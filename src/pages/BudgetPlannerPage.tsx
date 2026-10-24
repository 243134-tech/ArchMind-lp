import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Info,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Check,
  X,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { BudgetItem, CostCategory, CostItemStatus } from '../types';
import { formatINR } from '../utils/formatters';

interface BudgetPlannerPageProps {
  onNavigate: (route: string) => void;
}

export const BudgetPlannerPage: React.FC<BudgetPlannerPageProps> = ({ onNavigate }) => {
  const [, setTick] = useState(0);
  useEffect(() => {
    return archMindStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const activeProject = archMindStore.getActiveProject();
  const summary = archMindStore.getBudgetSummary();
  const rawItems = archMindStore.getBudgetItems();
  const assumptions = archMindStore.getAssumptions();
  const costSavings = archMindStore.getCostSavings();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [breakdownView, setBreakdownView] = useState<'category' | 'phase'>('category');
  const [showDiff, setShowDiff] = useState(true);

  // Add / Edit Modal state
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<CostCategory>('Construction');
  const [formUnit, setFormUnit] = useState('sqft');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formUnitCost, setFormUnitCost] = useState(100);
  const [formStatus, setFormStatus] = useState<CostItemStatus>('Estimated');
  const [formNotes, setFormNotes] = useState('');

  // Missing inputs interactive checklist
  const [missingInputs, setMissingInputs] = useState([
    { id: 'm1', title: 'Final flooring material selection', subtitle: 'Affects interior finishing cost', resolved: false },
    { id: 'm2', title: 'Air conditioning system', subtitle: 'Add brand and quantity specifications', resolved: false },
    { id: 'm3', title: 'Smart home system', subtitle: 'Specify scope and automation devices', resolved: false },
  ]);

  const categories: CostCategory[] = [
    'Construction',
    'Furnishing',
    'Fixtures & Fittings',
    'Labour',
    'Contingency',
  ];

  const categoryColors: Record<string, string> = {
    Construction: '#0284C7',
    Furnishing: '#F43F5E',
    'Fixtures & Fittings': '#EAB308',
    Labour: '#8B5CF6',
    Contingency: '#10B981',
  };

  const filteredItems = rawItems.filter((item) => {
    if (activeCategoryFilter === 'All') return true;
    return item.category === activeCategoryFilter;
  });

  const openAddItemModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('Construction');
    setFormUnit('sqft');
    setFormQuantity(1);
    setFormUnitCost(50);
    setFormStatus('Estimated');
    setFormNotes('');
    setItemModalOpen(true);
  };

  const openEditItemModal = (item: BudgetItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormUnit(item.unit);
    setFormQuantity(item.quantity);
    setFormUnitCost(item.unitCost);
    setFormStatus(item.status);
    setFormNotes(item.notes || '');
    setItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      archMindStore.updateBudgetItem(editingItem.id, {
        name: formName.trim(),
        category: formCategory,
        unit: formUnit,
        quantity: Number(formQuantity),
        unitCost: Number(formUnitCost),
        status: formStatus,
        notes: formNotes.trim(),
      });
    } else {
      archMindStore.addBudgetItem({
        projectId: activeProject?.id || 'proj_modern_terrace',
        name: formName.trim(),
        category: formCategory,
        unit: formUnit,
        quantity: Number(formQuantity),
        unitCost: Number(formUnitCost),
        status: formStatus,
        notes: formNotes.trim(),
      });
    }

    setItemModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this cost item?')) {
      archMindStore.deleteBudgetItem(id);
    }
  };

  const exportCsv = () => {
    const headers = 'Item,Category,Unit,Quantity,Unit Cost,Total Cost,Status,Notes\n';
    const rows = rawItems
      .map(
        (i) =>
          `"${i.name}","${i.category}","${i.unit}",${i.quantity},${i.unitCost},${i.totalCost},"${i.status}","${i.notes || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ArchMind_Budget_${activeProject?.name || 'Project'}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate(`/app/projects/${activeProject?.id}`)}
            className="flex items-center gap-1.5 text-xs text-[#006B7B] font-medium hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Project</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] tracking-tight">
            Budget Planner
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Plan, estimate and optimize your project costs with AI-powered insights.
          </p>
        </div>

        {/* Project Badge / Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 p-2 pr-3.5 bg-white rounded-2xl border border-[#E6E9ED] shadow-2xs">
            <img
              src={activeProject?.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80'}
              alt="Project"
              className="w-9 h-9 rounded-xl object-cover"
            />
            <div className="text-left text-xs">
              <div className="font-semibold text-gray-900">{activeProject?.name}</div>
              <div className="text-[11px] text-gray-500">{activeProject?.location}</div>
            </div>
          </div>

          <button
            onClick={exportCsv}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E6E9ED] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-medium transition-colors shadow-2xs"
            title="Export CSV"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5 TOP KPI CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Total Estimated Cost */}
        <div className="lg:col-span-2 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-medium text-gray-600 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Total Estimated Project Cost
              </span>
              <Info className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight mt-1">
              {formatINR(summary.totalEstimated)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              Estimated range: {formatINR(Math.round(summary.totalEstimated * 0.91))} – {formatINR(Math.round(summary.totalEstimated * 1.09))}
            </div>
          </div>

          {/* Visual Range Slider */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="relative w-full h-2 bg-gradient-to-r from-emerald-100 via-teal-300 to-amber-200 rounded-full">
              <div className="absolute left-[48%] -top-1 w-4 h-4 bg-[#006B7B] rounded-full border-2 border-white shadow-xs"></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-mono">
              <span>Low {formatINR(Math.round(summary.totalEstimated * 0.91), { compact: true })}</span>
              <span className="font-semibold text-gray-700">Most Likely {formatINR(summary.totalEstimated, { compact: true })}</span>
              <span>High {formatINR(Math.round(summary.totalEstimated * 1.09), { compact: true })}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Cost / sqft */}
        <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-medium text-gray-600">Estimated Cost</span>
              <Info className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
              {formatINR(summary.costPerSqft)} <span className="text-sm font-normal text-gray-500">/ sqft</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100">
            Based on {activeProject?.builtUpArea?.toLocaleString() || '2,280'} sqft built-up area
          </div>
        </div>

        {/* KPI 3: Budget Allocated */}
        <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-gray-600">Budget Allocated</div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
                {summary.allocatedPercentage}%
              </div>
            </div>
            {/* Circular Progress Gauge */}
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E6E9ED" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#006B7B"
                  strokeWidth="4"
                  strokeDasharray="88"
                  strokeDashoffset={88 - (88 * Math.min(summary.allocatedPercentage, 100)) / 100}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100">
            {formatINR(summary.committedOrPaid)} of {formatINR(summary.budgetLimit)}
          </div>
        </div>

        {/* KPI 4: Cost Items & Missing Inputs */}
        <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-medium text-gray-600">Cost Items</div>
            <div className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
              {summary.itemCount}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              Across {Object.keys(summary.categoryTotals).length} categories
            </div>
          </div>
          <div className="text-[11px] text-amber-700 bg-amber-50 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 border border-amber-200/50 mt-3">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{missingInputs.filter((m) => !m.resolved).length} Missing Inputs</span>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* MIDDLE SECTION: CHARTS + ASSUMPTIONS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Budget Breakdown Donut Chart (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Budget Breakdown</h2>
              <p className="text-[11px] text-gray-500">Estimated cost by category</p>
            </div>
            <div className="flex bg-gray-100 p-0.5 rounded-xl text-[11px] font-medium text-gray-600">
              <button
                onClick={() => setBreakdownView('category')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  breakdownView === 'category' ? 'bg-[#006B7B] text-white' : 'hover:text-gray-900'
                }`}
              >
                By Category
              </button>
              <button
                onClick={() => setBreakdownView('phase')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  breakdownView === 'phase' ? 'bg-[#006B7B] text-white' : 'hover:text-gray-900'
                }`}
              >
                By Phase
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-6 py-2">
            
            {/* SVG Donut Chart */}
            <div className="sm:col-span-6 flex justify-center relative">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                {/* 5 Donut Slices */}
                <circle cx="50" cy="50" r="34" fill="none" stroke="#0284C7" strokeWidth="18" strokeDasharray="90 124" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="34" fill="none" stroke="#F43F5E" strokeWidth="18" strokeDasharray="36 178" strokeDashoffset="-90" />
                <circle cx="50" cy="50" r="34" fill="none" stroke="#EAB308" strokeWidth="18" strokeDasharray="28 186" strokeDashoffset="-126" />
                <circle cx="50" cy="50" r="34" fill="none" stroke="#8B5CF6" strokeWidth="18" strokeDasharray="38 176" strokeDashoffset="-154" />
                <circle cx="50" cy="50" r="34" fill="none" stroke="#10B981" strokeWidth="18" strokeDasharray="24 190" strokeDashoffset="-192" />
              </svg>
              {/* Inner Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-bold text-gray-900">{formatINR(summary.totalEstimated, { compact: true })}</span>
                <span className="text-[10px] text-gray-400 font-medium">Total Estimate</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="sm:col-span-6 space-y-2 text-xs">
              {categories.map((cat) => {
                const total = summary.categoryTotals[cat] || 0;
                const pct = summary.totalEstimated ? Math.round((total / summary.totalEstimated) * 100) : 0;
                return (
                  <div key={cat} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: categoryColors[cat] || '#888' }}
                      />
                      <span className="text-gray-700">{cat}</span>
                    </div>
                    <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <span>{formatINR(total)}</span>
                      <span className="text-[10px] text-gray-400 font-normal w-7 text-right">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Budget vs Spend Bar Chart (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Budget vs. Spend</h2>
              <p className="text-[11px] text-gray-500">Estimated budget compared to actuals</p>
            </div>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">Cumulative</span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-gray-100">
            {[
              { cat: 'Construction', est: summary.categoryTotals['Construction'] || 1152000, act: 720000 },
              { cat: 'Furnishing', est: summary.categoryTotals['Furnishing'] || 420000, act: 180000 },
              { cat: 'Fixtures', est: summary.categoryTotals['Fixtures & Fittings'] || 360000, act: 120000 },
              { cat: 'Labour', est: summary.categoryTotals['Labour'] || 510000, act: 240000 },
              { cat: 'Contingency', est: summary.categoryTotals['Contingency'] || 300000, act: 90000 },
            ].map((col, idx) => {
              const maxVal = 1300000;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full flex justify-center items-end gap-1 h-32">
                    {/* Estimated bar */}
                    <div
                      style={{ height: `${Math.min((col.est / maxVal) * 100, 100)}%` }}
                      className="w-3.5 bg-gray-200 rounded-t group-hover:bg-gray-300 transition-colors relative"
                      title={`Estimated: ${formatINR(col.est, { compact: true })}`}
                    >
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 font-medium hidden group-hover:block whitespace-nowrap">
                        {formatINR(col.est, { compact: true })}
                      </span>
                    </div>
                    {/* Actual bar */}
                    <div
                      style={{ height: `${Math.min((col.act / maxVal) * 100, 100)}%` }}
                      className="w-3.5 bg-[#006B7B] rounded-t transition-colors relative"
                      title={`Actual: ${formatINR(col.act, { compact: true })}`}
                    >
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-[#006B7B] font-semibold hidden group-hover:block whitespace-nowrap">
                        {formatINR(col.act, { compact: true })}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 truncate w-full text-center">{col.cat.slice(0, 5)}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 text-[11px] text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-200 rounded-sm"></span>
              <span>Estimated Budget</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#006B7B] rounded-sm"></span>
              <span>Actual / Committed</span>
            </div>
          </div>
        </div>

        {/* Assumptions & Missing Inputs Card (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Assumptions */}
          <div className="p-4 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <span className="text-[#006B7B]">●</span> Assumptions
              </h3>
              <button className="text-[11px] text-[#006B7B] font-medium hover:underline">Edit</button>
            </div>
            <ul className="space-y-1.5 text-[11px] text-gray-600">
              {assumptions.map((a) => (
                <li key={a.id} className="flex items-start gap-1.5">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{a.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Inputs */}
          <div className="p-4 bg-white rounded-2xl border border-amber-200/60 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Missing Inputs ({missingInputs.filter((m) => !m.resolved).length})
              </h3>
            </div>
            <div className="space-y-2">
              {missingInputs.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setMissingInputs((prev) =>
                      prev.map((m) => (m.id === item.id ? { ...m, resolved: !m.resolved } : m))
                    );
                  }}
                  className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    item.resolved
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800 line-through'
                      : 'bg-amber-50/40 border-amber-200/50 hover:bg-amber-50 text-gray-800'
                  }`}
                >
                  <div>
                    <div className="font-medium text-[11px]">{item.title}</div>
                    <div className="text-[10px] text-gray-500">{item.subtitle}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* BOTTOM SECTION: COST ITEMS TABLE */}
      {/* ========================================================= */}
      <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-4">
        
        {/* Table Filters & Actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-gray-900 mr-2 flex-shrink-0">Cost Items</span>
            {['All', ...categories].map((cat) => {
              const count =
                cat === 'All' ? rawItems.length : rawItems.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    activeCategoryFilter === cat
                      ? 'bg-[#E4F3F4] text-[#006B7B] font-semibold border border-teal-200'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          <button
            onClick={openAddItemModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex-shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Real Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-gray-500 font-medium border-b border-gray-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input type="checkbox" className="rounded text-[#006B7B]" />
                </th>
                <th className="py-3 px-3">Item</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Unit</th>
                <th className="py-3 px-3 text-right">Quantity</th>
                <th className="py-3 px-3 text-right">Unit Cost (₹)</th>
                <th className="py-3 px-3 text-right font-semibold">Total Cost (₹)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors group">
                  <td className="py-3.5 px-3">
                    <input type="checkbox" className="rounded text-[#006B7B]" />
                  </td>
                  <td className="py-3.5 px-3 font-medium text-gray-900">
                    <div>{item.name}</div>
                    {item.notes && <div className="text-[10px] text-gray-400 font-normal">{item.notes}</div>}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                      style={{
                        backgroundColor: `${categoryColors[item.category] || '#888'}15`,
                        color: categoryColors[item.category] || '#333',
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-gray-600">{item.unit}</td>
                  <td className="py-3.5 px-3 text-right text-gray-700">{item.quantity.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right text-gray-700">{formatINR(item.unitCost)}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-gray-900">
                    {formatINR(item.totalCost)}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        item.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.status === 'Committed'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => openEditItemModal(item)}
                        className="p-1 text-gray-400 hover:text-[#006B7B] rounded transition-colors"
                        title="Edit Item"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ========================================================= */}
      {/* COST-SAVING SUGGESTIONS & DESIGN CHOICES COMPARISON */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* AI Cost-Saving Suggestions (6 cols) */}
        <div className="lg:col-span-6 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Cost-Saving Suggestions</span>
            </h3>
            <span className="text-[11px] text-[#006B7B] font-medium hover:underline cursor-pointer">View all 3</span>
          </div>

          <div className="space-y-2.5">
            {costSavings.map((s) => (
              <div
                key={s.id}
                className="p-3 bg-gray-50/70 hover:bg-[#E4F3F4]/40 rounded-xl border border-gray-100 flex items-center gap-3 transition-colors"
              >
                {s.imageUrl && (
                  <img src={s.imageUrl} alt={s.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-xs">{s.title}</div>
                  <div className="text-[11px] text-gray-500 line-clamp-1">{s.description}</div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                    Save ~{formatINR(s.savingAmount)}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Compare Material / Design Choices (6 cols) */}
        <div className="lg:col-span-6 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Compare Material / Design Choices</h3>
              <p className="text-[11px] text-gray-500">See how different finish tiers affect your total budget</p>
            </div>
            <label className="flex items-center gap-2 text-[11px] text-gray-500 cursor-pointer">
              <span>Show difference</span>
              <input
                type="checkbox"
                checked={showDiff}
                onChange={(e) => setShowDiff(e.target.checked)}
                className="rounded text-[#006B7B]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            
            {/* Current Selection */}
            <div className="p-3 rounded-xl border-2 border-[#006B7B] bg-[#E4F3F4]/30 relative flex flex-col justify-between">
              <span className="text-[9px] bg-[#006B7B] text-white px-1.5 py-0.5 rounded font-semibold w-max mb-1">
                Current Selection
              </span>
              <div>
                <div className="font-bold text-gray-900 text-xs">Standard Finishes</div>
                <div className="text-[10px] text-gray-500">Engineered wood, modular kitchen, standard sanitary</div>
              </div>
              <div className="text-sm font-bold text-gray-900 mt-2">
                {formatINR(summary.totalEstimated)}
              </div>
            </div>

            {/* Premium Option */}
            <div className="p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors flex flex-col justify-between">
              <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold w-max mb-1">
                Premium Option
              </span>
              <div>
                <div className="font-bold text-gray-900 text-xs">Premium Finishes</div>
                <div className="text-[10px] text-gray-500">Natural stone, custom millwork, premium sanitary</div>
              </div>
              <div className="mt-2">
                <span className="text-sm font-bold text-gray-900">{formatINR(3280000)}</span>
                {showDiff && <span className="text-[10px] font-semibold text-rose-600 ml-1">+18%</span>}
              </div>
            </div>

            {/* Value Option */}
            <div className="p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors flex flex-col justify-between">
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold w-max mb-1">
                Value Option
              </span>
              <div>
                <div className="font-bold text-gray-900 text-xs">Value Finishes</div>
                <div className="text-[10px] text-gray-500">Laminate flooring, standard modular, standard fittings</div>
              </div>
              <div className="mt-2">
                <span className="text-sm font-bold text-gray-900">{formatINR(2350000)}</span>
                {showDiff && <span className="text-[10px] font-semibold text-emerald-600 ml-1">-15%</span>}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* ADD / EDIT COST ITEM MODAL */}
      {/* ========================================================= */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E6E9ED] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <h3 className="font-bold text-gray-900 text-sm">
                {editingItem ? 'Edit Cost Item' : 'Add New Cost Item'}
              </h3>
              <button onClick={() => setItemModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Master Bedroom Engineered Wood Flooring"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CostCategory)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as CostItemStatus)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900"
                  >
                    <option value="Estimated">Estimated</option>
                    <option value="Committed">Committed</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="sqft, lot, set"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={formUnitCost}
                    onChange={(e) => setFormUnitCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">Calculated Total Cost:</span>
                <span className="font-bold text-gray-900 text-sm">
                  {formatINR(Number(formQuantity) * Number(formUnitCost))}
                </span>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Notes / Supplier</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Optional specifications or vendor details"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl font-medium"
                >
                  {editingItem ? 'Save Changes' : 'Add Cost Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
