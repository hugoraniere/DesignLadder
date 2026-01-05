import { useEffect, useState } from 'react';
import { NewLandingPage } from './components/NewLandingPage';
import { FormPage } from './components/FormPage';
import { NewMaturityForm } from './components/NewMaturityForm';
import { NewMaturityResult } from './components/NewMaturityResult';
import { AdminLogin as OldAdminLogin } from './components/AdminLogin';
import { NewAdminDashboard } from './components/NewAdminDashboard';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { MainLayout } from './components/MainLayout';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

type ViewType =
  | 'landing'
  | 'form'
  | 'maturity'
  | 'result'
  | 'old-admin-login'
  | 'old-admin-dashboard'
  | 'auth'
  | 'app';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [view, setView] = useState<ViewType>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [responseId, setResponseId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const checkAuth = async () => {
      const currentPath = window.location.pathname;

      if (currentPath === '/admin') {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();

          if (adminData) {
            setView('old-admin-dashboard');
          } else {
            setView('old-admin-login');
          }
        } else {
          setView('old-admin-login');
        }
      }
      setIsAuthChecking(false);
    };

    checkAuth();

    const handleRouteChange = () => {
      const currentPath = window.location.pathname;

      if (currentPath === '/admin') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('view') === 'dashboard') {
          setView('old-admin-dashboard');
        } else {
          setView('old-admin-login');
        }
      } else if (window.location.hash === '#app' ||
                 window.location.hash.startsWith('#dashboard/') ||
                 window.location.hash.startsWith('#roadmap/') ||
                 window.location.hash.startsWith('#kanban/') ||
                 window.location.hash.startsWith('#ceremonies/') ||
                 window.location.hash.startsWith('#nps/') ||
                 window.location.hash.startsWith('#team/')) {
        if (user) {
          const checkOrCreateProject = async () => {
            let { data: preferences } = await supabase
              .from('user_preferences')
              .select('default_project_id')
              .eq('user_id', user.id)
              .maybeSingle();

            let projectId = preferences?.default_project_id;

            if (!projectId) {
              const { data: newProject, error: projectError } = await supabase
                .from('projects')
                .insert({
                  name: 'Meu Projeto',
                  start_date: new Date().toISOString().split('T')[0],
                  sprint_duration: 2
                })
                .select()
                .single();

              if (!projectError && newProject) {
                projectId = newProject.id;

                await supabase
                  .from('user_preferences')
                  .insert({
                    user_id: user.id,
                    default_project_id: projectId
                  });
              }
            }

            if (projectId) {
              setSelectedProjectId(projectId);

              if (window.location.hash === '#app') {
                window.location.hash = `#dashboard/${projectId}`;
              } else {
                const urlProjectId = window.location.hash.split('/')[1];
                if (urlProjectId) {
                  setSelectedProjectId(urlProjectId);
                }
              }

              setView('app');
            }
          };
          checkOrCreateProject();
        } else {
          setView('auth');
        }
      } else if (window.location.hash === '#share-challenge') {
        setView('form');
      } else if (window.location.hash === '#diagnostico-maturidade') {
        setView('maturity');
      } else if (window.location.hash.startsWith('#resultado/')) {
        const id = window.location.hash.replace('#resultado/', '');
        setResponseId(id);
        setView('result');
      } else {
        setView('landing');
      }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [user, authLoading]);

  const navigateToForm = () => {
    window.location.hash = '#share-challenge';
    setView('form');
  };

  const navigateToMaturity = () => {
    window.location.hash = '#diagnostico-maturidade';
    setView('maturity');
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setView('landing');
  };

  const navigateToDashboard = () => {
    window.location.hash = '#app';
    setView('app');
  };

  if (authLoading || isAuthChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (view === 'old-admin-dashboard') {
    return <NewAdminDashboard />;
  }

  if (view === 'old-admin-login') {
    return <OldAdminLogin onLogin={() => setView('old-admin-dashboard')} />;
  }

  if (view === 'auth') {
    return authMode === 'login' ? (
      <Login onToggleMode={() => setAuthMode('signup')} />
    ) : (
      <SignUp onToggleMode={() => setAuthMode('login')} />
    );
  }

  if (view === 'app' && selectedProjectId && user) {
    return <MainLayout projectId={selectedProjectId} />;
  }

  if (view === 'app' && !selectedProjectId && user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold">Carregando projeto...</div>
      </div>
    );
  }

  const handleMaturityComplete = (id: string) => {
    setResponseId(id);
    window.location.hash = `#resultado/${id}`;
    setView('result');
  };

  return (
    <LanguageProvider>
      {view === 'form' ? (
        <FormPage onBack={navigateToHome} />
      ) : view === 'maturity' ? (
        <NewMaturityForm onBack={navigateToHome} onComplete={handleMaturityComplete} />
      ) : view === 'result' && responseId ? (
        <NewMaturityResult responseId={responseId} onBack={navigateToHome} />
      ) : (
        <NewLandingPage onNavigateToMaturity={navigateToMaturity} onNavigateToResearch={navigateToForm} />
      )}
    </LanguageProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
