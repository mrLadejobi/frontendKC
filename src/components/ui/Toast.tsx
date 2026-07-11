import { CheckCircle2, XCircle, X } from 'lucide-react';
import { ToastState } from '../../types';
import { useEffect } from 'react';

interface ToastProps {
  toast: ToastState;
  onClose: (id: number) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const isSuccess = toast.type === 'success';

  return (
    <div className={`flex items-center gap-3 p-4 pr-12 rounded-xl shadow-lg border relative overflow-hidden transition-all duration-300 w-full max-w-sm ${isSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`} />
      {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
      <p className="text-sm font-medium">{toast.message}</p>
      <button 
        onClick={() => onClose(toast.id)} 
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/5 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
