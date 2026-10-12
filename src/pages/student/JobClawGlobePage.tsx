import React from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { JobClawDashboard } from '@/components/globe/JobClawDashboard';

export const JobClawGlobePage: React.FC = () => {
  return (
    <div className="flex-1 bg-slate-950 min-h-screen flex flex-col">
      <DashboardHeader
        title="JobClaw 3D Global Talent Radar"
        subtitle="Search and discover institutional placement drives and international software engineering opportunities via 3D interactive WebGL globe"
        breadcrumbs={[
          { label: 'Student Portal', href: '/student/dashboard' },
          { label: '3D Job Radar' },
        ]}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        <JobClawDashboard embedded={false} />
      </div>
    </div>
  );
};
