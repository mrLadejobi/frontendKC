import { useEffect, useState, useCallback } from 'react';
import { apiFetch, removeAuthToken } from '../lib/api';
import { LogOut, ArrowRightLeft, Plus, Wallet, Activity, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Toast from './ui/Toast';
import { ToastState } from '../types';
import TransferModal from './TransferModal';
import FundModal from './FundModal';
import ProfileModal from './ProfileModal';
import { User } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [balance, setBalance] = useState<number>(0);
  const [userName, setUserName] = useState<string>('User');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isFundOpen, setIsFundOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [greeting, setGreeting] = useState('Good day,');
  const [transactions, setTransactions] = useState<any[]>([]);
  
  const [toasts, setToasts] = useState<ToastState[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning,');
    else if (hour < 18) setGreeting('Good afternoon,');
    else setGreeting('Good evening,');
    
    // Retrieve stored name/account just in case backend doesn't send it in /balance
    const storedName = localStorage.getItem('bank_user_name');
    const storedAcc = localStorage.getItem('bank_account_number');
    if (storedName) setUserName(storedName);
    if (storedAcc) setAccountNumber(storedAcc);
  }, []);

  const showToast = useCallback((toast: Omit<ToastState, 'id'>) => {
    setToasts((prev) => [...prev, { ...toast, id: Date.now() }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await apiFetch(`/transactions?t=${Date.now()}`);
      if (res && Array.isArray(res)) {
        setTransactions(res);
      } else if (res && res.data && Array.isArray(res.data)) {
        setTransactions(res.data);
      } else if (res && res.transactions && Array.isArray(res.transactions)) {
        setTransactions(res.transactions);
      }
    } catch (err: any) {
      console.warn('Could not load transactions', err);
    }
  }, []);

  const fetchBalance = useCallback(async () => {
    try {
      // Fetch balance and transactions in parallel if possible, or sequentially
      fetchTransactions();
      
      // Added query parameter to avoid aggressive caching
      const res = await apiFetch(`/balance?t=${Date.now()}`);
      console.log('Balance response:', res);
      
      // Traverse nested data structures if they exist
      const dataObj = res.data || res.account || res.user || res;
      
      let newBalance = dataObj.account_balance ?? dataObj.balance ?? dataObj.Balance ?? dataObj.amount ?? dataObj.Amount ?? res.account_balance ?? res.balance ?? res.Balance;
      if (typeof res === 'number') newBalance = res;
      
      if (newBalance !== undefined && newBalance !== null) {
        setBalance(parseFloat(newBalance));
      }

      const newName = dataObj.account_name ?? dataObj.name ?? dataObj.Name ?? dataObj.full_name ?? dataObj.fullName ?? dataObj.user_name ?? dataObj.userName ?? res.account_name ?? res.name;
      if (newName) {
        setUserName(newName);
        localStorage.setItem('bank_user_name', newName);
      }
      
      const newAcc = dataObj.account_nummber ?? dataObj.account_number ?? dataObj.accountNumber ?? dataObj.AccountNumber ?? res.account_nummber ?? res.account_number ?? res.accountNumber;
      if (newAcc) {
        setAccountNumber(String(newAcc));
        localStorage.setItem('bank_account_number', String(newAcc));
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Failed to load balance' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleLogout = () => {
    removeAuthToken();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Toast toast={toast} onClose={removeToast} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <TransferModal 
        isOpen={isTransferOpen} 
        onClose={() => setIsTransferOpen(false)} 
        onSuccess={fetchBalance}
        showToast={showToast}
        fromAccount={accountNumber}
      />

      <FundModal 
        isOpen={isFundOpen} 
        onClose={() => setIsFundOpen(false)}
        onSuccess={fetchBalance}
        showToast={showToast}
        currentAccount={accountNumber}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName={userName}
        accountNumber={accountNumber}
        onLogout={handleLogout}
      />

      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-md shrink-0">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium truncate">{greeting}</p>
              <h1 className="text-sm font-bold text-slate-900 truncate">{userName}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6">
        {/* VIP Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-linear-to-br from-indigo-900 via-indigo-800 to-violet-900 rounded-4xl p-8 text-white shadow-2xl shadow-indigo-900/20 overflow-hidden"
        >
          {/* Abstract decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400 opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-indigo-200 font-medium text-sm tracking-wide uppercase">Total Balance</p>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-medium">Active</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 break-all">
              <span className="text-3xl sm:text-4xl font-medium text-indigo-300 shrink-0">$</span>
              <h2 className="text-4xl sm:text-5xl font-bold font-mono tracking-tight">
                {loading ? '...' : balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <p className="text-indigo-200/80 mt-2 text-sm">
              {accountNumber ? `Account: ${accountNumber}` : 'Available funds'}
            </p>
          </div>
        </motion.div>

        {/* Action Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mt-6"
        >
          <button 
            onClick={() => setIsTransferOpen(true)}
            className="flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800">Transfer</span>
          </button>
          
          <button 
            onClick={() => setIsFundOpen(true)}
            className="flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800">Fund Account</span>
          </button>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">See all</button>
          </div>
          
          {transactions.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-slate-300" />
              </div>
              <h4 className="font-semibold text-slate-800">No transactions yet</h4>
              <p className="text-sm text-slate-500 mt-1 max-w-50">When you transfer or receive money, it will show up here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
              <div className="flex flex-col">
                {transactions.map((t, idx) => {
                  const isDebit = t.type === 'debit' || t.type === 'transfer' || (t.description && t.description.toLowerCase().startsWith('transfer to')) || t.amount < 0;
                  const absAmount = Math.abs(t.amount || 0);
                  
                  return (
                    <div key={t.id || idx} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors rounded-xl gap-4">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDebit ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {isDebit ? <ArrowRightLeft className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {t.description || (isDebit ? `Transfer to ${t.to_account || 'someone'}` : 'Account Funded')}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {t.date ? new Date(t.date).toLocaleDateString() : new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold ${isDebit ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {isDebit ? '-' : '+'}${absAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {t.status || 'Completed'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
