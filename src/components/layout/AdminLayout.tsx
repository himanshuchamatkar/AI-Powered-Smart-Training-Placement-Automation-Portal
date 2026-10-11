import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { ShieldX, ArrowLeft } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, loading, switchDemoUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-900 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-emerald-400">Verifying Administrative Privileges...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Restricted Access (Admin Area)</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Your account does not possess Training &amp; Placement Administrator privileges. Administrative operations are restricted to authorized institutional accounts (e.g., <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded">feat2230@gmail.com</code>).
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/student/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Student Dashboard
            </Link>
            <button
              onClick={() => switchDemoUser('admin')}
              className="w-full px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              Switch to T&amp;P Admin Presentation Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen bg-slate-900">
        <Outlet />
      </div>
    </div>
  );
};
