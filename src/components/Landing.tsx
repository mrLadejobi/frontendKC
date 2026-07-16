import { ArrowRight, Shield, Zap, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingProps {
  onNavigate: (view: 'login' | 'register') => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg leading-none">K</span>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Kuda Clone</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('login')}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block"
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute top-0 right-0 w-150 h-150 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-100 h-100 bg-violet-50 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

          <div className="lg:w-2/3 relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]"
            >
              The bank of <br />
              <span className="text-indigo-600">the free.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-xl text-slate-600 max-w-xl leading-relaxed"
            >
              We're here to help you get the best out of your money, no BS, no hidden fees, just simple digital banking.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <button 
                onClick={() => onNavigate('register')}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Open an Account
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onNavigate('login')}
                className="flex items-center justify-center gap-2 bg-slate-50 text-slate-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-100 transition-all border border-slate-200"
              >
                Sign In
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl tracking-tight">Everything you need to manage your money</h2>
            <p className="mt-4 text-lg text-slate-600">Simple, transparent, and built for you.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Transfers</h3>
              <p className="text-slate-600 leading-relaxed">Send money to anyone, anywhere in seconds. No more waiting days for funds to clear.</p>
            </div>
            
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Bank-grade Security</h3>
              <p className="text-slate-600 leading-relaxed">Your money is safe with us. We use state-of-the-art encryption to protect your funds.</p>
            </div>
            
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Always in Control</h3>
              <p className="text-slate-600 leading-relaxed">Manage your entire financial life from one app. Track spending, set limits, and more.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
