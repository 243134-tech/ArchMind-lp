import { AppConfig } from '../types';

/**
 * ArchMind Application & Integration Configuration
 * 
 * This layer centralizes all settings for the ArchMind landing page
 * and its eventual connection to the standalone ArchMind Web Application.
 */

// Default placeholder for the future web application
export const DEFAULT_MAIN_APP_URL = 'https://your-main-archmind-app.example';

// Storage key for developer/tester override in the browser preview
const STORAGE_KEY_MAIN_APP_URL = 'archmind_main_app_url';
const STORAGE_KEY_AUTH_PROVIDER = 'archmind_auth_provider';

export function getMainAppUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY_MAIN_APP_URL);
    if (saved && saved.trim()) return saved.trim();
  }
  const envUrl = import.meta.env.VITE_MAIN_APP_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim();
  }
  return DEFAULT_MAIN_APP_URL;
}

export function setMainAppUrl(url: string): void {
  if (typeof window !== 'undefined') {
    if (!url || url.trim() === '') {
      localStorage.removeItem(STORAGE_KEY_MAIN_APP_URL);
    } else {
      localStorage.setItem(STORAGE_KEY_MAIN_APP_URL, url.trim());
    }
  }
}

export function isMainAppUrlConfigured(): boolean {
  const currentUrl = getMainAppUrl();
  return (
    Boolean(currentUrl) &&
    currentUrl !== DEFAULT_MAIN_APP_URL &&
    !currentUrl.includes('.example')
  );
}

export const APP_CONFIG: AppConfig = {
  appName: 'ArchMind',
  tagline: 'Imagine It. Design It. Live It.',
  coreMessage: 'Transform your space. Visualize your dream. Design intelligently with AI.',
  mainAppUrl: getMainAppUrl(),
  authProvider: 'firebase',
  version: '1.0.0-landing',
};

export const COLOR_SYSTEM = {
  mainBg: '#F7F6F2',
  secondaryBg: '#FFFFFF',
  primaryText: '#20211F',
  secondaryText: '#747670',
  border: '#E5E4DE',
  accentCyan: '#55C7D9',
  buttonHover: '#35B6C9',
  darkSection: '#191B1A',
};
