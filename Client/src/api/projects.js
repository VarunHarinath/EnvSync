import { client } from './client';

export const projectsApi = {
  getAll: async () => {
    const data = await client('/projects');
    return data || [];
  },
  getById: (id) => client(`/projects/${id}`),
  create: (name) => client('/projects', { body: { name } }),
  update: (id, name) => client(`/projects/${id}`, { method: 'PATCH', body: { name } }),
  delete: (id) => client(`/projects/${id}`, { method: 'DELETE' }),
};
