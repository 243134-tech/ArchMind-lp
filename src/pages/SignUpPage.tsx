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
  User,
  Sparkles,
  ShieldCheck,
  Building,
  Check,
  Compass,
  Home,
  Palette,
  Briefcase,
  Layers,
} from 'lucide-react';
import { Route, UserRole } from '../types';
import { authService, AuthResponse } from '../services/authService';

interface SignUpPageProps {
  onNavigate: (route: Route) => void;
  onAuthSuccess: (authResponse: AuthResponse) => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onNavigate,
  onAuthSuccess,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Homeowner');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Validation & Submission States
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    form?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [socialToast, setSocialToast] = useState<string | null>(null);

  // Calculate Password Strength: 0 (none), 1 (weak), 2 (medium), 3 (strong)
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: 'Enter password', color: 'bg-gray-200' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password) || /[A-Z]/.test(password)) score++;

    if (score === 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const validate = (): boolean => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
      form?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!authService.isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passCheck = authService.validatePassword(password);
    if (!passCheck.valid) {
      newErrors.password = passCheck.message;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeToTerms) {
      newErrors.terms = 'Please accept the Terms of Service & Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const executeSignUp = async (nameVal: string, emailVal: string, passVal: string) => {
    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.signUp({
        fullName: nameVal,
        email: emailVal,
        password: passVal,
        confirmPassword: passVal,
        agreeToTerms: true,
      });

      if (response.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onAuthSuccess(response);
        }, 500);
      } else {
        setErrors({ form: response.error || 'Registration could not be completed.' });
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
    await executeSignUp(fullName, email, password);
  };

  const handleSocialSignUp = (provider: string) => {
    setSocialToast(`Registering via ${provider}...`);
    setTimeout(() => {
      setSocialToast(null);
      executeSignUp('Alex Morgan', `alex.${provider.toLowerCase()}@archmind.design`, 'Architecture2026!');
    }, 800);
  };

  const roleOptions: { role: UserRole; title: string; desc: string; icon: any }[] = [
    { role: 'Homeowner', title: 'Homeowner', desc: 'Renovating or building dream home', icon: Home },
    { role: 'Architect', title: 'Architect', desc: 'BIM, schematics & client presentations', icon: Compass },
    { role: 'Designer', title: 'Interior Designer', desc: 'FF&E styling & photoreal renders', icon: Palette },
    { role: 'Developer', title: 'Developer', desc: 'Commercial & residential developments', icon: Building },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F7] grid grid-cols-1 lg:grid-cols-12 text-[#171C2C]">
      
      {/* ========================================================= */}
      {/* LEFT COLUMN: EDITORIAL ARCHITECTURAL SHOWCASE (5 cols) */}
      {/* ========================================================= */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-[#11141A] text-white flex-col justify-between p-10 xl:p-14 overflow-hidden">
        {/* Background Editorial Architectural Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85"
            alt="ArchMind Modern Architectural Villa"
            className="w-full h-full object-cover scale-105 filter brightness-75 contrast-105"
          />
          {/* Deep Luxurious Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F15] via-[#0C0F15]/60 to-black/35" />
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
            <span>AI Design Studio</span>
          </span>
        </div>

        {/* Center: Value Propositions & Feature Highlights */}
        <div className="relative z-10 space-y-6 my-auto pt-10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#006B7B]/40 border border-[#55C7D9]/30 text-[#55C7D9] text-xs font-mono font-medium mb-3 backdrop-blur-sm">
              <span>✦ FROM DREAM TO HOME</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              See it. Design it. Buy it.
            </h2>
            <p className="mt-2 text-sm text-zinc-300 leading-relaxed max-w-md font-light">
              Join thousands of architects, designers, and discerning homeowners planning renovations with neural spatial precision.
            </p>
          </div>

          {/* 3 Pillars Showcase Cards */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#006B7B]/50 text-[#55C7D9] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white text-sm">Multimodal AI Studio</div>
                <div className="text-zinc-300 text-[11px] mt-0.5">
                  Generate photorealistic 3D interior & exterior concepts from any photo or sketch in under 30 seconds.
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-900/50 text-purple-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white text-sm">Floor Plan &amp; Spatial Intelligence</div>
                <div className="text-zinc-300 text-[11px] mt-0.5">
                  Interactive 2D schematic layouts with column, plumbing, and wall detection for compliant structural planning.
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-900/50 text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-bold text-xs">₹</span>
              </div>
              <div className="text-xs">
                <div className="font-bold text-white text-sm">Dynamic Budget Allocation (₹ INR)</div>
                <div className="text-zinc-300 text-[11px] mt-0.5">
                  Real-time bill of materials, per-sqft cost estimation, and direct supplier material purchasing.
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs border-t border-white/10 font-mono">
            <div>
              <div className="text-xl font-bold text-white">4,200+</div>
              <div className="text-[10px] text-zinc-400">Spaces Created</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">₹45+ Cr</div>
              <div className="text-[10px] text-zinc-400">Budgets Optimized</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#55C7D9]">100%</div>
              <div className="text-[10px] text-zinc-400">Data Privacy</div>
            </div>
          </div>
        </div>

        {/* Left Bottom Security & Certifications */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Council of Architecture Ready
          </span>
          <span>© 2026 ArchMind</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: REGISTRATION FORM EXPERIENCE (7 cols) */}
      {/* ========================================================= */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between max-w-lg w-full mx-auto">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors py-2 px-3 rounded-xl hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="text-xs text-gray-500">
            <span>Already have an account? </span>
            <button
              onClick={() => onNavigate('/signin')}
              className="text-[#006B7B] font-bold hover:underline ml-1"
            >
              Sign In →
            </button>
          </div>
        </div>

        {/* Main Registration Form Container */}
        <div className="max-w-lg w-full mx-auto my-auto py-6">
          
          {/* Headline */}
          <div className="text-center sm:text-left mb-6">
            <div className="inline-block lg:hidden mb-4">
              <ArchMindLogo size="md" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
              Create Your Studio Workspace
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
              Start designing with real-time AI visualization, floor plans, and ₹ INR budget planning.
            </p>
          </div>

          {/* Social SSO Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => handleSocialSignUp('Google')}
              disabled={isLoading || isSuccess}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs transition-colors"
            >
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
              onClick={() => handleSocialSignUp('Apple')}
              disabled={isLoading || isSuccess}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs transition-colors"
            >
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
              <span className="bg-[#F9F9F7] px-3 text-gray-400">Or register with email</span>
            </div>
          </div>

          {/* Role Selection Chips */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Select Your Role / Purpose
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roleOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = selectedRole === opt.role;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => setSelectedRole(opt.role)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#006B7B] bg-[#E4F3F4]/50 text-gray-900 ring-1 ring-[#006B7B]'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-[#006B7B]' : 'text-gray-400'}`} />
                    <div className="font-bold text-xs">{opt.title}</div>
                    <div className="text-[10px] text-gray-400 line-clamp-1">{opt.desc}</div>
                  </button>
                );
              })}
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
              <span>Workspace provisioned! Redirecting to studio overview...</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Full Name */}
            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  required
                  disabled={isLoading || isSuccess}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  placeholder="e.g. Elena Vance or Studio Matrix"
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-xs text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#006B7B] focus:border-transparent ${
                    errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-gray-200 hover:border-gray-300'
                  } ${isLoading || isSuccess ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading || isSuccess}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="elena@studio.com"
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-xs text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#006B7B] focus:border-transparent ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-gray-200 hover:border-gray-300'
                  } ${isLoading || isSuccess ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
              >
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  disabled={isLoading || isSuccess}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Minimum 8 characters with numbers"
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

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-500 font-medium">Strength:</span>
                    <span className={`font-bold ${
                      strength.score === 3 ? 'text-emerald-600' : strength.score === 2 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 h-1.5">
                    <div className={`rounded-full ${strength.score >= 1 ? strength.color : 'bg-gray-200'}`} />
                    <div className={`rounded-full ${strength.score >= 2 ? strength.color : 'bg-gray-200'}`} />
                    <div className={`rounded-full ${strength.score >= 3 ? strength.color : 'bg-gray-200'}`} />
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-xs text-rose-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  disabled={isLoading || isSuccess}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="Repeat your password"
                  className={`w-full pl-10 pr-11 py-3 bg-white border rounded-xl text-xs text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#006B7B] focus:border-transparent ${
                    errors.confirmPassword ? 'border-rose-400 bg-rose-50/20' : 'border-gray-200 hover:border-gray-300'
                  } ${isLoading || isSuccess ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading || isSuccess}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Currency Note Indicator */}
            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-[#006B7B]">₹</span>
                <span>Default Currency: <strong>Indian Rupee (INR)</strong></span>
              </span>
              <span className="text-[10px] text-gray-400">Customizable in Settings</span>
            </div>

            {/* Terms & Privacy Acknowledgement */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setAgreeToTerms(e.target.checked);
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
                  }}
                  disabled={isLoading || isSuccess}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#006B7B] focus:ring-[#006B7B]"
                />
                <span className="leading-relaxed">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={onOpenTerms}
                    className="text-[#006B7B] font-semibold underline hover:text-[#004F5C]"
                  >
                    Terms of Service
                  </button>{' '}
                  and acknowledge the{' '}
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="text-[#006B7B] font-semibold underline hover:text-[#004F5C]"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1.5 text-xs text-rose-600">{errors.terms}</p>
              )}
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
                  <span>Provisioning Workspace...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Account Created. Initializing...</span>
                </>
              ) : (
                <span>Create Free Studio Account</span>
              )}
            </button>

          </form>

        </div>

        {/* Footer Security Note */}
        <div className="text-center text-[11px] text-gray-400 border-t border-gray-200/70 pt-4 max-w-lg w-full mx-auto">
          ArchMind Identity &amp; Workspace Management • Encrypted with 256-bit AES
        </div>

      </div>

    </div>
  );
};
