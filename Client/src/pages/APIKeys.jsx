import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { environmentsApi } from '../api/environments';
import { apiKeysApi } from '../api/apiKeys';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import { Plus, Trash2, Key, Copy, AlertTriangle } from 'lucide-react';
import { cn } from '../utils';

// Helper to generate a random key
const generateKey = () => {
  const bytes = new Uint8Array(24);
  window.crypto.getRandomValues(bytes);
  const raw = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `sk_live_${raw}`;
};

// Helper to hash a key
const hashKey = async (key) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const PillSelector = ({ options, selectedId, onChange }) => {
  if (!options || options.length === 0) return null;
  
  return (
    <div className="relative w-full max-h-[220px] overflow-y-auto pr-2 custom-scrollbar bg-muted/30 rounded-2xl p-1.5 border border-muted-foreground/5 space-y-1">
      {options.map((option) => {
        const isActive = selectedId === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "relative w-full py-2.5 px-4 text-sm font-semibold transition-all duration-300 rounded-xl text-left flex items-center justify-between group",
              isActive 
                ? "bg-background text-primary shadow-md shadow-primary/5 ring-1 ring-primary/10" 
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
               <div className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-300",
                  isActive ? "bg-primary scale-110" : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
               )} />
               <span className="truncate">{option.name}</span>
            </div>
            {isActive && (
              <div className="h-4 w-1 bg-primary rounded-full animate-in slide-in-from-right-1 duration-300" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default function ApiKeys() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState(null); 
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEnvId, setSelectedEnvId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState(null);

  const fetchKeys = () => apiKeysApi.getByProject(projectId);
  const { data: apiKeys, isLoading, refetch } = useFetch(fetchKeys, [projectId]);

  const fetchEnvs = () => environmentsApi.getByProject(projectId);
  const { data: environments } = useFetch(fetchEnvs, [projectId]);

  React.useEffect(() => {
    if (environments && environments.length > 0 && !selectedEnvId) {
      setSelectedEnvId(environments[0].id);
    }
  }, [environments, selectedEnvId]);

  const handleCreate = async () => {
    if (!selectedEnvId) {
      toast({ title: 'Error', description: 'Please select an environment.', variant: 'destructive' });
      return;
    }
    setIsCreating(true);
    try {
        const fullKey = generateKey();
        const prefix = fullKey.substring(0, 7); // sk_live
        const hash = await hashKey(fullKey);

        await apiKeysApi.create(projectId, selectedEnvId, hash, prefix); 
        
        setCreatedKey(fullKey);
        setIsModalOpen(false);
        refetch();
    } catch (e) {
        toast({ title: 'Error', description: e.message || 'Failed to create key.', variant: 'destructive' });
    } finally {
        setIsCreating(false);
    }
  };

  const handleRevoke = async () => {
      if (!keyToRevoke) return;
      setIsDeleting(true);
      try {
          await apiKeysApi.revoke(keyToRevoke.id);
          toast({ title: 'Revoked', description: 'API Key revoked.' });
          setKeyToRevoke(null);
          refetch();
      } catch (e) {
          toast({ title: 'Error', variant: 'destructive' });
      } finally {
          setIsDeleting(false);
      }
  };

  const columns = [
      { header: 'Key Prefix', accessorKey: 'key_prefix', className: 'font-mono' },
      { header: 'Environment', accessorKey: 'environment_name' }, 
      { header: 'Created', accessorKey: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
      { header: 'Status', accessorKey: 'status', render: (row) => (
          <Badge variant={row.status === 'active' ? 'success' : 'destructive'}>{row.status}</Badge>
      )},
      { header: '', render: (row) => row.status === 'active' && (
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setKeyToRevoke(row)}>Revoke</Button>
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
          <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                  Create a new API key to access environment secrets programmatically.
              </p>
              <div className="space-y-3 pt-2">
                  <label className="text-base font-medium px-1">Choose Environment</label>
                  <PillSelector 
                    options={environments || []}
                    selectedId={selectedEnvId}
                    onChange={setSelectedEnvId}
                  />
              </div>
          </div>
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

      <DeleteConfirmationModal
        isOpen={!!keyToRevoke}
        onClose={() => setKeyToRevoke(null)}
        onConfirm={handleRevoke}
        title="Revoke API Key"
        description="This key will stop working immediately. This action cannot be undone."
        requiredText="REVOKE"
        confirmLabel="Revoke Key"
        isLoading={isDeleting}
      />
    </div>
  );
}
