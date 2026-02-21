import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { secretsApi } from '../api/secrets';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Plus, Eye, EyeOff, Copy, Trash2, Lock } from 'lucide-react';

const SecretValue = ({ value }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast({ title: 'Copied', description: 'Secret copied to clipboard.' });
  };

  return (
    <div className="flex items-center gap-2 group">
      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
        {isVisible ? value : '••••••••••••••••'}
      </code>
      <button onClick={() => setIsVisible(!isVisible)} className="text-muted-foreground hover:text-foreground">
        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
};

export default function Secrets() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', value: '' });
  const [isCreating, setIsCreating] = useState(false);

  // Fetch
  const fetchSecrets = () => secretsApi.getByProject(projectId);
  const { data, isLoading, refetch } = useFetch(fetchSecrets, [projectId]);
  const secrets = data || [];

  const handleCreate = async () => {
    if (!form.name || !form.value) return;
    setIsCreating(true);
    try {
      await secretsApi.create(projectId, form.name, form.value);
      toast({ title: 'Success', description: 'Secret created.' });
      setIsModalOpen(false);
      setForm({ name: '', value: '' });
      refetch();
    } catch (e) {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this secret?')) return;
    try {
        await secretsApi.delete(id);
        toast({ title: 'Deleted', description: 'Secret deleted.' });
        refetch();
    } catch (e) {
        toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const columns = [
    { header: 'Key', accessorKey: 'name', className: 'font-medium font-mono text-xs' },
    { header: 'Value', render: (row) => <SecretValue value={row.value || '******'} /> },
    { header: 'Updated', accessorKey: 'updated_at', render: (row) => new Date(row.updated_at).toLocaleDateString() },
    { 
        header: '', 
        className: 'w-[50px]',
        render: (row) => (
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(row.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        )
    }
  ];

  if (isLoading) return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Secrets</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Secret
        </Button>
      </div>

      <div className="rounded-md border bg-card">
         {secrets.length === 0 ? (
             <EmptyState
                icon={Lock}
                title="No secrets yet"
                description="Securely store environment variables."
                actionLabel="Add Secret"
                onAction={() => setIsModalOpen(true)}
             />
         ) : (
            <Table columns={columns} data={secrets} />
         )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Secret"
        footer={
           <>
             <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
             <Button onClick={handleCreate} isLoading={isCreating}>Add Secret</Button>
           </>
        }
      >
        <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-medium">Key Name</label>
                <Input 
                    placeholder="e.g. DATABASE_URL" 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value.toUpperCase()})}
                    autoFocus
                />
                <p className="text-xs text-muted-foreground">Constants are usually UPPERCASE.</p>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input 
                    placeholder="Value..." 
                    type="password"
                    value={form.value}
                    onChange={(e) => setForm({...form, value: e.target.value})}
                />
             </div>
        </div>
      </Modal>
    </div>
  );
}
