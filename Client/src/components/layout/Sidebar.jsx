import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { cn } from '../../utils';
import { 
  LayoutDashboard, 
  Server, 
  Lock, 
  Key, 
  Settings, Users, ScrollText, LogOut
} from 'lucide-react';
import { EnvSyncLogo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { projectId } = useParams();
  const { user, logout } = useAuth();

  // If we are in project context, links go to project resources.
  // If not, they might be disabled or point to project selection.
  // For this UI, we'll hide project-specific items if no project is selected,
  // OR we show them but they redirect to projects list if clicked?
  // Let's go with: Show "Projects" always. Show Resource links only if projectId is present.
  
  const isProjectContext = !!projectId;

  const navItems = [
    { 
      label: 'Projects', 
      icon: LayoutDashboard, 
      to: '/projects', 
      end: true // Exact match only for root /projects
    },
    // Context specific
    ...(isProjectContext ? [
      { 
        label: 'Environments', 
        icon: Server, 
        to: `/projects/${projectId}/environments` 
      },
      { 
        label: 'Secrets', 
        icon: Lock, 
        to: `/projects/${projectId}/secrets` 
      },
      ...(user?.role === 'ADMIN' || user?.permissions?.can_pull_secrets ? [{
        label: 'API Keys', 
        icon: Key, 
        to: `/projects/${projectId}/api-keys` 
      }] : []),
    ] : []),
    // Global
    { 
      label: 'Settings', 
      icon: Settings, 
      to: '/settings' 
    },
    ...(user?.role === 'ADMIN' ? [
      { label: 'Users', icon: Users, to: '/admin/users' },
      { label: 'Audit logs', icon: ScrollText, to: '/admin/audit-logs' },
    ] : []),
  ];

  return (
    <aside className="w-60 border-r bg-card/60 flex flex-col hidden md:flex h-screen sticky top-0 transition-colors">
      <div className="h-14 flex items-center px-5 border-b">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <EnvSyncLogo markClassName="h-7 w-7 group-hover:translate-x-0.5 transition-transform" wordmarkClassName="text-lg" />
        </NavLink>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}

        {!isProjectContext && (
           <div className="mt-8 px-4 py-4 rounded bg-muted/20 border border-dashed text-xs text-muted-foreground">
             Select a project to view its resources.
           </div>
        )}
      </nav>

      <div className="p-4 border-t bg-muted/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            {user?.full_name?.split(' ').map(x => x[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">{user?.full_name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <button title="Sign out" onClick={logout} className="ml-auto text-muted-foreground hover:text-foreground"><LogOut className="h-4 w-4" /></button>
        </div>
      </div>
    </aside>
  );
}
