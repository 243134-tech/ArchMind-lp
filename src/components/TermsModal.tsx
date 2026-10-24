import React from 'react';
import { X, Shield } from 'lucide-react';

interface TermsModalProps {
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ type, onClose }) => {
  const isTerms = type === 'terms';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#20211F]/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-xl relative max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E4DE]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#55C7D9]" />
            <h2 className="text-lg font-bold text-[#20211F] tracking-tight">
              {isTerms ? 'ArchMind Terms of Service' : 'ArchMind Privacy Policy'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#747670] hover:text-[#20211F] p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C7D9]"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-6 space-y-4 text-xs sm:text-sm text-[#747670] leading-relaxed">
          {isTerms ? (
            <>
              <p className="font-semibold text-[#20211F]">
                1. Acceptance of Terms
              </p>
              <p>
                By creating an account or accessing the ArchMind platform, you agree to comply with these terms governing architectural visualization, space exploration, and AI-assisted design concepts.
              </p>
              <p className="font-semibold text-[#20211F]">
                2. Nature of Architectural AI Visualizations
              </p>
              <p>
                ArchMind generates conceptual architectural visualizations and exploratory space models. While our models incorporate architectural logic, all structural modifications, permitting, and engineering work must be validated by certified civil or structural engineers prior to construction.
              </p>
              <p className="font-semibold text-[#20211F]">
                3. Intellectual Property & Space Imagery
              </p>
              <p>
                You retain ownership of photos, blueprints, and space scans you upload. ArchMind grants you full commercial rights to visualize, download, and utilize rendered architectural concepts generated for your spaces.
              </p>
              <p className="font-semibold text-[#20211F]">
                4. Account Security
              </p>
              <p>
                You are responsible for safeguarding your login credentials. Access to the connected ArchMind web application is protected by enterprise session tokens.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-[#20211F]">
                1. Data Protection & Spatial Privacy
              </p>
              <p>
                ArchMind treats your residential plans, space photography, and floorplans with strict confidentiality. We do not sell or monetize personal architectural scans to third-party data brokers.
              </p>
              <p className="font-semibold text-[#20211F]">
                2. Information Collected
              </p>
              <p>
                We collect your name, email address, authentication credentials, and project visualization preferences solely to maintain your account and deliver high-fidelity spatial renderings.
              </p>
              <p className="font-semibold text-[#20211F]">
                3. Encryption & Storage
              </p>
              <p>
                All account transmissions use TLS 1.3 encryption. Passwords and credentials are cryptographically hashed using standard enterprise identity frameworks (Firebase Auth / OIDC).
              </p>
              <p className="font-semibold text-[#20211F]">
                4. Your Rights
              </p>
              <p>
                You may request account deletion, spatial model purge, or personal data export at any time through your ArchMind account portal.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E5E4DE] flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-full bg-[#20211F] hover:bg-[#35B6C9] text-white text-xs font-medium transition-colors"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
