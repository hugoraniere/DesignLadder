import { useEffect, useState } from 'react';
import { NewLandingPage } from './components/NewLandingPage';
import { FormPage } from './components/FormPage';
import { NewMaturityForm } from './components/NewMaturityForm';
import { NewMaturityResult } from './components/NewMaturityResult';
import { AdminLogin } from './components/AdminLogin';
import { NewAdminDashboard } from './components/NewAdminDashboard';
import { LanguageProvider } from './contexts/LanguageContext';
import { supabase } from './lib/supabase';

function App() {
  const [view, setView] = useState<'landing' | 'form' | 'maturity' | 'result' | 'admin-login' | 'admin-dashboard'>('landing');
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [responseId, setResponseId] = useState<string | null>(null);

  useEffect(() => {
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
            setView('admin-dashboard');
          } else {
            setView('admin-login');
          }
        } else {
          setView('admin-login');
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
          setView('admin-dashboard');
        } else {
          setView('admin-login');
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
  }, []);

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

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (view === 'admin-dashboard') {
    return <NewAdminDashboard />;
  }

  if (view === 'admin-login') {
    return <AdminLogin onLogin={() => setView('admin-dashboard')} />;
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

export default App;
