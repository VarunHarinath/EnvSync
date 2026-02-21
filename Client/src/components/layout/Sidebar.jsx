import React from 'react';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import { cn } from '../../utils';
import { 
  LayoutDashboard, 
  Server, 
  Lock, 
  Key, 
  Settings, 
  FileText, 
  Hexagon 
} from 'lucide-react';

export default function Sidebar() {
  const { projectId } = useParams();
  const location = useLocation();

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
      { 
        label: 'API Keys', 
        icon: Key, 
        to: `/projects/${projectId}/api-keys` 
      },
    ] : []),
    // Global
    { 
      label: 'Audit Logs', 
      icon: FileText, 
      to: '/audit-logs' 
    },
    { 
      label: 'Settings', 
      icon: Settings, 
      to: '/settings' 
    },
  ];

  return (
    <aside className="w-64 border-r bg-card flex flex-col hidden md:flex h-screen sticky top-0">
      <div className="h-14 flex items-center px-6 border-b">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Hexagon className="h-6 w-6 font-bold" />
          <span>EnvSync</span>
        </NavLink>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
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

      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            JD
          </div>
          <div className="text-sm">
            <p className="font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">admin@envsync.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
