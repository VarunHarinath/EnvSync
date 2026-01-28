import { useDroppable } from '@dnd-kit/core';
import { useEnvSecrets } from '../hooks/useEnvSecrets.js';
import { LoadingSpinner } from './LoadingSpinner.jsx';
import { Settings, X } from 'lucide-react';

export const EnvironmentCard = ({ environment, onDetachSecret, secrets = [] }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: environment.id,
  });

  const { data: envSecrets = [], isLoading } = useEnvSecrets(environment.id);

  // Helper to get secret name by ID
  const getSecretName = (secretId) => {
    if (!secretId) return 'Unknown';
    const secret = secrets.find((s) => s.id === secretId || String(s.id) === String(secretId));
    return secret?.name || `Secret ${secretId}`;
  };

  return (
    <div
      ref={setNodeRef}
      className={`p-5 bg-[#18181b] border-2 rounded-lg transition-all ${
        isOver
          ? 'border-white bg-[#27272a]'
          : 'border-[#27272a] hover:border-[#3f3f46] hover:bg-[#27272a]'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#27272a] rounded-md">
          <Settings className="text-white" size={18} />
        </div>
        <h3 className="font-semibold text-white">{environment.name}</h3>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-[#71717a] mb-2 font-medium">Attached Secrets</p>
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : envSecrets.length === 0 ? (
          <p className="text-sm text-[#71717a] italic">Drop secrets here</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {envSecrets.map((envSecret) => (
              <div
                key={envSecret.id}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#27272a] text-white rounded-md text-xs border border-[#3f3f46]"
              >
                <span>{envSecret.secret?.name || getSecretName(envSecret.secret_id || envSecret.secretId)}</span>
                <button
                  onClick={() => onDetachSecret(environment.id, envSecret.secret_id || envSecret.secretId)}
                  className="hover:bg-[#3f3f46] rounded p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
