import React from 'react';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';

export default function AuditLogs() {
  // Mock data
  const logs = [
    { id: 1, action: 'CREATE_PROJECT', actor: 'john.doe@envsync.com', resource: 'Project: Beta App', status: 'success', timestamp: new Date().toISOString() },
    { id: 2, action: 'VIEW_SECRET', actor: 'jane.smith@envsync.com', resource: 'Secret: STRIPE_KEY', status: 'success', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, action: 'DELETE_ENV', actor: 'john.doe@envsync.com', resource: 'Env: Staging', status: 'failure', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 4, action: 'CREATE_KEY', actor: 'system', resource: 'API Key: sk_live_...', status: 'success', timestamp: new Date(Date.now() - 86400000).toISOString() },
  ];

  const columns = [
    { header: 'Timestamp', accessorKey: 'timestamp', render: (row) => new Date(row.timestamp).toLocaleString() },
    { header: 'Action', accessorKey: 'action', className: 'font-medium' },
    { header: 'Actor', accessorKey: 'actor' },
    { header: 'Resource', accessorKey: 'resource' },
    { header: 'Status', accessorKey: 'status', render: (row) => (
        <Badge variant={row.status === 'success' ? 'success' : 'destructive'}>{row.status}</Badge>
    )}
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">Track all activity within your organization.</p>
      </div>

      <div className="rounded-md border bg-card">
         <Table columns={columns} data={logs} />
      </div>
    </div>
  );
}
