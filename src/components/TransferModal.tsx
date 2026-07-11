import { useState } from 'react';
import { X, Send, CreditCard, ArrowRight, Lock } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { ToastState } from '../types';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (toast: Omit<ToastState, 'id'>) => void;
  fromAccount?: string;
}

export default function TransferModal({ isOpen, onClose, onSuccess, showToast, fromAccount }: TransferModalProps) {
  const [destinationAccount, setDestinationAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationAccount || !amount || !pin) return;

    setLoading(true);
    try {
      const senderAccount = (fromAccount || localStorage.getItem('bank_account_number') || '').trim();
      await apiFetch('/transfer', {
        method: 'POST',
        body: JSON.stringify({
          from_account: senderAccount,
          to_account: destinationAccount.trim(),
          amount: parseFloat(amount),
          pin: pin,
          transaction_pin: pin,
          // Fallbacks for sender
          account_number: senderAccount,
          account_nummber: senderAccount,
          sender_account: senderAccount,
          // Fallbacks for receiver
          destination_account: destinationAccount.trim(),
          receiver_account: destinationAccount.trim(),
        }),
      });

      showToast({ type: 'success', message: 'Transfer successful!' });
      onSuccess();
      setDestinationAccount('');
      setAmount('');
      setPin('');
      onClose();
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Transfer failed.' });
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
            <h2 className="text-xl font-bold text-slate-900">Transfer Funds</h2>
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Destination Account</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={destinationAccount}
                    onChange={(e) => setDestinationAccount(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-colors sm:text-sm bg-slate-50 focus:bg-white"
                    placeholder="Account Number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount</label>
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
                    className="block w-full pl-8 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-colors sm:text-sm bg-slate-50 focus:bg-white font-mono"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Transaction PIN</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
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
                disabled={loading || !amount || !destinationAccount || pin.length < 4}
                className="flex-2 flex items-center justify-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Processing...' : 'Send Money'}
                {!loading && <Send className="ml-2 w-4 h-4" />}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
