import React, { useState, useEffect } from 'react';
import {
  User,
  Settings,
  DollarSign,
  Maximize2,
  Key,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  Save,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { aiService } from '../services/aiService';

interface SettingsPageProps {
  onNavigate: (route: string) => void;
  onSignOut?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate, onSignOut }) => {
  const user = archMindStore.getUser();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [currency, setCurrency] = useState(user.preferredCurrency);
  const [unitSystem, setUnitSystem] = useState(user.unitSystem);
  const [apiKey, setApiKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Live AI engine health status
  const [aiHealth, setAiHealth] = useState<{ checked: boolean; operational: boolean; hasKey: boolean }>({
    checked: false,
    operational: false,
    hasKey: false,
  });
  const [isCheckingAi, setIsCheckingAi] = useState(false);

  const checkAiStatus = async () => {
    setIsCheckingAi(true);
    const res = await aiService.checkHealth();
    setAiHealth({
      checked: true,
      operational: res.operational,
      hasKey: res.hasGeminiKey,
    });
    setIsCheckingAi(false);
  };

  useEffect(() => {
    checkAiStatus();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    archMindStore.setUser({
      ...user,
      name,
      email,
      role: role as any,
      preferredCurrency: currency as any,
      unitSystem: unitSystem as any,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data back to initial Modern Terrace House demo state?')) {
      archMindStore.resetToDemo();
      alert('Demo data restored successfully!');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      
      {/* Header */}
      <div>
        <div className="text-[11px] font-semibold text-[#006B7B] uppercase tracking-wider mb-0.5">
          Workspace Settings
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] tracking-tight">
          Account & Preferences
        </h1>
        <p className="text-xs text-[#667085] mt-1">
          Manage your personal profile, localization standards, and Google Gemini AI configurations.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile preferences saved successfully!</span>
        </div>
      )}

      {/* Profile Card */}
      <form onSubmit={handleSaveProfile} className="p-6 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-4 text-xs">
        <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <User className="w-4 h-4 text-[#006B7B]" />
          <span>Profile Information</span>
        </h2>

        <div className="flex items-center gap-4 py-2">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-600/20"
          />
          <div>
            <div className="font-bold text-gray-900 text-sm">{user.name}</div>
            <div className="text-gray-500 text-[11px]">{user.role} • {user.email}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">User Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900"
            >
              <option value="Homeowner">Homeowner</option>
              <option value="Architect">Architect</option>
              <option value="Designer">Designer</option>
              <option value="Developer">Developer</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Preferred Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900"
            >
              <option value="INR">INR - Indian Rupee (₹)</option>
              <option value="USD">USD - US Dollar ($)</option>
              <option value="EUR">EUR - Euro (€)</option>
              <option value="GBP">GBP - British Pound (£)</option>
              <option value="MYR">MYR - Malaysian Ringgit (RM)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Area Unit</label>
            <select
              value={unitSystem}
              onChange={(e) => setUnitSystem(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
            >
              <option value="sqft">Square Feet (sq ft)</option>
              <option value="sqm">Square Meters (sq m)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl font-semibold shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* AI Engine Status Card */}
      <div className="p-6 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Google Gemini AI Engine Integration</span>
          </h2>
          <button
            onClick={checkAiStatus}
            disabled={isCheckingAi}
            className="flex items-center gap-1 text-[#006B7B] hover:underline font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingAi ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${aiHealth.operational ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <div>
              <div className="font-semibold text-gray-900">ArchMind AI Backend Service</div>
              <div className="text-[11px] text-gray-500">
                {aiHealth.operational ? 'Operational on Node / Vite Engine' : 'Checking status...'}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${aiHealth.hasKey ? 'bg-emerald-500' : 'bg-blue-500'}`} />
            <div>
              <div className="font-semibold text-gray-900">GEMINI_API_KEY Secret</div>
              <div className="text-[11px] text-gray-500">
                {aiHealth.hasKey ? 'Configured in server environment' : 'Using smart fallback generation'}
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed">
          ArchMind connects directly to Google Gemini 2.5 Flash for multimodal space understanding and Imagen 3 for photorealistic interior rendering. When running without external API keys, the application utilizes high-resolution architectural concept pipelines with full mathematical determinism.
        </p>
      </div>

      {/* Danger Zone / Reset Demo Data */}
      <div className="p-6 bg-rose-50/50 rounded-2xl border border-rose-200/60 space-y-3 text-xs">
        <h3 className="font-bold text-rose-950 text-sm">Demo Data Management</h3>
        <p className="text-rose-800 leading-relaxed">
          Need to restore the initial Modern Terrace House walkthrough dataset from the screenshots? You can reset your local workspace anytime.
        </p>
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleResetData}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-xs"
          >
            Reset Workspace to Demo Data
          </button>
          <button
            onClick={() => onSignOut?.()}
            className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-100 rounded-xl font-semibold"
          >
            Sign Out
          </button>
        </div>
      </div>

    </div>
  );
};
