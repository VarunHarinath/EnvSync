import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { environmentsApi } from '../api/environments';
import { secretsApi } from '../api/secrets';
import { environmentSecretsApi } from '../api/environmentSecrets';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Drawer from '../components/common/Drawer';
import Input from '../components/common/Input';
import { Plus, Trash2, Lock } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { cn } from '../utils';

export default function Environments() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [newEnvName, setNewEnvName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Fetch Envs
  const fetchEnvs = () => environmentsApi.getByProject(projectId);
  const { data: environments, setData: setEnvironments, isLoading, refetch } = useFetch(fetchEnvs, [projectId]);

  const handleCreateEnv = async () => {
    if (!newEnvName.trim()) return;
    setIsCreating(true);
    
    // Optimistic Update
    const optimisticEnv = {
        id: 'temp-' + Date.now(),
        name: newEnvName,
        project_id: projectId,
        created_at: new Date().toISOString(),
        secrets_count: 0
    };
    
    setEnvironments(prev => [...(prev || []), optimisticEnv]);
    setIsCreateModalOpen(false);
    setNewEnvName('');

    try {
      await environmentsApi.create(projectId, newEnvName);
      toast({ title: 'Success', description: 'Environment created.' });
      await refetch(true); // Silent refetch
    } catch (e) {
      setEnvironments(prev => prev.filter(e => e.id !== optimisticEnv.id)); // Rollback
      toast({ title: 'Error', description: 'Failed to create environment.', variant: 'destructive' });
      setNewEnvName(optimisticEnv.name);
      setIsCreateModalOpen(true);
    } finally {
      setIsCreating(false);
    }
  };

  const columns = [
    { header: 'Environment', accessorKey: 'name', className: 'font-medium' },
    { 
        header: 'Secrets', 
        render: (row) => (
            <span className="text-xs bg-muted px-2 py-1 rounded-full font-medium">
                {Number(row.secrets_count) || 0} attached
            </span>
        )
    },
    { header: 'Created At', accessorKey: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  // Manage Secrets Logic
  const [isManageSecretsOpen, setIsManageSecretsOpen] = useState(false);
  const [projectSecrets, setProjectSecrets] = useState([]);
  const [attachedSecrets, setAttachedSecrets] = useState([]); 
  const [isSyncingSecrets, setIsSyncingSecrets] = useState(false);

  // Fetch secrets for the drawer/modal
  const fetchSecretsData = async () => {
    if (!selectedEnv) return;
    try {
        const [projSecrets, envSecrets] = await Promise.all([
            secretsApi.getByProject(projectId),
            environmentSecretsApi.getByEnvironmentId(selectedEnv.id)
        ]);

        setProjectSecrets(projSecrets || []);
        setAttachedSecrets(envSecrets || []);
    } catch (e) {
        console.error("Failed to fetch secrets", e);
    }
  };

  // Effect to fetch attached secrets when detail drawer opens
  React.useEffect(() => {
      if (selectedEnv && !String(selectedEnv.id).startsWith('temp-')) {
          fetchSecretsData();
      } else {
          setAttachedSecrets([]);
      }
  }, [selectedEnv]);

  const handleOpenManageSecrets = () => {
      fetchSecretsData(); 
      setIsManageSecretsOpen(true);
  };

  const handleAttachSecret = async (secretId) => {
      if (!selectedEnv || !environments || isSyncingSecrets) return;
      
      const secretToAttach = projectSecrets.find(s => s.id === secretId);
      if (!secretToAttach) return;

      setIsSyncingSecrets(true);

      // Optimistic Update: Secrets list
      const tempId = 'temp-' + Date.now();
      setAttachedSecrets(prev => [...prev, {
          environment_secret_id: tempId,
          environment_id: selectedEnv.id,
          secret_id: secretId,
          secret_name: secretToAttach.name,
          value: secretToAttach.value
      }]);

      // Optimistic Update: Counter
      setEnvironments(prev => prev.map(e => 
          e.id === selectedEnv.id 
          ? { ...e, secrets_count: (Number(e.secrets_count) || 0) + 1 }
          : e
      ));

      try {
          await environmentSecretsApi.create(selectedEnv.id, secretId);
          await Promise.all([
             fetchSecretsData(),
             refetch(true)
          ]);
          toast({ title: 'Success', description: 'Secret attached.' });
      } catch (e) {
          // Rollback
          setAttachedSecrets(prev => prev.filter(as => as.environment_secret_id !== tempId));
          setEnvironments(prev => prev.map(e => 
              e.id === selectedEnv.id 
              ? { ...e, secrets_count: Math.max(0, (Number(e.secrets_count) || 0) - 1) }
              : e
          ));
          toast({ title: 'Error', description: e.message || 'Failed to attach secret.', variant: 'destructive' });
      } finally {
          setIsSyncingSecrets(false);
      }
  };

  const handleRemoveSecret = async (attachmentId) => {
      if (!attachmentId || !environments || isSyncingSecrets) return;
      if (String(attachmentId).startsWith('temp-')) return; // Wait for sync

      setIsSyncingSecrets(true);

      const previousAttached = [...attachedSecrets];
      const removedAttachment = previousAttached.find(as => as.environment_secret_id === attachmentId);

      // Optimistic Update: Secrets list
      setAttachedSecrets(prev => prev.filter(as => as.environment_secret_id !== attachmentId));

      // Optimistic Update: Counter
      setEnvironments(prev => prev.map(e => 
          e.id === selectedEnv.id 
          ? { ...e, secrets_count: Math.max(0, (Number(e.secrets_count) || 0) - 1) }
          : e
      ));

      try {
          await environmentSecretsApi.remove(attachmentId);
          await Promise.all([
             fetchSecretsData(),
             refetch(true)
          ]);
          toast({ title: 'Success', description: 'Secret detached.' });
      } catch (e) {
          // Rollback
          setAttachedSecrets(previousAttached);
          setEnvironments(prev => prev.map(e => 
              e.id === selectedEnv.id 
              ? { ...e, secrets_count: (Number(e.secrets_count) || 0) + 1 }
              : e
          ));
          toast({ title: 'Error', description: 'Failed to detach secret.', variant: 'destructive' });
      } finally {
          setIsSyncingSecrets(false);
      }
  };

  if (isLoading) return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Environments</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Environment
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        {(!environments || environments.length === 0) ? (
            <EmptyState 
                title="No environments found" 
                description="Create an environment to get started." 
                actionLabel="Create Environment"
                onAction={() => setIsCreateModalOpen(true)}
            />
        ) : (
            <Table 
                columns={columns} 
                data={environments} 
                onRowClick={(row) => setSelectedEnv(row)}
            />
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="New Environment"
        footer={
           <>
             <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
             <Button onClick={handleCreateEnv} isLoading={isCreating}>Create</Button>
           </>
        }
      >
        <div className="space-y-4">
            <label className="text-sm font-medium">Environment Name</label>
            <Input 
                placeholder="e.g. Production"
                value={newEnvName}
                onChange={(e) => setNewEnvName(e.target.value)} 
                autoFocus
            />
        </div>
      </Modal>

      {/* Detail Drawer */}
      <Drawer
        isOpen={!!selectedEnv}
        onClose={() => setSelectedEnv(null)}
        title={selectedEnv?.name || 'Environment Details'}
      >
        {selectedEnv && (
            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Metadata</h4>
                    <div className="bg-muted/30 p-4 rounded-md space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ID:</span>
                            <code className="font-mono">{selectedEnv.id}</code>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Created:</span>
                            <span>{new Date(selectedEnv.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Attached Secrets</h4>
                        <span className="text-xs font-medium bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{attachedSecrets.length}</span>
                    </div>
                    
                    {attachedSecrets.length > 0 ? (
                        <div className="space-y-2 mb-4">
                            {attachedSecrets.map(s => {
                                const isTemp = String(s.environment_secret_id).startsWith('temp-');
                                return (
                                <div key={s.environment_secret_id || s.secret_id} className="p-3 bg-card border rounded-md flex justify-between items-center group transition-all hover:border-muted-foreground/20">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-2 w-2 rounded-full", isTemp ? "bg-yellow-500 animate-pulse" : "bg-green-500")} />
                                        <span className="font-mono text-sm font-medium">{s.secret_name}</span>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className={cn(
                                            "h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-opacity",
                                            isTemp ? "opacity-30 cursor-not-allowed" : "opacity-0 group-hover:opacity-100"
                                        )}
                                        onClick={() => handleRemoveSecret(s.environment_secret_id)}
                                        disabled={isTemp || isSyncingSecrets}
                                        title={isTemp ? "Syncing..." : "Detach"}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                );
                            })}
                        </div>
                    ) : (
                         <div className="text-center py-8 border rounded-md border-dashed mb-4 bg-muted/10">
                            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                            <p className="text-sm text-muted-foreground">No secrets attached.</p>
                        </div>
                    )}
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={handleOpenManageSecrets}
                        disabled={String(selectedEnv.id).startsWith('temp-')}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Management Secrets
                    </Button>
                </div>
                
                 <div className="pt-4 border-t">
                    <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Environment
                    </Button>
                </div>
            </div>
        )}
      </Drawer>

      {/* Manage Secrets Modal */}
      <Modal
        isOpen={isManageSecretsOpen}
        onClose={() => setIsManageSecretsOpen(false)}
        title="Manage Secrets"
        footer={<Button variant="ghost" onClick={() => setIsManageSecretsOpen(false)}>Done</Button>}
      >
          <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Attach project secrets to <strong>{selectedEnv?.name}</strong> to make them available in the environment.</p>
              
              {projectSecrets.length === 0 ? (
                  <div className="text-center py-8 border rounded-md border-dashed">
                      <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">No secrets in this project.</p>
                      <Button variant="link" size="sm" onClick={() => window.location.href=`/project/${projectId}/secrets`}>Go to Secrets</Button>
                  </div>
              ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {projectSecrets.map(secret => {
                        // Check if secret is already attached
                        const attachment = attachedSecrets.find(as => as.secret_id === secret.id);
                        const isAttached = !!attachment;
                        const isTemp = isAttached && String(attachment.environment_secret_id).startsWith('temp-');
                        
                        return (
                        <div key={secret.id} className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/50 transition-colors">
                            <div className="flex flex-col">
                                <span className="font-mono text-sm font-medium">{secret.name}</span>
                                <span className="text-[10px] text-muted-foreground">Global Project Secret</span>
                            </div>
                            {isAttached ? (
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "flex items-center gap-1.5 px-2 py-1 rounded-full border shadow-sm",
                                        isTemp ? "bg-yellow-50 text-yellow-700 border-yellow-100" : "bg-green-50 text-green-700 border-green-100"
                                    )}>
                                        <div className={cn("h-1.5 w-1.5 rounded-full", isTemp ? "bg-yellow-500 animate-pulse" : "bg-green-500")} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{isTemp ? "Syncing..." : "Attached"}</span>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleRemoveSecret(attachment.environment_secret_id)}
                                        disabled={isTemp || isSyncingSecrets}
                                    >
                                        Detach
                                    </Button>
                                </div>
                            ) : (
                                <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    onClick={() => handleAttachSecret(secret.id)}
                                    disabled={isSyncingSecrets}
                                    className="h-8 text-xs"
                                >
                                    Attach
                                </Button>
                            )}
                        </div>
                        );
                    })}
                  </div>
              )}
          </div>
      </Modal>
    </div>
  );
}

