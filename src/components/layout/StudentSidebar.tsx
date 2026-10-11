import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserSquare2,
  FileCheck2,
  Briefcase,
  FileText,
  ListTodo,
  Megaphone,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const StudentSidebar: React.FC = () => {
  const { profile } = useAuth();

  const links = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Overview Dashboard' },
    { to: '/student/profile', icon: UserSquare2, label: 'Profile Builder' },
    { to: '/student/ats', icon: FileCheck2, label: 'ATS Resume Analysis' },
    { to: '/student/jobs', icon: Briefcase, label: 'Job Recommendations' },
    { to: '/student/cover-letter', icon: FileText, label: 'Cover Letter Builder' },
    { to: '/student/applications', icon: ListTodo, label: 'Application Tracker' },
    { to: '/student/announcements', icon: Megaphone, label: 'Announcements' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-white text-sm tracking-tight leading-tight">DMIHER Portal</div>
          <div className="text-[11px] text-slate-400 font-medium">Student Placement Hub</div>
        </div>
      </div>

      {/* Profile Readiness Capsule */}
      <div className="p-4 mx-3 my-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            ATS Readiness
          </span>
          <span className="text-amber-400 font-bold">{profile?.ats_score || 78}%</span>
        </div>
        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${profile?.ats_score || 78}%` }}
          />
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
          <span>Target: {profile?.preferred_role?.split(' ')[0] || 'AI/ML'}</span>
          <span className="text-emerald-400 font-medium">Eligible</span>
        </div>
      </div>

      {/* Nav Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white font-semibold shadow-sm shadow-brand-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Institutional Footer */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500">
        <div>Department of CSE</div>
        <div className="text-slate-400 font-medium mt-0.5">Faculty of Eng. &amp; Tech</div>
      </div>
    </aside>
  );
};
