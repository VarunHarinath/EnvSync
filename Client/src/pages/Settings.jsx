import React from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function Settings() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and organization preferences.</p>
      </div>

      <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-card space-y-4">
              <h3 className="text-lg font-medium">Profile</h3>
              <div className="grid gap-4">
                  <div className="grid gap-2">
                      <label className="text-sm font-medium">Display Name</label>
                      <Input defaultValue="John Doe" />
                  </div>
                  <div className="grid gap-2">
                       <label className="text-sm font-medium">Email</label>
                      <Input defaultValue="admin@envsync.com" disabled />
                  </div>
              </div>
              <Button>Save Changes</Button>
          </div>

          <div className="p-6 border rounded-lg bg-card space-y-4">
               <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
               <p className="text-sm text-muted-foreground">
                   Irreversible actions.
               </p>
               <Button variant="destructive" size="sm">Delete Organization</Button>
          </div>
      </div>
    </div>
  );
}
