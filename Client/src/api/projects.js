import { client } from './client';

export const projectsApi = {
  getAll: async () => {
    const data = await client('/project/getProjects');
    return data || [];
  },
  getById: (id) => client(`/project/getProjectById/${id}`),
  create: (name) => client('/project', { body: { name } }),
  update: (id, name) => client(`/project/updateProjectById/${id}`, { method: 'PATCH', body: { name } }),
  delete: (id) => client(`/project/deleteproject/${id}`, { method: 'DELETE' }),
};
