import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, ShieldCheck, UserCheck, LogOut, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { profile, isAdmin, isStudent, signOut, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Institutional Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-tight text-base tracking-tight flex items-center gap-2">
              DMIHER FEAT
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                T&amp;P Portal
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Training &amp; Placement Automation System
            </div>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Persona Switcher for Presentation & Testing */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-600">
            <span className="px-2 text-slate-400">View as:</span>
            <button
              onClick={() => {
                switchDemoUser('owner');
                navigate('/student/dashboard');
              }}
              className={`px-2.5 py-1 rounded-md transition-all ${
                isStudent && profile?.email?.includes('123himanshu')
                  ? 'bg-white text-brand-700 shadow-sm font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Student (Himanshu)
            </button>
            <button
              onClick={() => {
                switchDemoUser('admin');
                navigate('/admin/overview');
              }}
              className={`px-2.5 py-1 rounded-md transition-all ${
                isAdmin
                  ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              T&amp;P Admin
            </button>
          </div>

          {profile ? (
            <div className="flex items-center gap-3">
              <Link
                to={isAdmin ? '/admin/overview' : '/student/dashboard'}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-colors"
              >
                {isAdmin ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <UserCheck className="w-4 h-4" />}
                {isAdmin ? 'Admin Dashboard' : 'Student Portal'}
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
              <button
                onClick={() => signOut()}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth?mode=login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth?mode=register"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm rounded-lg transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
