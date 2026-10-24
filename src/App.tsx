import React, { useState, useEffect } from 'react';
import { Route, UserSession } from './types';
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { AuthModal } from './components/AuthModal';
import { IntegrationNoticeModal } from './components/IntegrationNoticeModal';
import { TermsModal } from './components/TermsModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { authService, AuthResponse } from './services/authService';

// App Pages
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { DesignStudioPage } from './pages/DesignStudioPage';
import { SpaceAnalysisPage } from './pages/SpaceAnalysisPage';
import { DesignResultsPage } from './pages/DesignResultsPage';
import { FloorPlansPage } from './pages/FloorPlansPage';
import { ProductsPage } from './pages/ProductsPage';
import { BudgetPlannerPage } from './pages/BudgetPlannerPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { ProfessionalsPage } from './pages/ProfessionalsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // Modals
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | null>(null);
  const [termsModalType, setTermsModalType] = useState<'terms' | 'privacy' | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Parse path from URL
  const parseCurrentPath = (): string => {
    if (typeof window === 'undefined') return '/';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase().replace(/^#/, '');

    const target = hash || path;

    if (target.startsWith('/app/')) {
      return target;
    }
    if (target === '/signin' || target === 'signin') return '/signin';
    if (target === '/signup' || target === 'signup') return '/signup';
    if (target === '/forgot-password') return '/forgot-password';
    return '/';
  };

  useEffect(() => {
    setCurrentRoute(parseCurrentPath());

    const handlePopState = () => {
      setCurrentRoute(parseCurrentPath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', route);
      } catch {
        window.location.hash = route;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAuthSuccess = (response: AuthResponse) => {
    setAuthModalMode(null);
    // Directly navigate into the workspace overview!
    navigate('/app/overview');
  };

  const handleSignOut = () => {
    authService.signOut();
    navigate('/');
  };

  // Helper for authenticated /app route dispatching
  const renderAppContent = () => {
    if (currentRoute === '/app/overview' || currentRoute === '/app') {
      return <OverviewPage onNavigate={navigate} />;
    }
    if (currentRoute === '/app/design-studio') {
      return <DesignStudioPage onNavigate={navigate} />;
    }
    if (currentRoute === '/app/space-analysis') {
      return <SpaceAnalysisPage onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('/app/designs/')) {
      const designId = currentRoute.split('/app/designs/')[1]?.split('?')[0];
      return <DesignResultsPage designId={designId} onNavigate={navigate} />;
    }
    if (currentRoute === '/app/floor-plans') {
      return <FloorPlansPage onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('/app/products')) {
      return <ProductsPage onNavigate={navigate} />;
    }
    if (currentRoute === '/app/budget') {
      return <BudgetPlannerPage onNavigate={navigate} />;
    }
    if (currentRoute === '/app/projects') {
      return <ProjectsPage onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('/app/projects/')) {
      const projectId = currentRoute.split('/app/projects/')[1]?.split('?')[0];
      return <ProjectDetailPage projectId={projectId} onNavigate={navigate} />;
    }
    if (currentRoute === '/app/properties') {
      return <PropertiesPage onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('/app/properties/')) {
      const propertyId = currentRoute.split('/app/properties/')[1]?.split('?')[0];
      return <PropertyDetailPage propertyId={propertyId} onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('/app/professionals')) {
      return <ProfessionalsPage onNavigate={navigate} />;
    }
    if (currentRoute === '/app/documents') {
      return <DocumentsPage onNavigate={navigate} />;
    }
    if (currentRoute === '/app/maintenance') {
      return <MaintenancePage onNavigate={navigate} />;
    }
    if (currentRoute === '/app/settings') {
      return <SettingsPage onNavigate={navigate} onSignOut={handleSignOut} />;
    }

    // Default fallback within app
    return <OverviewPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-sans text-[#171C2C]">
      
      {/* 1. AUTHENTICATED APP WORKSPACE */}
      {currentRoute.startsWith('/app') ? (
        <AppShell
          currentRoute={currentRoute}
          onNavigate={navigate}
          onSignOut={handleSignOut}
        >
          {renderAppContent()}
        </AppShell>
      ) : (
        /* 2. PUBLIC MARKETING & AUTH ROUTES */
        <>
          {currentRoute === '/' && (
            <LandingPage
              onNavigate={(route) => {
                if (route === '/signin') {
                  setAuthModalMode('signin');
                } else if (route === '/signup') {
                  setAuthModalMode('signup');
                } else {
                  navigate(route);
                }
              }}
              onOpenTerms={() => setTermsModalType('terms')}
              onOpenPrivacy={() => setTermsModalType('privacy')}
              onOpenIntegrationSettings={() => {}}
            />
          )}

          {currentRoute === '/signin' && (
            <SignInPage
              onNavigate={navigate}
              onAuthSuccess={handleAuthSuccess}
              onForgotPassword={() => setForgotPasswordOpen(true)}
            />
          )}

          {currentRoute === '/signup' && (
            <SignUpPage
              onNavigate={navigate}
              onAuthSuccess={handleAuthSuccess}
              onOpenTerms={() => setTermsModalType('terms')}
              onOpenPrivacy={() => setTermsModalType('privacy')}
            />
          )}
        </>
      )}

      {/* Seamless in-page Sign In / Sign Up Modal */}
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onSuccess={handleAuthSuccess}
          onOpenTerms={() => setTermsModalType('terms')}
          onOpenPrivacy={() => setTermsModalType('privacy')}
          onForgotPassword={() => {
            setAuthModalMode(null);
            setForgotPasswordOpen(true);
          }}
        />
      )}

      {/* Terms of Service & Privacy Policy Modal */}
      {termsModalType && (
        <TermsModal
          type={termsModalType}
          onClose={() => setTermsModalType(null)}
        />
      )}

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <ForgotPasswordModal
          onClose={() => setForgotPasswordOpen(false)}
        />
      )}

    </div>
  );
}
