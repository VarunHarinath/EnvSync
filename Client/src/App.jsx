import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Environments from './pages/Environments';
import Secrets from './pages/Secrets';
import ApiKeys from './pages/ApiKeys';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
           <Route index element={<Navigate to="/projects" replace />} />
           
           <Route path="projects" element={<Projects />} />
           <Route path="projects/:projectId" element={<ProjectDetail />} />
           <Route path="projects/:projectId/environments" element={<Environments />} />
           <Route path="projects/:projectId/secrets" element={<Secrets />} />
           <Route path="projects/:projectId/api-keys" element={<ApiKeys />} />
           
           <Route path="audit-logs" element={<AuditLogs />} />
           <Route path="settings" element={<Settings />} />
           
           <Route path="*" element={<Navigate to="/projects" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
