import { useState, useEffect } from 'react';
import { useProjects, useCreateProject } from '../hooks/useProjects.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Plus, FolderKanban } from 'lucide-react';
import { setActiveProject } from '../utils/storage.js';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '../contexts/ToastContext.jsx';

export const Projects = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const { data: projects = [], isLoading, error, refetch } = useProjects();
  const createProject = useCreateProject();
  const navigate = useNavigate();
  const { addToast } = useToastContext();

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      const newProject = await createProject.mutateAsync({ name: projectName.trim() });
      setProjectName('');
      setShowCreateForm(false);
      addToast('Project created successfully', 'success');
      // Auto-select the new project
      setActiveProject(newProject.id, newProject.name);
      navigate('/environments');
    } catch (err) {
      addToast(err?.message || 'Failed to create project', 'error');
    }
  };

  const handleSelectProject = (project) => {
    setActiveProject(project.id, project.name);
    navigate('/environments');
  };

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
          <h2 className="text-2xl font-semibold text-white mb-1">Projects</h2>
          <p className="text-sm text-[#a1a1aa]">Manage your projects and environments</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-[#0a0a0a] rounded-md hover:bg-[#e4e4e7] transition-colors font-medium text-sm"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-5 bg-[#18181b] border border-[#27272a] rounded-lg">
          <form onSubmit={handleCreateProject} className="flex gap-3">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
              className="flex-1 px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-md text-white placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#52525b]"
              autoFocus
            />
            <button
              type="submit"
              disabled={createProject.isPending || !projectName.trim()}
              className="px-4 py-2.5 bg-white text-[#0a0a0a] rounded-md hover:bg-[#e4e4e7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              {createProject.isPending ? 'Creating...' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setProjectName('');
              }}
              className="px-4 py-2.5 bg-[#27272a] text-[#e4e4e7] border border-[#3f3f46] rounded-md hover:bg-[#3f3f46] transition-colors font-medium text-sm"
            >
              Cancel
            </button>
          </form>
          {createProject.isError && (
            <p className="mt-3 text-sm text-red-400">{createProject.error.message}</p>
          )}
        </div>
      )}

      {projects.length === 0 ? (
        <EmptyState
          message="No projects yet. Create your first project to get started."
          actionLabel="Create Project"
          onAction={() => setShowCreateForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => handleSelectProject(project)}
              className="p-5 bg-[#18181b] border border-[#27272a] rounded-lg hover:border-[#3f3f46] hover:bg-[#27272a] transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#27272a] rounded-md group-hover:bg-[#3f3f46] transition-colors">
                  <FolderKanban className="text-white" size={20} />
                </div>
                <h3 className="text-base font-semibold text-white">{project.name}</h3>
              </div>
              <p className="text-xs text-[#71717a]">
                Created {new Date(project.created_at).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
