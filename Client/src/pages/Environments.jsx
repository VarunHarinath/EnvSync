import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { environmentsApi } from '../api/environments';
import { secretsApi } from '../api/secrets';
import { environmentSecretsApi } from '../api/environmentSecrets';
import { agentsApi } from '../api/agents';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Drawer from '../components/common/Drawer';
import Input from '../components/common/Input';
import { Plus, Trash2, Lock, Edit2, Copy, Layers3, CalendarDays, Bot } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import { cn } from '../utils';
import ShareResource from '../components/ShareResource';
import { useAuth } from '../context/AuthContext';

export default function Environments() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [newEnvName, setNewEnvName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [environmentAgents, setEnvironmentAgents] = useState([]);
  const canViewAgents = user?.role === 'ADMIN' || user?.permissions?.mcp_read;

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

  const handleUpdateEnv = async () => {
    if (!newEnvName.trim() || !selectedEnv) return;
    setIsUpdating(true);
    
    const originalEnv = { ...selectedEnv };
    const newName = newEnvName;

    // Optimistic Update
    setEnvironments(prev => prev.map(e => e.id === selectedEnv.id ? { ...e, name: newName } : e));
    setSelectedEnv(prev => ({ ...prev, name: newName }));
    setIsEditModalOpen(false);

    try {
      await environmentsApi.update(selectedEnv.id, newName);
      toast({ title: 'Updated', description: 'Environment name updated.' });
      await refetch(true);
    } catch (e) {
      // Rollback
      setEnvironments(prev => prev.map(e => e.id === originalEnv.id ? originalEnv : e));
      setSelectedEnv(originalEnv);
      toast({ title: 'Error', description: 'Failed to update environment.', variant: 'destructive' });
      setNewEnvName(newName);
      setIsEditModalOpen(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditModal = () => {
    setNewEnvName(selectedEnv.name);
    setIsEditModalOpen(true);
  };

  const handleDeleteEnv = async () => {
    if (!selectedEnv) return;
    setIsDeleting(true);
    try {
        await environmentsApi.delete(selectedEnv.id);
        toast({ title: 'Deleted', description: 'Environment deleted.' });
        setSelectedEnv(null);
        setShowDeleteConfirm(false);
        refetch();
    } catch (e) {
        toast({ title: 'Error', variant: 'destructive' });
    } finally {
        setIsDeleting(false);
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
  const [activeTab, setActiveTab] = useState('attach'); // 'attach' | 'attached'
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
          if (canViewAgents) agentsApi.environmentAgents(selectedEnv.id).then(setEnvironmentAgents).catch(() => setEnvironmentAgents([]));
      } else {
          setAttachedSecrets([]);
          setEnvironmentAgents([]);
      }
  }, [selectedEnv, canViewAgents]);

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
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div><h1 className="text-2xl font-semibold tracking-tight">Environments</h1><p className="mt-1.5 text-sm text-muted-foreground">Organize which secrets are available in each deployment stage.</p></div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New environment
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
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
                className="rounded-none border-0 shadow-none"
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
        title={
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Layers3 className="h-4 w-4"/></span>
            <span className="truncate">{selectedEnv?.name || 'Environment details'}</span>
            {selectedEnv && !String(selectedEnv.id).startsWith('temp-') && (
              <button 
                onClick={openEditModal}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="Rename environment"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
        }
      >
        {selectedEnv && (
            <div>
                <div className="border-b px-6 py-5">
                  <p className="text-sm leading-6 text-muted-foreground">Secrets attached here are available to applications scoped to this environment.</p>
                  <div className="mt-4"><ShareResource type="environment" id={selectedEnv.id} name={selectedEnv.name} /></div>
                </div>

                <section className="border-b px-6 py-6">
                    <div className="mb-4 flex items-center justify-between"><div><h4 className="text-sm font-semibold">Attached secrets</h4><p className="mt-1 text-xs text-muted-foreground">Available in this environment</p></div><span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums">{attachedSecrets.length}</span></div>
                    
                    {attachedSecrets.length > 0 ? (
                        <div className="mb-4 space-y-2">
                            {attachedSecrets.map(s => {
                                const isTemp = String(s.environment_secret_id).startsWith('temp-');
                                return (
                                <div key={s.environment_secret_id || s.secret_id} className="group flex items-center justify-between rounded-lg border bg-background px-3.5 py-3 transition-colors hover:border-primary/30">
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
                         <div className="mb-4 rounded-lg border border-dashed bg-muted/10 py-8 text-center">
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
                        <Plus className="mr-2 h-4 w-4" /> Manage secrets
                    </Button>
                </section>

                {canViewAgents && <section className="border-b px-6 py-6">
                    <div className="mb-4 flex items-center justify-between"><div><h4 className="text-sm font-semibold">Agent access</h4><p className="mt-1 text-xs text-muted-foreground">MCP agents assigned to this environment</p></div><span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums">{environmentAgents.filter(item=>!item.revoked_at).length}</span></div>
                    {environmentAgents.length ? <div className="space-y-2">{environmentAgents.map(agent=><div key={agent.id} className="flex items-center gap-3 rounded-lg border bg-background p-3"><span className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary"><Bot className="h-4 w-4"/></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{agent.display_name||agent.client_name}</p><p className="text-xs text-muted-foreground">{agent.access_level.replace('_',' + ')} · {agent.revoked_at?'Revoked':agent.expires_at?`Expires ${new Date(agent.expires_at).toLocaleString()}`:'Until revoked'}</p></div><span className={cn("h-2 w-2 rounded-full",agent.status==='APPROVED'&&!agent.revoked_at?'bg-emerald-500':'bg-muted-foreground')}/></div>)}</div>:<div className="rounded-lg border border-dashed py-7 text-center"><Bot className="mx-auto h-6 w-6 text-muted-foreground/40"/><p className="mt-2 text-sm text-muted-foreground">No agents have access.</p></div>}
                </section>}

                <section className="border-b px-6 py-6">
                    <h4 className="mb-4 text-sm font-semibold">Details</h4>
                    <dl className="space-y-4 text-sm">
                      <div className="flex items-start gap-3"><Copy className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"/><div className="min-w-0 flex-1"><dt className="text-xs text-muted-foreground">Environment ID</dt><dd className="mt-1 flex items-center gap-2"><code className="truncate font-mono text-xs">{selectedEnv.id}</code><button onClick={() => navigator.clipboard?.writeText(selectedEnv.id)} title="Copy environment ID" className="shrink-0 text-muted-foreground hover:text-foreground"><Copy className="h-3.5 w-3.5"/></button></dd></div></div>
                      <div className="flex items-start gap-3"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"/><div><dt className="text-xs text-muted-foreground">Created</dt><dd className="mt-1">{new Date(selectedEnv.created_at).toLocaleString()}</dd></div></div>
                    </dl>
                </section>
                
                 <div className="px-6 py-5">
                    <Button 
                      variant="ghost" 
                      className="justify-start px-3 text-destructive hover:bg-destructive/10"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
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
              <div className="flex border-b">
                  <button 
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'attach' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setActiveTab('attach')}
                  >
                      Attach Secrets
                  </button>
                  <button 
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'attached' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setActiveTab('attached')}
                  >
                      Attached ({attachedSecrets.length})
                  </button>
              </div>

              {activeTab === 'attach' ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Available secrets to attach to <strong>{selectedEnv?.name}</strong>.</p>
                  
                  {projectSecrets.filter(s => !attachedSecrets.some(as => as.secret_id === s.id)).length === 0 ? (
                      <div className="text-center py-8 border rounded-md border-dashed">
                          <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                          <p className="text-sm text-muted-foreground">All secrets are already attached or none available.</p>
                      </div>
                  ) : (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {projectSecrets.filter(s => !attachedSecrets.some(as => as.secret_id === s.id)).map(secret => (
                            <div key={secret.id} className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/50 transition-colors">
                                <div className="flex flex-col">
                                    <span className="font-mono text-sm font-medium">{secret.name}</span>
                                    <span className="text-[10px] text-muted-foreground">Global Project Secret</span>
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    onClick={() => handleAttachSecret(secret.id)}
                                    disabled={isSyncingSecrets}
                                    className="h-8 text-xs"
                                >
                                    Attach
                                </Button>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                   <p className="text-sm text-muted-foreground">Secrets currently attached to <strong>{selectedEnv?.name}</strong>.</p>
                   {attachedSecrets.length === 0 ? (
                       <div className="text-center py-8 border rounded-md border-dashed">
                           <p className="text-sm text-muted-foreground">No secrets attached yet.</p>
                       </div>
                   ) : (
                       <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                           {attachedSecrets.map(attachment => (
                               <div key={attachment.environment_secret_id} className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/50 transition-colors">
                                   <div className="flex flex-col">
                                       <span className="font-mono text-sm font-medium">{attachment.secret_name}</span>
                                       <span className="text-[10px] text-muted-foreground">Attached Secret</span>
                                   </div>
                                   <Button 
                                       size="sm" 
                                       variant="ghost" 
                                       className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                                       onClick={() => handleRemoveSecret(attachment.environment_secret_id)}
                                       disabled={isSyncingSecrets}
                                   >
                                       Detach
                                   </Button>
                               </div>
                           ))}
                       </div>
                   )}
                </div>
              )}
          </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Rename Environment"
        footer={
           <>
             <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
             <Button onClick={handleUpdateEnv} isLoading={isUpdating}>Save Changes</Button>
           </>
        }
      >
        <div className="space-y-4">
            <label className="text-sm font-medium">New Environment Name</label>
            <Input 
                placeholder="e.g. Production"
                value={newEnvName}
                onChange={(e) => setNewEnvName(e.target.value)} 
                autoFocus
            />
        </div>
      </Modal>

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteEnv}
        title="Delete Environment"
        description={`This will permanently delete the environment "${selectedEnv?.name}" and detach all its secrets.`}
        requiredText={selectedEnv?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
