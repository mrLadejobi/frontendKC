import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

export default function App() {
  const [view, setView] = useState<'login' | 'register' | 'dashboard'>('login');
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
      {view === 'login' && <Login onNavigate={setView} onLogin={() => setView('dashboard')} />}
      {view === 'register' && <Register onNavigate={setView} onRegister={() => setView('dashboard')} />}
      {view === 'dashboard' && <Dashboard onLogout={() => setView('login')} />}
    </>
  );
}
