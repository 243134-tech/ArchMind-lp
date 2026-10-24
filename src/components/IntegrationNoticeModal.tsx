import React from 'react';
import { UserSession } from '../types';
import { CheckCircle2, ArrowRight, X } from 'lucide-react';

interface IntegrationNoticeModalProps {
  user: UserSession;
  onClose: () => void;
  onSignOut: () => void;
}

export const IntegrationNoticeModal: React.FC<IntegrationNoticeModalProps> = ({
  user,
  onClose,
  onSignOut,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#20211F]/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-xl relative animate-in zoom-in-95 duration-150 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#747670] hover:text-[#20211F] p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C7D9]"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Badge & Icon */}
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <h2 id="modal-headline" className="text-xl font-bold text-[#20211F] tracking-tight">
          Welcome to ArchMind
        </h2>
        
        <p className="mt-2 text-sm text-[#747670]">
          You are signed in as <strong className="text-[#20211F]">{user.email}</strong>.
        </p>

        <div className="my-6 p-4 bg-[#F7F6F2] rounded-xl border border-[#E5E4DE] text-xs text-[#747670] leading-relaxed">
          Your architectural workspace account is verified and ready. Start exploring room transformations, facade generations, and spatial AI visualizations.
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#20211F] hover:bg-[#35B6C9] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <span>Enter ArchMind Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onSignOut}
            className="py-2 text-xs text-[#747670] hover:text-rose-600 transition-colors"
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
};
