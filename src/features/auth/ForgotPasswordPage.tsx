import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Zap, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
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

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Password Reset Dispatched</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We have sent instructions and a temporary security link to <b>{email}</b>.
            </p>
            <Link to="/login" className="inline-block mt-4 text-xs font-bold text-blue-600 hover:text-blue-800">
              Return to Login
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-slate-900">Reset Your Password</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
              Enter your corporate administrator email and we'll dispatch an authorization recovery link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@flashads.io"
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Send Recovery Link
              </Button>

              <div className="pt-2 text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
