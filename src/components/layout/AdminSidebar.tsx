import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Briefcase,
  GitCompare,
  CheckCircle2,
  GraduationCap,
  BarChart3,
  Megaphone,
  Building2,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const links = [
    { to: '/admin/overview', icon: BarChart3, label: 'T&P Overview' },
    { to: '/admin/students', icon: Users, label: 'Student Management' },
    { to: '/admin/jobs', icon: Briefcase, label: 'Jobs & Drives' },
    { to: '/admin/matching', icon: GitCompare, label: 'Candidate Matching' },
    { to: '/admin/applications', icon: CheckCircle2, label: 'Application Pipeline' },
    { to: '/admin/training', icon: GraduationCap, label: 'Skill Gaps & Training' },
    { to: '/admin/analytics', icon: Building2, label: 'Placement Analytics' },
    { to: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-white text-sm tracking-tight leading-tight">DMIHER T&amp;P</div>
          <div className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">Officer Portal</div>
        </div>
      </div>

      {/* Role Badge */}
      <div className="p-3 mx-3 my-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs">
        <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Authorized Admin Area
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          feat2230@gmail.com
        </div>
      </div>

      {/* Navigation */}
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
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
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
        <div>Training &amp; Placement Cell</div>
        <div className="text-slate-400 font-medium mt-0.5">DMIHER FEAT Wardha</div>
      </div>
    </aside>
  );
};
