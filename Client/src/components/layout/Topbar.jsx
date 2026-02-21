import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';

export default function Topbar() {
  // Use projectId to mock the "Current Project" display.
  // In a real app we'd fetch project details.
  const { projectId } = useParams();

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        {/* Breadcrumb / Project Switcher Placeholder */}
        <div className="flex items-center gap-2 text-sm">
           <span className="text-muted-foreground">Workspace</span>
           <span className="text-muted-foreground">/</span>
           {projectId ? (
              <span className="font-medium flex items-center gap-2 bg-muted/40 px-2 py-1 rounded">
                project-{projectId.split('_')[1] || projectId}
              </span>
           ) : (
             <span className="font-medium">Overview</span>
           )}
        </div>

        {/* Global Search */}
        <div className="w-full max-w-sm ml-4">
           <div className="relative">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
                className="pl-9 h-9 bg-muted/20 border-transparent focus:bg-background focus:border-input" 
                placeholder="Search projects, secrets..." 
             />
           </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
        </button>
        {/* Placeholder for user menu or quick actions */}
      </div>
    </header>
  );
}
