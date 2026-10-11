import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { 
  Zap, 
  Monitor, 
  Upload, 
  ListMusic, 
  Users, 
  TrendingUp, 
  HelpCircle, 
  ArrowRight,
  Lock,
  Mail
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('alexander@flashads.io');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
      navigate('/screens');
    }, 400);
  };

  const featurePills = [
    { label: 'Manage Screens', icon: Monitor },
    { label: 'Upload Content', icon: Upload },
    { label: 'Create Playlists', icon: ListMusic },
    { label: 'Reach Audiences', icon: Users },
    { label: 'Grow Your Business', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans">
      {/* Left Panel: White Login Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 bg-white">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-[#FF5A1F] flex items-center justify-center shadow-lg shadow-orange-500/20 text-white shrink-0">
            <Zap className="w-6 h-6 fill-white text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider text-slate-900 leading-tight">
              FLASH <span className="text-[#FF5A1F]">ADS</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Digital Signage Network
            </span>
          </div>
        </div>

        {/* Login Form Center Box */}
        <div className="my-8 max-w-md w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Your Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Enter your administrative credentials to manage displays and schedule digital broadcast campaigns.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@flashads.io"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2057D5] focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2057D5] focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                Remember this device
              </label>
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 font-semibold">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2 font-bold shadow-md shadow-blue-600/20"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Flash Ads
            </Button>
          </form>

          {/* Contact Administrator Card */}
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800 block">Need player activation keys?</span>
              Contact your network administrator or request provisioning for your venue screens.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>&copy; 2026 Flash Ads Global Network LLC. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:text-slate-600">Privacy Policy</Link>
            <Link to="/help" className="hover:text-slate-600">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Right Panel: Promotional Digital Signage Showcase */}
      <div className="w-full lg:w-1/2 relative bg-[#0B131E] text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80"
            alt="Digital Signage Venue"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B131E] via-[#0B131E]/80 to-[#0B131E]/40" />
        </div>

        {/* Top Status */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Network Status: 100% Operational
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">32 Connected Displays</span>
        </div>

        {/* Center Headline */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[#FF5A1F] text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" /> High Impact DOOH Advertising
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            Turn Screens Into <span className="text-[#FF5A1F]">Opportunities</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed font-normal">
            Broadcast dynamic commercial loops, stream live menus, and monetize foot-traffic across cafes, supermarkets, and corporate towers.
          </p>

          {/* 5 Feature Pills */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {featurePills.map((pill, idx) => {
              const Icon = pill.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-slate-200 backdrop-blur-md transition-colors"
                >
                  <Icon className="w-4 h-4 text-orange-400" />
                  <span>{pill.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Specs */}
        <div className="relative z-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-extrabold text-white">4K UHD</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Hardware Engine</p>
          </div>
          <div>
            <p className="text-xl font-extrabold text-emerald-400">&lt; 15s</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Cloud Deployment</p>
          </div>
          <div>
            <p className="text-xl font-extrabold text-orange-400">99.9%</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Uptime Target</p>
          </div>
        </div>
      </div>
    </div>
  );
};
