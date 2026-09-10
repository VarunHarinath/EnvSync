import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar() {
  const { projectId } = useParams();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b bg-background/90 backdrop-blur flex items-center justify-between px-5 lg:px-8 sticky top-0 z-10 transition-colors">
      <div className="flex min-w-0 items-center gap-4 flex-1">
        <div className="flex min-w-0 items-center gap-2 text-sm">
           <span className="text-muted-foreground">Workspace</span>
           <span className="text-muted-foreground">/</span>
           {projectId ? (
              <span className="max-w-[300px] truncate font-medium">
                project-{projectId.split('_')[1] || projectId}
              </span>
           ) : (
             <span className="font-medium">Overview</span>
           )}
        </div>

      </div>

      <div className="flex items-center gap-1">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
