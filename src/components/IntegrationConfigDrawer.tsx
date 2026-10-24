import React, { useState } from 'react';
import { X, Settings2, ExternalLink, Check, RotateCcw, Shield } from 'lucide-react';
import { getMainAppUrl, setMainAppUrl, isMainAppUrlConfigured, DEFAULT_MAIN_APP_URL } from '../config/appConfig';
import { authService } from '../services/authService';

interface IntegrationConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onTargetUrlChanged?: () => void;
}

export const IntegrationConfigDrawer: React.FC<IntegrationConfigDrawerProps> = ({
  isOpen,
  onClose,
  onTargetUrlChanged,
}) => {
  const [urlInput, setUrlInput] = useState(getMainAppUrl());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const currentUser = authService.getCurrentUser();

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMainAppUrl(urlInput);
    setSavedSuccess(true);
    onTargetUrlChanged?.();
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetToDefault = () => {
    setMainAppUrl('');
    setUrlInput(DEFAULT_MAIN_APP_URL);
    onTargetUrlChanged?.();
  };

  const isConfigured = isMainAppUrlConfigured();

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#20211F]/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FFFFFF] border-l border-[#E5E4DE] w-full max-w-md h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E4DE]">
            <div className="flex items-center gap-2.5">
              <Settings2 className="w-5 h-5 text-[#55C7D9]" />
              <h2 className="text-base font-bold text-[#20211F] tracking-tight">
                Web App Integration Layer
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#747670] hover:text-[#20211F] p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C7D9]"
              aria-label="Close configuration"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Architecture Overview */}
          <div className="p-4 bg-[#F7F6F2] rounded-xl border border-[#E5E4DE] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#20211F]">Target Destination State:</span>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded font-medium ${
                  isConfigured
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isConfigured ? 'Live Host Configured' : 'Placeholder Mode'}
              </span>
            </div>
            <p className="text-[#747670] leading-relaxed">
              Section 7 integration requirement: The landing page and authentication screens serve as entry points to a separate ArchMind web application.
            </p>
          </div>

          {/* Target URL Configuration Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#20211F] uppercase tracking-wider mb-2">
                Main ArchMind Web App URL
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://app.archmind.ai"
                required
                className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5E4DE] rounded-xl text-xs font-mono text-[#20211F] focus:outline-none focus:ring-2 focus:ring-[#55C7D9]"
              />
              <p className="mt-1.5 text-[11px] text-[#747670]">
                Can be set via <code className="bg-[#F7F6F2] px-1 py-0.5 rounded text-[#20211F]">VITE_MAIN_APP_URL</code> in environment or configured here.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#20211F] hover:bg-[#35B6C9] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#55C7D9]" />
                    <span>Configuration Saved</span>
                  </>
                ) : (
                  <span>Update Destination</span>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="p-2.5 border border-[#E5E4DE] text-[#747670] hover:text-[#20211F] rounded-xl transition-colors"
                title="Reset to default placeholder"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Current Session Inspector */}
          <div className="pt-4 border-t border-[#E5E4DE] space-y-3">
            <h3 className="text-xs font-semibold text-[#20211F] uppercase tracking-wider">
              Current Authentication State
            </h3>
            {currentUser ? (
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-900">Active User:</span>
                  <span className="font-mono text-[11px] text-emerald-700">{currentUser.provider}</span>
                </div>
                <p className="font-mono text-[11px] text-emerald-950 truncate">{currentUser.email}</p>
                <button
                  type="button"
                  onClick={() => authService.signOut()}
                  className="mt-2 text-[11px] text-rose-700 hover:underline block"
                >
                  End Active Session (Sign Out)
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#747670]">
                No user currently authenticated. Sign In or Sign Up to test session creation.
              </p>
            )}
          </div>

          {/* Security & Handoff Policy */}
          <div className="p-3.5 bg-[#F7F6F2] rounded-xl border border-[#E5E4DE] flex items-start gap-2.5 text-xs text-[#747670]">
            <Shield className="w-4 h-4 text-[#20211F] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-[#20211F] block">Zero Token Leakage</span>
              <span>
                Handoff does not pass raw tokens in URL queries. Production integration connects to Firebase Authentication or shared SSO domain cookies.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[#E5E4DE]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#F7F6F2] hover:bg-[#E5E4DE] text-[#20211F] rounded-xl text-xs font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
