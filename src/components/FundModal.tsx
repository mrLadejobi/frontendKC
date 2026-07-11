import { useState, useEffect } from 'react';
import { X, Plus, CreditCard, ChevronDown } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { ToastState } from '../types';

interface FundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (toast: Omit<ToastState, 'id'>) => void;
  currentAccount?: string;
}

export default function FundModal({ isOpen, onClose, onSuccess, showToast, currentAccount }: FundModalProps) {
  const [accountNumber, setAccountNumber] = useState(currentAccount || localStorage.getItem('bank_account_number') || '');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentAccount) {
      setAccountNumber(currentAccount);
    }
  }, [currentAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !paymentDetails) return;

    setLoading(true);
    try {
      await apiFetch('/fund-account', {
        method: 'POST',
        body: JSON.stringify({
          account_nummber: accountNumber, // Matches Go struct typo
          account_number: accountNumber,
          amount: parseFloat(amount),
          payment_type: paymentType,
          payment_details: paymentDetails,
        }),
      });

      showToast({ type: 'success', message: 'Account funded successfully!' });
      onSuccess();
      setAmount('');
      setAccountNumber('');
      setPaymentType('card');
      setPaymentDetails('');
      onClose();
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Funding failed.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Fund Account</h2>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Account Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-colors sm:text-sm bg-slate-50 focus:bg-white"
                    placeholder="Your Account Number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount to Fund</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-medium">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full pl-8 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-colors sm:text-sm bg-slate-50 focus:bg-white font-mono"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Type</label>
                <div className="relative">
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="block w-full pl-4 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-colors sm:text-sm bg-slate-50 focus:bg-white appearance-none"
                  >
                    <option value="card">Card</option>
                    <option value="crypto">Crypto</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {paymentType === 'card' ? 'Card Number' : 'Wallet Address'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-colors sm:text-sm bg-slate-50 focus:bg-white"
                    placeholder={paymentType === 'card' ? '0000 0000 0000 0000' : '0x...'}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !amount || !accountNumber || !paymentDetails}
                className="flex-2 flex items-center justify-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Processing...' : 'Add Funds'}
                {!loading && <Plus className="ml-2 w-4 h-4" />}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
