import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import { useFetch } from '../hooks/useFetch';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { Server, Lock, Key, ArrowRight } from 'lucide-react';
import Table from '../components/common/Table';

export default function ProjectDetail() {
  const { projectId } = useParams();
  
  // Fetch Project
  const fetchProject = () => projectsApi.getById(projectId);
  const { data: project, isLoading, error } = useFetch(fetchProject, [projectId]);

  if (isLoading) return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;
  if (error || !project) return <div className="p-12 text-center">Project not found.</div>;

  const quickLinks = [
    { label: 'Environments', icon: Server, to: `/projects/${projectId}/environments`, desc: 'Manage deployment environments' },
    { label: 'Secrets', icon: Lock, to: `/projects/${projectId}/secrets`, desc: 'Manage environment variables' },
    { label: 'API Keys', icon: Key, to: `/projects/${projectId}/api-keys`, desc: 'Manage access keys' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{project.name}</h1>
        <div className="text-muted-foreground text-sm flex gap-4">
            <span>ID: <code className="bg-muted px-1 py-0.5 rounded">{project.id}</code></span>
            <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickLinks.map((link) => (
          <Link 
            key={link.to} 
            to={link.to}
            className="group block p-6 bg-card border rounded-lg hover:border-primary transition-colors hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
               <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                 <link.icon className="h-6 w-6" />
               </div>
               <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold text-lg mb-1">{link.label}</h3>
            <p className="text-sm text-muted-foreground">{link.desc}</p>
          </Link>
        ))}
      </div>

      {/* Overview Stats or Recent Activity could go here */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-4">Project Overview</h3>
        <p className="text-muted-foreground">
          This project contains mocked resources. Navigate to the sections above to manage them.
        </p>
      </div>
    </div>
  );
}
