import { client } from './client';

export const environmentsApi = {
  getByProject: async (projectId) => {
    const data = await client(`/projects/${projectId}/environments`);
    // Backend returns a single object if one result, or array? 
    // The UI expects an array. Normalize it.
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  },
  create: (projectId, environmentName) => client(`/projects/${projectId}/environments`, {
    body: { name: environmentName }
  }),
  update: (id, name) => client(`/environments/${id}`, {
    method: 'PATCH', 
    body: { name } 
  }),
  delete: (id) => client(`/environments/${id}`, { method: 'DELETE' }),
};
