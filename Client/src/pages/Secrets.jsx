import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecrets, useCreateSecret } from '../hooks/useSecrets.js';
import { getActiveProject } from '../utils/storage.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Plus, Lock, Eye, EyeOff } from 'lucide-react';
import { useToastContext } from '../contexts/ToastContext.jsx';

export const Secrets = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [secretName, setSecretName] = useState('');
  const [secretValue, setSecretValue] = useState('');
  const [showValue, setShowValue] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const project = getActiveProject();
    if (!project) {
      navigate('/projects');
      return;
    }
    setActiveProject(project);
  }, [navigate]);

  const { data: secrets = [], isLoading, error, refetch } = useSecrets(activeProject?.id);
  const createSecret = useCreateSecret();
  const { addToast } = useToastContext();

  const handleCreateSecret = async (e) => {
    e.preventDefault();
    if (!secretName.trim() || !secretValue.trim()) return;

    try {
      await createSecret.mutateAsync({
        projectId: activeProject.id,
        secretName: secretName.trim(),
        secretValue: secretValue.trim(),
      });
      setSecretName('');
      setSecretValue('');
      setShowCreateForm(false);
      addToast('Secret created successfully', 'success');
    } catch (err) {
      addToast(err?.message || 'Failed to create secret', 'error');
    }
  };

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">Secrets</h2>
          <p className="text-sm text-[#a1a1aa]">Project: {activeProject.name}</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-[#0a0a0a] rounded-md hover:bg-[#e4e4e7] transition-colors font-medium text-sm"
        >
          <Plus size={16} />
          New Secret
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-5 bg-[#18181b] border border-[#27272a] rounded-lg">
          <form onSubmit={handleCreateSecret} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Secret Name
              </label>
              <input
                type="text"
                value={secretName}
                onChange={(e) => setSecretName(e.target.value)}
                placeholder="SECRET_KEY"
                className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-md text-white placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#52525b]"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Secret Value
              </label>
              <div className="relative">
                <input
                  type={showValue ? 'text' : 'password'}
                  value={secretValue}
                  onChange={(e) => setSecretValue(e.target.value)}
                  placeholder="your-secret-value"
                  className="w-full px-4 py-2.5 pr-10 bg-[#27272a] border border-[#3f3f46] rounded-md text-white placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#52525b]"
                />
                <button
                  type="button"
                  onClick={() => setShowValue(!showValue)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#a1a1aa] hover:text-white transition-colors"
                >
                  {showValue ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createSecret.isPending || !secretName.trim() || !secretValue.trim()}
                className="px-4 py-2.5 bg-white text-[#0a0a0a] rounded-md hover:bg-[#e4e4e7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                {createSecret.isPending ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setSecretName('');
                  setSecretValue('');
                }}
                className="px-4 py-2.5 bg-[#27272a] text-[#e4e4e7] border border-[#3f3f46] rounded-md hover:bg-[#3f3f46] transition-colors font-medium text-sm"
              >
                Cancel
              </button>
            </div>
            {createSecret.isError && (
              <p className="text-sm text-red-400">{createSecret.error.message}</p>
            )}
          </form>
        </div>
      )}

      {secrets.length === 0 ? (
        <EmptyState
          message="No secrets yet. Create your first secret to get started."
          actionLabel="Create Secret"
          onAction={() => setShowCreateForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {secrets.map((secret) => (
            <div
              key={secret.id}
              className="p-5 bg-[#18181b] border border-[#27272a] rounded-lg hover:border-[#3f3f46] hover:bg-[#27272a] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#27272a] rounded-md">
                  <Lock className="text-white" size={18} />
                </div>
                <h3 className="font-semibold text-white">{secret.name}</h3>
              </div>
              <p className="text-xs text-[#71717a]">
                Created {new Date(secret.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
