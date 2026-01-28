import { 
  FolderKanban, 
  Key, 
  Lock, 
  Settings,
  Play
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/environments', label: 'Environments', icon: Settings },
  { path: '/secrets', label: 'Secrets', icon: Lock },
  { path: '/apikeys', label: 'API Keys', icon: Key },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#18181b] border-r border-[#27272a] h-full">
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#27272a] text-white shadow-sm'
                    : 'text-[#a1a1aa] hover:bg-[#27272a] hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
