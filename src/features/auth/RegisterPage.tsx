import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Zap, ArrowRight, Mail, Lock, User } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      register(name, email);
      navigate('/screens');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#F4F6FB] font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-[#FF5A1F] flex items-center justify-center text-white">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          <span className="text-base font-black text-slate-900 tracking-wider">
            FLASH <span className="text-[#FF5A1F]">ADS</span>
          </span>
        </div>

        <h2 className="text-xl font-bold text-slate-900">Create an Organization Account</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
          Start deploying cloud digital signage and monetize commercial displays.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marcus@metromart.com"
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2" icon={<ArrowRight className="w-4 h-4" />}>
            Create Account & Enter Console
          </Button>

          <p className="text-center text-xs text-slate-500 pt-3">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
