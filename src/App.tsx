import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'dashboard'>('landing');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('bank_token');
    if (token) {
      setView('dashboard');
    }
    setIsInitializing(false);
  }, []);

  if (isInitializing) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center" />;
  }

  return (
    <>
      {view === 'landing' && <Landing onNavigate={setView} />}
      {view === 'login' && <Login onNavigate={setView} onLogin={() => setView('dashboard')} />}
      {view === 'register' && <Register onNavigate={setView} onRegister={() => setView('dashboard')} />}
      {view === 'dashboard' && <Dashboard onLogout={() => setView('landing')} />}
    </>
  );
}
