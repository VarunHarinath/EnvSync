import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useEnvironments, useCreateEnvironment } from '../hooks/useEnvironments.js';
import { useSecrets } from '../hooks/useSecrets.js';
import { useEnvSecrets, useAttachSecretToEnv, useDetachSecretFromEnv } from '../hooks/useEnvSecrets.js';
import { getActiveProject } from '../utils/storage.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Plus, X, Lock } from 'lucide-react';
import { EnvironmentCard } from '../components/EnvironmentCard.jsx';
import { SecretItem } from '../components/SecretItem.jsx';
import { useToastContext } from '../contexts/ToastContext.jsx';

export const Environments = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [environmentName, setEnvironmentName] = useState('');
  const [activeId, setActiveId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const project = getActiveProject();
    if (!project) {
      navigate('/projects');
      return;
    }
    setActiveProject(project);
  }, [navigate]);

  const { data: environments = [], isLoading: envLoading, error: envError, refetch: refetchEnvs } = useEnvironments(activeProject?.id);
  const { data: secrets = [], isLoading: secretsLoading } = useSecrets(activeProject?.id);
  const createEnvironment = useCreateEnvironment();
  const attachSecret = useAttachSecretToEnv();
  const detachSecret = useDetachSecretFromEnv();
  const { addToast } = useToastContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleCreateEnvironment = async (e) => {
    e.preventDefault();
    if (!environmentName.trim()) return;

    try {
      await createEnvironment.mutateAsync({
        projectId: activeProject.id,
        name: environmentName.trim(),
      });
      setEnvironmentName('');
      setShowCreateForm(false);
      addToast('Environment created successfully', 'success');
    } catch (err) {
      addToast(err?.message || 'Failed to create environment', 'error');
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    // active.id is the secret ID, over.id is the environment ID
    const secretId = active.id;
    const environmentId = over.id;

    try {
      await attachSecret.mutateAsync({
        environmentId,
        secretId,
      });
      addToast('Secret attached successfully', 'success');
    } catch (err) {
      addToast(err?.message || 'Failed to attach secret', 'error');
    }
  };

  const handleDetachSecret = async (environmentId, secretId) => {
    try {
      await detachSecret.mutateAsync({
        environmentId,
        secretId,
      });
      addToast('Secret detached successfully', 'success');
    } catch (err) {
      addToast(err?.message || 'Failed to detach secret', 'error');
    }
  };

  if (!activeProject) {
    return null; // Will redirect
  }

  if (envLoading || secretsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (envError) {
    return <ErrorState message={envError.message} onRetry={refetchEnvs} />;
  }

  const activeSecret = secrets.find((s) => s.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[calc(100vh-80px)]">
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-1">Environments</h2>
              <p className="text-sm text-[#a1a1aa]">Project: {activeProject.name}</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#0a0a0a] rounded-md hover:bg-[#e4e4e7] transition-colors font-medium text-sm"
            >
              <Plus size={16} />
              New Environment
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-6 p-5 bg-[#18181b] border border-[#27272a] rounded-lg">
              <form onSubmit={handleCreateEnvironment} className="flex gap-3">
                <input
                  type="text"
                  value={environmentName}
                  onChange={(e) => setEnvironmentName(e.target.value)}
                  placeholder="Environment name (e.g., production, staging)"
                  className="flex-1 px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-md text-white placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#52525b]"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={createEnvironment.isPending || !environmentName.trim()}
                  className="px-4 py-2.5 bg-white text-[#0a0a0a] rounded-md hover:bg-[#e4e4e7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  {createEnvironment.isPending ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEnvironmentName('');
                  }}
                  className="px-4 py-2.5 bg-[#27272a] text-[#e4e4e7] border border-[#3f3f46] rounded-md hover:bg-[#3f3f46] transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
              </form>
              {createEnvironment.isError && (
                <p className="mt-3 text-sm text-red-400">{createEnvironment.error.message}</p>
              )}
            </div>
          )}

          {environments.length === 0 ? (
            <EmptyState
              message="No environments yet. Create your first environment to get started."
              actionLabel="Create Environment"
              onAction={() => setShowCreateForm(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {environments.map((environment) => (
                <EnvironmentCard
                  key={environment.id}
                  environment={environment}
                  onDetachSecret={handleDetachSecret}
                  secrets={secrets}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right panel - Secrets list */}
        <div className="w-80 border-l border-[#27272a] bg-[#18181b] p-5 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Secrets</h3>
          {secrets.length === 0 ? (
            <p className="text-sm text-[#71717a]">No secrets available. Create secrets first.</p>
          ) : (
            <div className="space-y-2">
              {secrets.map((secret) => (
                <SecretItem key={secret.id} secret={secret} />
              ))}
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeSecret ? (
          <div className="p-3 bg-[#27272a] border-2 border-white rounded-lg shadow-xl">
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-white" />
              <span className="text-sm font-medium text-white">{activeSecret.name}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
