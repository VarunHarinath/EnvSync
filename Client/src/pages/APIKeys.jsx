import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiKeysApi } from '../api/apiKeys';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Plus, Trash2, Key, Copy, AlertTriangle } from 'lucide-react';

export default function ApiKeys() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState(null); // If set, show success modal
  const [isCreating, setIsCreating] = useState(false);

  const fetchKeys = () => apiKeysApi.getByProject(projectId);
  const { data: apiKeys, isLoading, refetch } = useFetch(fetchKeys, [projectId]);

  const handleCreate = async () => {
    // For mock, just pass mock env ID
    setIsCreating(true);
    try {
      // In real app, we select environment. Here we just mock it.
        const res = await apiKeysApi.create(projectId, 'env_1'); 
        // Mock response should contain the full key ONCE
        const fullKey = `sk_live_${Math.random().toString(36).substr(2)}`; 
        setCreatedKey(fullKey);
        setIsModalOpen(false);
        refetch();
    } catch (e) {
        toast({ title: 'Error', variant: 'destructive' });
    } finally {
        setIsCreating(false);
    }
  };

  const handleRevoke = async (id) => {
      if (!window.confirm('Revoke this API Key? It will stop working immediately.')) return;
      try {
          await apiKeysApi.revoke(id);
          toast({ title: 'Revoked', description: 'API Key revoked.' });
          refetch();
      } catch (e) {
          toast({ title: 'Error', variant: 'destructive' });
      }
  };

  const columns = [
      { header: 'Key Prefix', accessorKey: 'key_prefix', className: 'font-mono' },
      { header: 'Environment', accessorKey: 'environment_id', render: () => 'Production' }, // Mock
      { header: 'Created', accessorKey: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
      { header: 'Status', accessorKey: 'status', render: (row) => (
          <Badge variant={row.status === 'active' ? 'success' : 'destructive'}>{row.status}</Badge>
      )},
      { header: '', render: (row) => row.status === 'active' && (
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleRevoke(row.id)}>Revoke</Button>
      )}
  ];

  if (isLoading) return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Key
        </Button>
      </div>

       <div className="rounded-md border bg-card">
         {(!apiKeys || apiKeys.length === 0) ? (
             <EmptyState
                icon={Key}
                title="No API Keys"
                description="Create an API key to access your project programmatically."
                actionLabel="Create Key"
                onAction={() => setIsModalOpen(true)}
             />
         ) : (
            <Table columns={columns} data={apiKeys} />
         )}
      </div>

      {/* Creation Modal */}
      <Modal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title="Create API Key"
         footer={
             <>
                 <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                 <Button onClick={handleCreate} isLoading={isCreating}>Create Key</Button>
             </>
         }
      >
          <p className="text-sm text-muted-foreground">
              This will create a new API key for the <strong>Production</strong> environment.
          </p>
      </Modal>

      {/* Success Modal (Show Key) */}
      <Modal
          isOpen={!!createdKey}
          onClose={() => setCreatedKey(null)}
          title="API Key Created"
          footer={<Button onClick={() => setCreatedKey(null)}>I have copied it</Button>}
      >
          <div className="space-y-4 text-center">
              <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <Key className="h-6 w-6" />
                  </div>
              </div>
              <h3 className="text-lg font-semibold">Copy your key</h3>
              <p className="text-sm text-muted-foreground">
                  This key will never be shown again.
              </p>
              <div className="flex items-center gap-2 bg-muted p-3 rounded border">
                  <code className="flex-1 font-mono text-sm break-all">{createdKey}</code>
                  <Button size="icon" variant="ghost" onClick={() => {
                      navigator.clipboard.writeText(createdKey);
                      toast({ title: 'Copied' });
                  }}>
                      <Copy className="h-4 w-4" />
                  </Button>
              </div>
               <div className="flex items-start gap-2 text-left bg-yellow-50 text-yellow-800 p-3 rounded text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <p>Store this key securely. It cannot be recovered.</p>
              </div>
          </div>
      </Modal>
    </div>
  );
}
