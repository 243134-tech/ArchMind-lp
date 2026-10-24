import React, { useState } from 'react';
import { ArchMindLogo } from './ArchMindLogo';
import { Eye, EyeOff, X, Loader2, CheckCircle2, AlertCircle, Zap, Sparkles } from 'lucide-react';
import { authService, AuthResponse } from '../services/authService';

interface AuthModalProps {
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (response: AuthResponse) => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onForgotPassword: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'signup',
  onClose,
  onSuccess,
  onOpenTerms,
  onOpenPrivacy,
  onForgotPassword,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Status
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!authService.isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Minimum 8 characters required';
    }

    if (mode === 'signup') {
      if (!fullName.trim()) newErrors.fullName = 'Full name is required';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!agreeToTerms) newErrors.terms = 'Please accept Terms & Privacy Policy';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      let res: AuthResponse;
      if (mode === 'signin') {
        res = await authService.signIn({ email, password, rememberMe });
      } else {
        res = await authService.signUp({ fullName, email, password, confirmPassword, agreeToTerms });
      }

      if (res.success) {
        onSuccess(res);
      } else {
        setErrors({ form: res.error || 'Authentication failed' });
      }
    } catch {
      setErrors({ form: 'An unexpected connection error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#20211F]/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#747670] hover:text-[#20211F] p-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C7D9]"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Lockup */}
        <div className="flex justify-center mb-5">
          <ArchMindLogo size="md" />
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#F7F6F2] p-1 mb-6 border border-[#E5E4DE]/60">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrors({});
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-[#FFFFFF] text-[#20211F] shadow-xs'
                : 'text-[#747670] hover:text-[#20211F]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrors({});
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-[#FFFFFF] text-[#20211F] shadow-xs'
                : 'text-[#747670] hover:text-[#20211F]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Header Text */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#20211F] tracking-tight">
            {mode === 'signin' ? 'Welcome Back' : 'Create Your ArchMind Account'}
          </h2>
          <p className="mt-1 text-xs text-[#747670]">
            {mode === 'signin'
              ? 'Continue your architectural journey with ArchMind.'
              : 'Start exploring intelligent design for your space.'}
          </p>
        </div>

        {/* Error Banner */}
        {errors.form && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Quick Demo Login in SignIn mode */}
        {mode === 'signin' && (
          <div className="mb-4 p-3 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-xl flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-teal-950 flex items-center gap-1.5 text-[11px]">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Quick Demo Access</span>
              </div>
              <div className="text-[10px] text-teal-700">Sarah Chen (Architect)</div>
            </div>
            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                const res = await authService.signIn({
                  email: 'sarah.chen@archmind.design',
                  password: 'Architecture2026!',
                  rememberMe: true,
                });
                setIsLoading(false);
                if (res.success) onSuccess(res);
              }}
              className="px-2.5 py-1.5 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-lg text-[10px] font-bold shadow-2xs transition-colors"
            >
              1-Click Demo
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-[#20211F] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Elena Vance"
                className="w-full px-3.5 py-2.5 bg-[#F7F6F2]/40 border border-[#E5E4DE] rounded-xl text-xs text-[#20211F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#55C7D9]"
              />
              {errors.fullName && <p className="mt-1 text-[11px] text-rose-600">{errors.fullName}</p>}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-[#20211F] uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="architect@studio.com"
              className="w-full px-3.5 py-2.5 bg-[#F7F6F2]/40 border border-[#E5E4DE] rounded-xl text-xs text-[#20211F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#55C7D9]"
            />
            {errors.email && <p className="mt-1 text-[11px] text-rose-600">{errors.email}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-[#20211F] uppercase tracking-wider">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-[11px] text-[#747670] hover:text-[#20211F] hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 bg-[#F7F6F2]/40 border border-[#E5E4DE] rounded-xl text-xs text-[#20211F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#55C7D9]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747670] p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-[11px] text-rose-600">{errors.password}</p>}
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-[#20211F] uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#F7F6F2]/40 border border-[#E5E4DE] rounded-xl text-xs text-[#20211F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#55C7D9]"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-[11px] text-rose-600">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {mode === 'signin' ? (
            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 text-xs text-[#747670] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E5E4DE] text-[#20211F] focus:ring-[#55C7D9]"
                />
                <span>Remember me</span>
              </label>
            </div>
          ) : (
            <div className="pt-1">
              <label className="flex items-start gap-2 text-[11px] text-[#747670] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#E5E4DE] text-[#20211F] focus:ring-[#55C7D9]"
                />
                <span>
                  I agree to the{' '}
                  <button type="button" onClick={onOpenTerms} className="underline text-[#20211F]">
                    Terms
                  </button>{' '}
                  &{' '}
                  <button type="button" onClick={onOpenPrivacy} className="underline text-[#20211F]">
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-[11px] text-rose-600">{errors.terms}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3 px-5 rounded-full bg-[#20211F] hover:bg-[#35B6C9] text-white text-xs font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
