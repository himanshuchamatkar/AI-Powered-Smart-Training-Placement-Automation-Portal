import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bell, LogOut, ChevronRight, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
}) => {
  const { profile, role, signOut, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label}>
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-slate-700 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-600 font-medium">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Switch mode pill */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => {
              switchDemoUser('owner');
              navigate('/student/dashboard');
            }}
            className={`px-2 py-1 rounded-md transition-all ${
              role === 'student'
                ? 'bg-white text-brand-700 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Student Mode
          </button>
          <button
            onClick={() => {
              switchDemoUser('admin');
              navigate('/admin/overview');
            }}
            className={`px-2 py-1 rounded-md transition-all ${
              role === 'admin'
                ? 'bg-white text-emerald-700 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            T&amp;P Admin Mode
          </button>
        </div>

        {/* Notifications Icon */}
        <Link
          to={role === 'admin' ? '/admin/announcements' : '/student/announcements'}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors"
          title="Announcements"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-brand-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
        </Link>

        {/* Profile Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {profile?.full_name ? profile.full_name.charAt(0) : <User className="w-4 h-4" />}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-tight">
              {profile?.full_name || 'Authenticated User'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium capitalize">
              {role === 'admin' ? 'T&P Officer (Admin)' : `${profile?.department?.split(' ')[0] || 'CSE'} Student`}
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
