import React from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Megaphone, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { SEED_ANNOUNCEMENTS } from '@/data/mockSeed';

export const StudentAnnouncementsPage: React.FC = () => {
  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <DashboardHeader
        title="Campus T&P Announcements & Circulars"
        subtitle="Official communications from the Faculty of Engineering & Technology Training and Placement Cell"
        breadcrumbs={[
          { label: 'Student Portal', href: '/student/dashboard' },
          { label: 'Announcements' },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        <div className="space-y-4">
          {SEED_ANNOUNCEMENTS.map((ann) => (
            <div
              key={ann.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      ann.priority === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-brand-50 text-brand-700'
                    }`}
                  >
                    {ann.priority} Priority
                  </span>
                  <span className="text-xs text-slate-400 font-medium capitalize">
                    Audience: {ann.audience.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {ann.published_at &&
                    new Date(ann.published_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{ann.body}</p>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified circular issued by Training &amp; Placement Cell, DMIHER FEAT</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
