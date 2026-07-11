import { useState } from 'react';
import { apiFetch, setAuthToken } from '../lib/api';
import { ArrowRight, Lock, User, AtSign, CreditCard, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface RegisterProps {
  onNavigate: (view: 'login') => void;
  onRegister: () => void;
}

export default function Register({ onNavigate, onRegister }: RegisterProps) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdAccount, setCreatedAccount] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiFetch('/create-account', {
        method: 'POST',
        body: JSON.stringify({ 
          account_name: name,
          password: password,
          pin: pin,
          transaction_pin: pin
        }),
      });
      
      console.log('Create account response:', res);

      if (res.token) {
        setAuthToken(res.token);
        localStorage.setItem('bank_user_name', name);
        onRegister();
      } else {
        const accInfo = res.account_nummber || res.account_number || res.accountNumber || res.AccountNumber || res.id || res.message || JSON.stringify(res);
        setCreatedAccount(String(accInfo));
        localStorage.setItem('bank_user_name', name);
        localStorage.setItem('bank_account_number', String(accInfo));
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <div className="p-8 pb-6 bg-indigo-50/50">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-indigo-200 shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create account</h1>
          <p className="text-slate-500 mt-2 text-sm">Join the next generation of banking.</p>
        </div>

        {createdAccount ? (
          <div className="p-8 pt-6 text-center">
            <div className="mb-6 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 wrap-break-words">
              <h2 className="text-emerald-800 font-semibold mb-2">Account Created Successfully!</h2>
              <p className="text-emerald-600 text-sm mb-4">Here is your account information:</p>
              <div className="text-2xl font-mono font-bold text-emerald-900 tracking-wider">
                {createdAccount}
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-8">
              Please save your account number somewhere safe. You will need it to sign in.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
            >
              Go to Login
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 pt-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <AtSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-colors sm:text-sm bg-slate-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-colors sm:text-sm bg-slate-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Transaction PIN (4 digits)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    pattern="[0-9]*"
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-colors sm:text-sm bg-slate-50 focus:bg-white font-mono tracking-[0.5em] text-lg"
                    placeholder="••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || pin.length < 4}
              className="mt-8 w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Creating...' : 'Create Account'}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
