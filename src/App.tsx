import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignUpForm } from './components/auth/SignUpForm';
import { SignInForm } from './components/auth/SignInForm';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { SettingsLayout } from './components/settings/SettingsLayout';
import { PipelineSettings } from './components/settings/PipelineSettings';
import { ProfileSettings } from './components/settings/ProfileSettings';
import { TeamSettings } from './components/settings/TeamSettings';
import { ReportsLayout } from './components/reports/ReportsLayout';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={!user ? <SignUpForm /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signin"
          element={!user ? <SignInForm /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <DashboardLayout>
                <KanbanBoard />
              </DashboardLayout>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/reports"
          element={
            user ? (
              <DashboardLayout>
                <ReportsLayout />
              </DashboardLayout>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/settings"
          element={
            user ? (
              <DashboardLayout>
                <SettingsLayout />
              </DashboardLayout>
            ) : (
              <Navigate to="/signin" />
            )
          }
        >
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="team" element={<TeamSettings />} />
          <Route path="pipeline" element={<PipelineSettings />} />
          <Route index element={<Navigate to="profile" replace />} />
        </Route>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/signin"} />} />
      </Routes>
    </Router>
  );
}

export default App;