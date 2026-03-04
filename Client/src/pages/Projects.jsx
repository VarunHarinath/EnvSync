import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, Edit2 } from 'lucide-react';
import { projectsApi } from '../api/projects'; // Ensure this path is correct
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import EmptyState from '../components/common/EmptyState';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';


export default function Projects() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [iscreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Fetch Projects
  const fetchProjects = useCallback(() => projectsApi.getAll(), []);
  const { data, isLoading, refetch } = useFetch(fetchProjects, []);
  const projects = data || [];

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    setIsCreating(true);
    try {
        await projectsApi.create(newProjectName);
        toast({ title: 'Success', description: 'Project created successfully.' });
        setIsCreateModalOpen(false);
        setNewProjectName('');
        refetch();
    } catch (error) {
        toast({ title: 'Error', description: 'Failed to create project.', variant: 'destructive' });
    } finally {
        setIsCreating(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!newProjectName.trim() || !editingProject) return;
    setIsUpdating(true);
    try {
        await projectsApi.update(editingProject.id, newProjectName);
        toast({ title: 'Updated', description: 'Project name updated.' });
        setIsEditModalOpen(false);
        setNewProjectName('');
        setEditingProject(null);
        refetch();
    } catch (error) {
        toast({ title: 'Error', description: 'Failed to update project.', variant: 'destructive' });
    } finally {
        setIsUpdating(false);
    }
  };

  const openEditModal = (e, project) => {
    e.stopPropagation();
    setEditingProject(project);
    setNewProjectName(project.name);
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
        await projectsApi.delete(projectToDelete.id);
        toast({ title: 'Deleted', description: 'Project deleted.' });
        setProjectToDelete(null);
        refetch();
    } catch (error) {
        toast({ title: 'Error', variant: 'destructive' });
    } finally {
        setIsDeleting(false);
    }
  };

  const columns = [
    { header: 'Project Name', accessorKey: 'name', className: 'font-medium' },
    { header: 'Created At', accessorKey: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
    { 
        header: 'Actions', 
        className: 'w-[120px]',
        render: (row) => (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); navigate(`/projects/${row.id}`); }}>
                    <Eye className="h-4 w-4" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => openEditModal(e, row)}
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-950/30"
                >
                    <Edit2 className="h-4 w-4" />
                </Button>
                 <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); setProjectToDelete(row); }}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <Button onClick={() => { setNewProjectName(''); setIsCreateModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="rounded-md border bg-card">
         <Table 
            columns={columns} 
            data={projects} 
            isLoading={isLoading} 
            onRowClick={(row) => navigate(`/projects/${row.id}`)}
         />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={iscreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
        footer={
            <>
                <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateProject} isLoading={isCreating}>Create Project</Button>
            </>
        }
      >
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <Input 
                    placeholder="e.g. My Awesome App" 
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    autoFocus
                />
            </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Rename Project"
        footer={
            <>
                <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateProject} isLoading={isUpdating}>Save Changes</Button>
            </>
        }
      >
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">New Project Name</label>
                <Input 
                    placeholder="e.g. My Awesome App" 
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    autoFocus
                />
            </div>
        </div>
      </Modal>

      <DeleteConfirmationModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        description={`This will permanently delete the project "${projectToDelete?.name}" and all its environments and secrets.`}
        requiredText={projectToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
