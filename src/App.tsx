import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Public Pages
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/auth/AuthPage';

// Student Pages
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { ProfileBuilder } from '@/pages/student/ProfileBuilder';
import { ATSAnalysisPage } from '@/pages/student/ATSAnalysisPage';
import { JobRecommendationsPage } from '@/pages/student/JobRecommendationsPage';
import { CoverLetterBuilderPage } from '@/pages/student/CoverLetterBuilderPage';
import { ApplicationTrackerPage } from '@/pages/student/ApplicationTrackerPage';
import { StudentAnnouncementsPage } from '@/pages/student/StudentAnnouncementsPage';
import { JobClawGlobePage } from '@/pages/student/JobClawGlobePage';

// Admin Pages
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { AdminStudentManagementPage } from '@/pages/admin/AdminStudentManagementPage';
import { AdminJobManagementPage } from '@/pages/admin/AdminJobManagementPage';
import { AdminCandidateMatchingPage } from '@/pages/admin/AdminCandidateMatchingPage';
import { AdminApplicationManagementPage } from '@/pages/admin/AdminApplicationManagementPage';
import { AdminSkillsTrainingPage } from '@/pages/admin/AdminSkillsTrainingPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminAnnouncementsPage } from '@/pages/admin/AdminAnnouncementsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Student Portal */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<ProfileBuilder />} />
            <Route path="ats" element={<ATSAnalysisPage />} />
            <Route path="jobs" element={<JobRecommendationsPage />} />
            <Route path="cover-letter" element={<CoverLetterBuilderPage />} />
            <Route path="applications" element={<ApplicationTrackerPage />} />
            <Route path="globe" element={<JobClawGlobePage />} />
            <Route path="announcements" element={<StudentAnnouncementsPage />} />
          </Route>

          {/* Protected T&P Admin Portal */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/overview" replace />} />
            <Route path="overview" element={<AdminOverviewPage />} />
            <Route path="students" element={<AdminStudentManagementPage />} />
            <Route path="jobs" element={<AdminJobManagementPage />} />
            <Route path="matching" element={<AdminCandidateMatchingPage />} />
            <Route path="applications" element={<AdminApplicationManagementPage />} />
            <Route path="training" element={<AdminSkillsTrainingPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="announcements" element={<AdminAnnouncementsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
