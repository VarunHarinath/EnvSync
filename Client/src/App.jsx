import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Landing from './pages/Landing';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Environments from './pages/Environments';
import Secrets from './pages/Secrets';
import APIKeys from './pages/APIKeys';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Console / Dashboard Routes with Sidebar/Topbar */}
        <Route element={<AppShell />}>
           <Route path="/projects" element={<Projects />} />
           <Route path="/projects/:projectId" element={<ProjectDetail />} />
           <Route path="/projects/:projectId/environments" element={<Environments />} />
           <Route path="/projects/:projectId/secrets" element={<Secrets />} />
           <Route path="/projects/:projectId/api-keys" element={<APIKeys />} />
           
           <Route path="/audit-logs" element={<AuditLogs />} />
           <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Catch-all redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
