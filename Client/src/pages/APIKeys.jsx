import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnvironments } from '../hooks/useEnvironments.js';
import { getActiveProject } from '../utils/storage.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { Key } from 'lucide-react';

export const APIKeys = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const project = getActiveProject();
    if (!project) {
      navigate('/projects');
      return;
    }
    setActiveProject(project);
  }, [navigate]);

  const { data: environments = [], isLoading, error, refetch } = useEnvironments(activeProject?.id);

  if (!activeProject) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-1">API Keys</h2>
        <p className="text-sm text-[#a1a1aa]">Project: {activeProject.name}</p>
      </div>

      <div className="max-w-2xl">
        <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#27272a] rounded-md">
              <Key className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Generate API Key</h3>
              <p className="text-sm text-[#71717a]">Coming soon</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Environment
              </label>
              <select
                value={selectedEnvironment}
                onChange={(e) => setSelectedEnvironment(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#52525b]"
              >
                <option value="">Select an environment</option>
                {environments.map((env) => (
                  <option key={env.id} value={env.id}>
                    {env.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              disabled
              className="w-full px-4 py-2.5 bg-[#27272a] text-[#71717a] border border-[#3f3f46] rounded-md cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Key size={18} />
              Generate Key
            </button>

            <p className="text-sm text-[#71717a] text-center italic">
              API key generation will be available in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
