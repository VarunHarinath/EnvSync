import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Landing from './pages/Landing';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Environments from './pages/Environments';
import Secrets from './pages/Secrets';
import ApiKeys from './pages/ApiKeys';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Users from './pages/Users';
import AuditLogs from './pages/AuditLogs';
import McpAgents from './pages/McpAgents';
import ProtectedRoute from './components/ProtectedRoute';

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Console / Dashboard Routes with Sidebar/Topbar */}
          <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
             <Route path="/projects" element={<Projects />} />
             <Route path="/projects/:projectId" element={<ProjectDetail />} />
             <Route path="/projects/:projectId/environments" element={<Environments />} />
             <Route path="/projects/:projectId/secrets" element={<Secrets />} />
             <Route path="/projects/:projectId/api-keys" element={<ApiKeys />} />
             
             <Route path="/settings" element={<Settings />} />
             <Route path="/admin/users" element={<ProtectedRoute admin><Users /></ProtectedRoute>} />
             <Route path="/admin/audit-logs" element={<ProtectedRoute admin><AuditLogs /></ProtectedRoute>} />
             <Route path="/mcp" element={<McpAgents />} />
          </Route>
          
          {/* Catch-all redirect to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
