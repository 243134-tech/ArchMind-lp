import React, { useState } from 'react';
import { X, Mail, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';

interface ForgotPasswordModalProps {
  onClose: () => void;
  initialEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  onClose,
  initialEmail = '',
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!authService.isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Realistic delivery latency simulation
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#20211F]/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-xl relative animate-in zoom-in-95 duration-150">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#747670] hover:text-[#20211F] p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C7D9]"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSent ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[#20211F]">
              Recovery Link Dispatched
            </h2>
            <p className="text-xs sm:text-sm text-[#747670] leading-relaxed">
              If an ArchMind account matches <strong className="text-[#20211F]">{email}</strong>, a secure architectural workspace password reset link has been dispatched.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-3 px-5 rounded-full bg-[#20211F] hover:bg-[#35B6C9] text-white text-xs font-medium transition-colors"
              >
                Return to Sign In
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#F7F6F2] border border-[#E5E4DE] flex items-center justify-center text-[#20211F]">
                <Mail className="w-4 h-4 text-[#55C7D9]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#20211F] tracking-tight">
                  Reset Password
                </h2>
                <p className="text-xs text-[#747670]">
                  Enter your email to receive recovery instructions.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#20211F] uppercase tracking-wider mb-2">
                  Account Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="architect@studio.com"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-[#F7F6F2]/40 border border-[#E5E4DE] rounded-xl text-sm text-[#20211F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#55C7D9]"
                />
                {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#20211F] hover:bg-[#35B6C9] text-white text-xs font-medium transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Instructions...</span>
                    </>
                  ) : (
                    <span>Send Reset Instructions</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 border border-[#E5E4DE] text-xs text-[#747670] rounded-full hover:text-[#20211F]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
