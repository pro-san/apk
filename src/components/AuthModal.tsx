import React, { useState } from 'react';
import { X, Mail, Lock, User, Github, Chrome, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; role: 'user' | 'vendor' | 'admin' }) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<'user' | 'vendor' | 'admin'>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Authentication successful! Routing dashboard...');
    setTimeout(() => {
      onLoginSuccess({
        name: name || (role === 'admin' ? 'Administrator' : role === 'vendor' ? 'Alex Creator' : 'Maisie Clarke'),
        email: email || (role === 'admin' ? 'admin@lumina.ai' : role === 'vendor' ? 'alex@labs.com' : 'user@domain.com'),
        role,
      });
      onClose();
      setSuccessMsg('');
    }, 1200);
  };

  const handleQuickLogin = (selectedRole: 'user' | 'vendor' | 'admin') => {
    setRole(selectedRole);
    setSuccessMsg(`Simulating ${selectedRole.toUpperCase()} environment login...`);
    setTimeout(() => {
      onLoginSuccess({
        name: selectedRole === 'admin' ? 'System Administrator' : selectedRole === 'vendor' ? 'SaaS Creator Pro' : 'Maisie Clarke',
        email: `${selectedRole}@lumina.ai`,
        role: selectedRole,
      });
      onClose();
      setSuccessMsg('');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        id="auth-card"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          id="close-auth-modal"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-extrabold text-white">
              {isRegister ? 'Create Your Account' : 'Welcome to Lumina AI'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {isRegister ? 'Join the multi-model AI marketplace' : 'Access your tools, products, and analytics'}
            </p>
          </div>

          {/* Role testing sandbox helper */}
          <div className="mb-6 p-4 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 block mb-2">
              ⚡ Sandbox Persona Quick Selector
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('user')}
                id="quick-login-user"
                className="py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 hover:text-white transition text-slate-300 font-medium"
              >
                Buy User
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('vendor')}
                id="quick-login-vendor"
                className="py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:text-white transition text-slate-300 font-medium"
              >
                Creator (Vendor)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                id="quick-login-admin"
                className="py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:text-white transition text-slate-300 font-medium"
              >
                Admin
              </button>
            </div>
          </div>

          {successMsg ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3 text-sm animate-pulse mb-4">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">FULL NAME</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 text-slate-500 w-4.5 h-4.5" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-200 placeholder-slate-600 rounded-xl focus:outline-none text-sm transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 text-slate-500 w-4.5 h-4.5" />
                  <input
                    type="email"
                    required
                    placeholder="user@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-200 placeholder-slate-600 rounded-xl focus:outline-none text-sm transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">SECURE PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 text-slate-500 w-4.5 h-4.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-200 placeholder-slate-600 rounded-xl focus:outline-none text-sm transition"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">ACCOUNT PURPOSE</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-200 rounded-xl focus:outline-none text-sm transition"
                  >
                    <option value="user">Buyer Account (Purchase & Discover AI)</option>
                    <option value="vendor">Creator Account (Publish & Sell AI)</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                id="auth-submit-btn"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl transition shadow-lg text-sm mt-2"
              >
                {isRegister ? 'Create Free Account' : 'Sign In'}
              </button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-slate-900 px-3 text-xs text-slate-500 absolute font-medium">
                OR CONTINUE WITH
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => handleQuickLogin('user')}
                id="auth-google-btn"
                className="flex items-center justify-center gap-2 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-xl transition text-slate-300 text-xs font-bold"
              >
                <Chrome className="w-4 h-4 text-amber-500" />
                Google
              </button>
              <button
                onClick={() => handleQuickLogin('user')}
                id="auth-github-btn"
                className="flex items-center justify-center gap-2 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-xl transition text-slate-300 text-xs font-bold"
              >
                <Github className="w-4 h-4 text-white" />
                GitHub
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs">
            <button
              onClick={() => setIsRegister(!isRegister)}
              id="toggle-auth-mode"
              className="text-slate-400 hover:text-amber-500 transition font-medium"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
