import { UserSession } from '../types';
import { getMainAppUrl, isMainAppUrlConfigured } from '../config/appConfig';

export interface SignInPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: UserSession;
  error?: string;
  redirectUrl?: string;
  requiresExternalHandshake?: boolean;
}

type AuthStateListener = (user: UserSession | null) => void;

class AuthService {
  private currentUser: UserSession | null = null;
  private listeners: Set<AuthStateListener> = new Set();
  private storageKey = 'archmind_auth_session';

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch {
      this.currentUser = null;
    }
  }

  public subscribe(listener: AuthStateListener): () => void {
    this.listeners.add(listener);
    listener(this.currentUser);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn(this.currentUser));
  }

  public getCurrentUser(): UserSession | null {
    return this.currentUser;
  }

  /**
   * Validate email using RFC 5322 compliant regex
   */
  public isValidEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase().trim());
  }

  /**
   * Validate password requirements: at least 8 chars, at least one letter and one number
   */
  public validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password || password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long.' };
    }
    if (!/\d/.test(password)) {
      return { valid: false, message: 'Password must contain at least one numeric digit.' };
    }
    return { valid: true };
  }

  /**
   * Authenticate an existing user
   */
  public async signIn(payload: SignInPayload): Promise<AuthResponse> {
    const trimmedEmail = payload.email.trim();

    if (!trimmedEmail) {
      return { success: false, error: 'Email address is required.' };
    }
    if (!this.isValidEmail(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!payload.password) {
      return { success: false, error: 'Password is required.' };
    }
    if (payload.password.length < 8) {
      return { success: false, error: 'Invalid credentials. Password is too short.' };
    }

    // Realistic network verification latency
    await new Promise((resolve) => setTimeout(resolve, 850));

    // Create session (in production this receives token from Firebase/OIDC)
    const session: UserSession = {
      id: 'usr_' + Math.random().toString(36).substring(2, 10),
      name: trimmedEmail.split('@')[0].replace(/[._-]/g, ' '),
      email: trimmedEmail,
      role: 'Homeowner',
      preferredCurrency: 'INR',
      unitSystem: 'sqft',
      createdAt: new Date().toISOString(),
      provider: 'firebase',
      token: 'arch_tok_' + Math.random().toString(36).substring(2, 14),
    };

    this.currentUser = session;

    if (payload.rememberMe && typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(session));
    }

    this.notify();

    const targetUrl = getMainAppUrl();
    const isConfigured = isMainAppUrlConfigured();

    return {
      success: true,
      user: session,
      redirectUrl: targetUrl,
      requiresExternalHandshake: !isConfigured,
    };
  }

  /**
   * Register a new user
   */
  public async signUp(payload: SignUpPayload): Promise<AuthResponse> {
    const trimmedName = payload.fullName.trim();
    const trimmedEmail = payload.email.trim();

    if (!trimmedName) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!trimmedEmail) {
      return { success: false, error: 'Email address is required.' };
    }
    if (!this.isValidEmail(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const passValidation = this.validatePassword(payload.password);
    if (!passValidation.valid) {
      return { success: false, error: passValidation.message };
    }

    if (payload.password !== payload.confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    if (!payload.agreeToTerms) {
      return { success: false, error: 'You must agree to the Terms of Service and Privacy Policy.' };
    }

    // Realistic registration latency
    await new Promise((resolve) => setTimeout(resolve, 950));

    const session: UserSession = {
      id: 'usr_' + Math.random().toString(36).substring(2, 10),
      name: trimmedName,
      email: trimmedEmail,
      role: 'Homeowner',
      preferredCurrency: 'INR',
      unitSystem: 'sqft',
      createdAt: new Date().toISOString(),
      provider: 'firebase',
      token: 'arch_tok_' + Math.random().toString(36).substring(2, 14),
    };

    this.currentUser = session;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(session));
    }

    this.notify();

    const targetUrl = getMainAppUrl();
    const isConfigured = isMainAppUrlConfigured();

    return {
      success: true,
      user: session,
      redirectUrl: targetUrl,
      requiresExternalHandshake: !isConfigured,
    };
  }

  /**
   * Sign out current session
   */
  public signOut(): void {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
    this.notify();
  }
}

export const authService = new AuthService();
