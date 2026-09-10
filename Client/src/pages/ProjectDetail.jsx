import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Copy, KeyRound, Layers3, LockKeyhole, Plus, Server, Sparkles } from 'lucide-react';
import { projectsApi } from '../api/projects';
import { environmentsApi } from '../api/environments';
import { secretsApi } from '../api/secrets';
import { apiKeysApi } from '../api/apiKeys';
import { useFetch } from '../hooks/useFetch';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ShareResource from '../components/ShareResource';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const canUseSdk = user?.role === 'ADMIN' || user?.permissions?.can_pull_secrets;
  const fetchDashboard = async () => {
    const [project, environments, secrets, apiKeys] = await Promise.all([
      projectsApi.getById(projectId), environmentsApi.getByProject(projectId), secretsApi.getByProject(projectId), canUseSdk ? apiKeysApi.getByProject(projectId) : Promise.resolve([]),
    ]);
    return { project, environments, secrets, apiKeys };
  };
  const { data, isLoading, error } = useFetch(fetchDashboard, [projectId, canUseSdk]);

  if (isLoading) return <div className="grid min-h-[55vh] place-items-center"><LoadingSpinner size="lg" /></div>;
  if (error || !data?.project) return <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">Project not found.</div>;

  const { project, environments = [], secrets = [], apiKeys = [] } = data;
  const activeKeys = apiKeys.filter(key => key.active && !key.revoked_at).length;
  const maxAttached = Math.max(1, ...environments.map(env => Number(env.secrets_count) || 0));
  const recent = [...secrets.map(item => ({ ...item, kind: 'Secret' })), ...environments.map(item => ({ ...item, kind: 'Environment' }))]
    .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)).slice(0, 5);
  const stats = [
    { label: 'Environments', value: environments.length, icon: Layers3, to: `/projects/${projectId}/environments`, detail: 'deployment stages' },
    { label: 'Secrets', value: secrets.length, icon: LockKeyhole, to: `/projects/${projectId}/secrets`, detail: 'encrypted values' },
    ...(canUseSdk ? [{ label: 'Active API keys', value: activeKeys, icon: KeyRound, to: `/projects/${projectId}/api-keys`, detail: `${apiKeys.length} total keys` }] : []),
  ];

  return <div className="space-y-8 pb-10">
    <section className="relative overflow-hidden rounded-2xl border bg-card px-6 py-7 shadow-sm sm:px-8">
      <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div className="min-w-0"><div className="mb-3 flex items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>Active</span><span className="text-xs text-muted-foreground">Created {new Date(project.created_at).toLocaleDateString()}</span></div><h1 className="truncate text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{project.description || 'Securely manage environments, encrypted secrets, and application access for this project.'}</p><button onClick={() => navigator.clipboard?.writeText(project.id)} className="mt-4 inline-flex max-w-full items-center gap-2 rounded-md bg-muted/50 px-2.5 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"><span className="truncate">{project.id}</span><Copy className="h-3.5 w-3.5 shrink-0"/></button></div>
        <ShareResource type="project" id={project.id} name={project.name} />
      </div>
    </section>

    <section className={`grid gap-4 ${stats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
      {stats.map(({ label, value, icon: Icon, to, detail }) => <Link key={label} to={to} className="group rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"><div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5"/></span><ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"/></div><div className="mt-5 flex items-end justify-between"><div><p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p><p className="mt-1 text-sm font-medium">{label}</p></div><p className="pb-0.5 text-xs text-muted-foreground">{detail}</p></div></Link>)}
    </section>

    <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm"><div className="flex items-center justify-between border-b px-5 py-4"><div><h2 className="text-sm font-semibold">Environment coverage</h2><p className="mt-1 text-xs text-muted-foreground">Secrets attached to each deployment stage</p></div><Link to={`/projects/${projectId}/environments`} className="text-xs font-medium text-primary hover:underline">Manage</Link></div>
        {environments.length ? <div className="divide-y">{environments.slice(0, 6).map(env => { const count = Number(env.secrets_count) || 0; return <Link key={env.id} to={`/projects/${projectId}/environments`} className="group grid grid-cols-[minmax(100px,1fr)_2fr_auto] items-center gap-4 px-5 py-4 hover:bg-muted/25"><div><p className="truncate text-sm font-medium">{env.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{count} {count === 1 ? 'secret' : 'secrets'}</p></div><div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{width: `${Math.max(count ? 8 : 0, count / maxAttached * 100)}%`}}/></div><ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground"/></Link>})}</div> : <div className="grid place-items-center px-6 py-14 text-center"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Server className="h-5 w-5"/></span><p className="mt-4 text-sm font-medium">No environments yet</p><p className="mt-1 text-xs text-muted-foreground">Create development, staging, or production.</p><Link to={`/projects/${projectId}/environments`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"><Plus className="h-4 w-4"/>Create environment</Link></div>}
      </section>

      <section className="overflow-hidden rounded-xl border bg-card shadow-sm"><div className="border-b px-5 py-4"><h2 className="text-sm font-semibold">Recently updated</h2><p className="mt-1 text-xs text-muted-foreground">Latest project changes</p></div>{recent.length ? <div className="divide-y">{recent.map(item => <div key={`${item.kind}-${item.id}`} className="flex items-center gap-3 px-5 py-3.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">{item.kind === 'Secret' ? <LockKeyhole className="h-3.5 w-3.5"/> : <Layers3 className="h-3.5 w-3.5"/>}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.kind}</p></div><span className="text-[11px] text-muted-foreground">{new Date(item.updated_at || item.created_at).toLocaleDateString()}</span></div>)}</div> : <div className="px-5 py-10 text-center text-sm text-muted-foreground">Activity will appear as you build this project.</div>}</section>
    </div>

    <section className="flex flex-col gap-5 rounded-xl border border-primary/20 bg-primary/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Sparkles className="h-4 w-4"/></span><div><h2 className="text-sm font-semibold">Next step</h2><p className="mt-1 text-sm text-muted-foreground">{!environments.length ? 'Create an environment to organize where secrets are used.' : !secrets.length ? 'Add your first encrypted secret to this project.' : canUseSdk && !activeKeys ? 'Create a scoped API key to connect your application.' : 'Your project is configured and ready to use.'}</p></div></div><Link to={!environments.length ? `/projects/${projectId}/environments` : !secrets.length ? `/projects/${projectId}/secrets` : canUseSdk && !activeKeys ? `/projects/${projectId}/api-keys` : `/projects/${projectId}/environments`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{!environments.length ? 'Create environment' : !secrets.length ? 'Add secret' : canUseSdk && !activeKeys ? 'Create API key' : 'View environments'}<ArrowUpRight className="h-4 w-4"/></Link></section>
  </div>;
}
