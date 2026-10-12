import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, Mail, ShieldAlert, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const { signInWithOtp, verifyOtp, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please provide a valid institutional or personal email address.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await signInWithOtp(email);
    setLoading(false);

    if (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to dispatch email verification OTP.' });
    } else {
      setOtpSent(true);
      setMessage({
        type: 'success',
        text: `Verification OTP dispatched to ${email}. Check your inbox or enter code below.`,
      });
      setCooldown(30);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setMessage({ type: 'error', text: 'Please enter the 6-digit verification code.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error, isNewUser } = await verifyOtp(email, otpCode);
    setLoading(false);

    if (error) {
      setMessage({ type: 'error', text: error.message || 'Invalid or expired OTP code.' });
    } else {
      if (email.toLowerCase().includes('feat2230') || email.toLowerCase().includes('admin')) {
        navigate('/admin/overview');
      } else if (mode === 'register' || isNewUser) {
        navigate('/student/profile?onboarding=true');
      } else {
        navigate('/student/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          {mode === 'login' ? 'Sign In to T&P Portal' : 'Create Student Account'}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Datta Meghe Institute of Higher Education and Research &bull; FEAT CSE
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {/* Mode Switcher */}
          <div className="flex border-b border-slate-200 pb-4 mb-6">
            <button
              onClick={() => {
                setMode('login');
                setMessage(null);
                setOtpSent(false);
              }}
              className={`flex-1 pb-2 text-xs font-semibold text-center border-b-2 transition-colors ${
                mode === 'login'
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Email OTP Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setMessage(null);
                setOtpSent(false);
              }}
              className={`flex-1 pb-2 text-xs font-semibold text-center border-b-2 transition-colors ${
                mode === 'register'
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              New Student Registration
            </button>
          </div>

          {/* Feedback Alert */}
          {message && (
            <div
              className={`mb-5 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                message.type === 'error'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {message.type === 'error' ? (
                <ShieldAlert className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Himanshu Vikas Chamatkar"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Contact Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@dmiher.edu.in or personal email"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Security Policy Reminder */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                <span className="font-semibold text-slate-700">Security Rule:</span> Public registration automatically creates a standard <code className="text-brand-700 bg-brand-50 px-1 py-0.5 rounded">student</code> account. Admin privileges are assigned only via authorized migration or verified T&amp;P assignment.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send Verification OTP
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Enter 6-Digit Email Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={8}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full px-3 py-2 text-center tracking-widest text-base font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                {loading ? 'Verifying Code...' : 'Verify Code & Sign In'}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-slate-500 hover:text-slate-800"
                >
                  Change email
                </button>
                <button
                  type="button"
                  disabled={cooldown > 0}
                  onClick={handleSendOtp}
                  className="text-brand-600 hover:text-brand-700 font-semibold disabled:text-slate-400"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Quick Presentation Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('owner');
                  navigate('/student/dashboard');
                }}
                className="p-2 text-xs rounded-lg border border-brand-200 bg-brand-50/60 hover:bg-brand-100 text-brand-800 font-medium transition-colors text-center"
              >
                Login as Himanshu (Owner)
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('admin');
                  navigate('/admin/overview');
                }}
                className="p-2 text-xs rounded-lg border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 font-medium transition-colors text-center"
              >
                Login as T&amp;P Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
