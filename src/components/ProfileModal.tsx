import { X, LogOut, User, Shield, CreditCard, Mail, Phone, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  accountNumber: string;
  onLogout: () => void;
}

export default function ProfileModal({ isOpen, onClose, userName, accountNumber, onLogout }: ProfileModalProps) {
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
          className="relative w-full max-w-md bg-slate-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 shrink-0">
            <h2 className="text-xl font-bold text-slate-900">Profile</h2>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1 p-6">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600 shadow-sm border-4 border-white">
                <User className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{userName || 'User'}</h3>
              <div className="flex items-center gap-1.5 mt-1 text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                <CreditCard className="w-4 h-4" />
                <span className="font-mono text-sm">{accountNumber || 'N/A'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">Security & PIN</p>
                  <p className="text-xs text-slate-500 mt-0.5">Change your transaction PIN</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  <Settings className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">Preferences</p>
                  <p className="text-xs text-slate-500 mt-0.5">Notifications, limits and app settings</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-200">
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-sm text-sm font-semibold text-red-600 bg-white border border-red-100 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
