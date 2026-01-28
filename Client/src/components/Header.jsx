import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { getActiveProject, clearActiveProject } from '../utils/storage.js';
import { useProjects } from '../hooks/useProjects.js';
import { setActiveProject } from '../utils/storage.js';

export const Header = ({ onProjectChange }) => {
  const [activeProject, setActiveProjectState] = useState(getActiveProject());
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { data: projects = [], isLoading } = useProjects();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const project = getActiveProject();
    setActiveProjectState(project);
    onProjectChange?.(project);
  }, [onProjectChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProjectSelect = (project) => {
    setActiveProject(project.id, project.name);
    setActiveProjectState({ id: project.id, name: project.name });
    setShowDropdown(false);
    onProjectChange?.({ id: project.id, name: project.name });
    // Invalidate related caches when project changes
    queryClient.invalidateQueries({ queryKey: ['environments'] });
    queryClient.invalidateQueries({ queryKey: ['secrets'] });
    queryClient.invalidateQueries({ queryKey: ['environment-secrets'] });
    navigate('/environments');
  };

  const handleClearProject = () => {
    clearActiveProject();
    setActiveProjectState(null);
    setShowDropdown(false);
    onProjectChange?.(null);
    // Invalidate related caches when project is cleared
    queryClient.invalidateQueries({ queryKey: ['environments'] });
    queryClient.invalidateQueries({ queryKey: ['secrets'] });
    queryClient.invalidateQueries({ queryKey: ['environment-secrets'] });
    navigate('/projects');
  };

  return (
    <header className="bg-[#18181b] border-b border-[#27272a] px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-semibold text-white">EnvSync</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] rounded-md text-sm font-medium text-white transition-colors"
          >
            {activeProject ? (
              <>
                <span>{activeProject.name}</span>
                <ChevronDown size={14} />
              </>
            ) : (
              <>
                <span className="text-[#a1a1aa]">Select Project</span>
                <ChevronDown size={14} />
              </>
            )}
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#27272a] border border-[#3f3f46] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-sm text-[#a1a1aa]">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="p-4 text-sm text-[#a1a1aa]">No projects found</div>
              ) : (
                <>
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-[#3f3f46] text-sm transition-colors ${
                        activeProject?.id === project.id ? 'bg-[#3f3f46] text-white' : 'text-[#e4e4e7]'
                      }`}
                    >
                      {project.name}
                    </button>
                  ))}
                  <div className="border-t border-[#3f3f46]">
                    <button
                      onClick={handleClearProject}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#3f3f46] text-sm text-[#a1a1aa] transition-colors"
                    >
                      Clear Selection
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
