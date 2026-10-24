import React, { useState } from 'react';
import { ArchMindLogo } from '../components/ArchMindLogo';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Lock,
  Sparkles,
  Zap,
  ShieldCheck,
  Building,
  Check,
} from 'lucide-react';
import { Route } from '../types';
import { authService, AuthResponse } from '../services/authService';

interface SignInPageProps {
  onNavigate: (route: Route) => void;
  onAuthSuccess: (authResponse: AuthResponse) => void;
  onForgotPassword: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onNavigate,
  onAuthSuccess,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Validation & Submission States
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [socialToast, setSocialToast] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string; form?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!authService.isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const executeSignIn = async (emailVal: string, passwordVal: string) => {
    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.signIn({
        email: emailVal,
        password: passwordVal,
        rememberMe,
      });

      if (response.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onAuthSuccess(response);
        }, 500);
      } else {
        setErrors({ form: response.error || 'Authentication failed. Please check your credentials.' });
      }
    } catch {
      setErrors({ form: 'An unexpected connection error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;
    if (!validate()) return;
    await executeSignIn(email, password);
  };

  const handleQuickDemoLogin = async () => {
    if (isLoading || isSuccess) return;
    const demoEmail = 'sarah.chen@archmind.design';
    const demoPassword = 'Architecture2026!';
    setEmail(demoEmail);
    setPassword(demoPassword);
    await executeSignIn(demoEmail, demoPassword);
  };

  const handleSocialLogin = (provider: string) => {
    setSocialToast(`Connecting with ${provider}...`);
    setTimeout(() => {
      setSocialToast(null);
      // Auto-authenticate with social provider
      executeSignIn(`user.${provider.toLowerCase()}@archmind.design`, 'Architecture2026!');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] grid grid-cols-1 lg:grid-cols-12 text-[#171C2C]">
      
      {/* ========================================================= */}
      {/* LEFT COLUMN: EDITORIAL ARCHITECTURAL SHOWCASE (5 cols) */}
      {/* ========================================================= */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-[#11141A] text-white flex-col justify-between p-10 xl:p-14 overflow-hidden">
        {/* Background Editorial Architectural Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
            alt="ArchMind Architectural Residence"
            className="w-full h-full object-cover scale-105 filter brightness-75 contrast-105"
          />
          {/* Deep Luxurious Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F15] via-[#0C0F15]/60 to-black/30" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0C0F15]/40 to-[#0C0F15]/90" />
        </div>

        {/* Top Branding Emblem */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all shadow-lg">
              <svg className="w-5 h-5 text-[#55C7D9]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 9.5V22h7v-7h6v7h7V9.5L12 2z" />
              </svg>
            </div>
            <div className="text-left">
              <span className="font-serif text-lg font-bold tracking-tight text-white block">ARCHMIND</span>
              <span className="text-[9px] uppercase tracking-widest text-[#55C7D9] font-mono block">AI Architecture</span>
            </div>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-full text-[10px] font-medium text-teal-200">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Gemini Multimodal</span>
          </span>
        </div>

        {/* Center / Lower: Floating Project Card + Testimonial */}
        <div className="relative z-10 space-y-6 my-auto pt-12 pb-6">
          {/* Tagline */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#006B7B]/40 border border-[#55C7D9]/30 text-[#55C7D9] text-xs font-mono font-medium mb-3 backdrop-blur-sm">
              <span>✦ WORKSPACE INTELLIGENCE</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              Imagine It. Design It. Live It.
            </h2>
            <p className="mt-2 text-sm text-zinc-300 leading-relaxed max-w-md font-light">
              Transform residential and commercial spaces from conceptual photo uploads to fully costed architectural blueprints.
            </p>
          </div>

          {/* Floating Glass Project Card */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-white">Active Architectural Workspace</span>
              </div>
              <span className="text-[10px] bg-white/15 text-teal-200 px-2 py-0.5 rounded-full font-mono">
                ₹ INR Ready
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=140&q=80"
                alt="Modern Terrace"
                className="w-14 h-14 rounded-xl object-cover border border-white/20 shadow-sm"
              />
              <div className="text-xs">
                <div className="font-bold text-white text-sm">Modern Terrace Residence</div>
                <div className="text-zinc-300 text-[11px]">Bangsar • 2,280 sq ft</div>
                <div className="text-[#55C7D9] font-semibold mt-0.5 font-mono">
                  Target Budget: ₹28,50,000
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center text-[10px]">
              <div className="p-1.5 bg-black/20 rounded-lg">
                <div className="text-zinc-400">Spatial Score</div>
                <div className="font-bold text-emerald-400 text-xs">96 / 100</div>
              </div>
              <div className="p-1.5 bg-black/20 rounded-lg">
                <div className="text-zinc-400">Variations</div>
                <div className="font-bold text-white text-xs">4 Photoreal</div>
              </div>
              <div className="p-1.5 bg-black/20 rounded-lg">
                <div className="text-zinc-400">Solar Sim</div>
                <div className="font-bold text-teal-300 text-xs">365-Day</div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <blockquote className="p-3.5 rounded-xl bg-black/30 border border-white/10 text-xs text-zinc-300 italic leading-relaxed">
            &ldquo;ArchMind turned our multi-room renovation from months of drafting into immediate, actionable 3D realism and strict budget precision.&rdquo;
            <div className="not-italic text-[11px] text-white font-medium mt-1.5 flex items-center gap-2">
              <span className="text-[#55C7D9] font-bold">— Ar. Siddharth Mehta</span>
              <span className="text-zinc-400">• Principal Partner, Studio Matrix</span>
            </div>
          </blockquote>
        </div>

        {/* Left Bottom Security & Certifications */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            256-Bit SSL Workspace
          </span>
          <span>© 2026 ArchMind Inc.</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: AUTHENTICATION FORM EXPERIENCE (7 cols) */}
      {/* ========================================================= */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between max-w-md w-full mx-auto">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors py-2 px-3 rounded-xl hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="text-xs text-gray-500">
            <span>Don&apos;t have an account? </span>
            <button
              onClick={() => onNavigate('/signup')}
              className="text-[#006B7B] font-bold hover:underline ml-1"
            >
              Create Account →
            </button>
          </div>
        </div>

        {/* Main Authentication Card */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          
          {/* Logo & Heading */}
          <div className="text-center sm:text-left mb-6">
            <div className="inline-block lg:hidden mb-4">
              <ArchMindLogo size="md" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
              Sign In to ArchMind
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
              Access your real-time architectural workspaces, AI designs, and budget plans.
            </p>
          </div>

          {/* QUICK DEMO LOGIN BUTTON (Highlighted for Zero-Friction Testing) */}
          <div className="mb-6 p-3.5 bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border-2 border-teal-200/80 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-teal-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                Instant Evaluator Access
              </span>
              <span className="text-[10px] bg-[#006B7B] text-white px-2 py-0.5 rounded-full font-semibold">
                1-Click Demo
              </span>
            </div>
            <p className="text-[11px] text-teal-800 leading-snug mb-2.5">
              Evaluate full features instantly as <strong>Sarah Chen</strong> (Lead Architect) with active sample project and ₹ INR budget data pre-loaded.
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading || isSuccess}
              className="w-full py-2.5 px-4 bg-[#006B7B] hover:bg-[#004F5C] active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Launch Demo Workspace (1-Click)</span>
            </button>
          </div>

          {/* Social SSO Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading || isSuccess}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs transition-colors"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              disabled={isLoading || isSuccess}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs transition-colors"
            >
              {/* Apple SVG */}
              <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.66-.82 1.11-1.96.99-3.1-.97.04-2.14.65-2.83 1.46-.61.71-1.15 1.87-1.01 2.98 1.09.08 2.19-.53 2.85-1.34z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* Social Feedback Toast */}
          {socialToast && (
            <div className="mb-4 p-2.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>{socialToast}</span>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-mono">
              <span className="bg-[#F9F9F7] px-3 text-gray-400">Or continue with credentials</span>
            </div>
          </div>

          {/* Global Error Banner */}
          {errors.form && (
            <div
              className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-xs"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Global Success State */}
          {isSuccess && (
            <div
              className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs"
              role="status"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Credentials verified. Redirecting to workspace...</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Email Field */}
            <div>
              <label
                htmlFor="signin-email"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading || isSuccess}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="name@archmind.design"
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-xs text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#006B7B] focus:border-transparent ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-gray-200 hover:border-gray-300'
                  } ${isLoading || isSuccess ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="signin-password"
                  className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  disabled={isLoading || isSuccess}
                  className="text-xs text-[#006B7B] hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={isLoading || isSuccess}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-11 py-3 bg-white border rounded-xl text-xs text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#006B7B] focus:border-transparent ${
                    errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-gray-200 hover:border-gray-300'
                  } ${isLoading || isSuccess ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isSuccess}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading || isSuccess}
                  className="w-4 h-4 rounded border-gray-300 text-[#006B7B] focus:ring-[#006B7B]"
                />
                <span>Remember me on this workstation</span>
              </label>
              
              <span className="text-[10px] text-gray-400 font-mono">
                Currency: <strong className="text-gray-700 font-bold">₹ INR</strong>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#171C2C] hover:bg-[#006B7B] text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-teal-200" />
                  <span>Verifying Workspace Credentials...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Access Granted. Launching...</span>
                </>
              ) : (
                <span>Sign In to Workspace</span>
              )}
            </button>

          </form>

        </div>

        {/* Footer Security Note */}
        <div className="text-center text-[11px] text-gray-400 border-t border-gray-200/70 pt-4 max-w-md w-full mx-auto">
          ArchMind Identity &amp; Workspace Management • Encrypted with 256-bit AES
        </div>

      </div>

    </div>
  );
};
