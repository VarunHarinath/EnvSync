import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { Header } from './components/Header.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Projects } from './pages/Projects.jsx';
import { Secrets } from './pages/Secrets.jsx';
import { Environments } from './pages/Environments.jsx';
import { APIKeys } from './pages/APIKeys.jsx';
import { getActiveProject } from './utils/storage.js';

function App() {
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    setActiveProject(getActiveProject());
  }, []);

  return (
    <ToastProvider>
      <div className="flex flex-col h-screen bg-[#0a0a0a]">
        <Header onProjectChange={setActiveProject} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
            <Routes>
              <Route path="/" element={<Navigate to="/projects" replace />} />
              <Route path="/projects" element={<Projects />} />
              <Route
                path="/environments"
                element={
                  activeProject ? (
                    <Environments />
                  ) : (
                    <Navigate to="/projects" replace />
                  )
                }
              />
              <Route
                path="/secrets"
                element={
                  activeProject ? (
                    <Secrets />
                  ) : (
                    <Navigate to="/projects" replace />
                  )
                }
              />
              <Route
                path="/apikeys"
                element={
                  activeProject ? (
                    <APIKeys />
                  ) : (
                    <Navigate to="/projects" replace />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
