import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye } from 'lucide-react';
import { projectsApi } from '../api/projects'; // Ensure this path is correct
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import EmptyState from '../components/common/EmptyState';


export default function Projects() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [iscreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Fetch Projects
  const fetchProjects = useCallback(() => projectsApi.getAll(), []);
  const { data: projects, isLoading, refetch } = useFetch(fetchProjects, []);

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

  const handleDeleteProject = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
        await projectsApi.delete(id);
        toast({ title: 'Deleted', description: 'Project deleted.' });
        refetch();
    } catch (error) {
        toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const columns = [
    { header: 'Project Name', accessorKey: 'name', className: 'font-medium' },
    { header: 'Created At', accessorKey: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
    { 
        header: 'Actions', 
        className: 'w-[100px]',
        render: (row) => (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); navigate(`/projects/${row.id}`); }}>
                    <Eye className="h-4 w-4" />
                </Button>
                 <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => handleDeleteProject(e, row.id)}>
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
        <Button onClick={() => setIsCreateModalOpen(true)}>
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
    </div>
  );
}
