import { client } from './client';

export const projectsApi = {
  getAll: () => client('/project/getProjects'),
  getById: (id) => client(`/project/getProjectById/${id}`),
  create: (name) => client('/project', { body: { name } }),
  update: (id, name) => client(`/project/updateProjectById/${id}`, { method: 'PATCH', body: { name } }),
  delete: (id) => client(`/project/deleteproject/${id}`, { method: 'DELETE' }),
};
