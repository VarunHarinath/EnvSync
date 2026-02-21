import { client } from './client';

export const environmentsApi = {
  getByProject: async (projectId) => {
    const data = await client(`/environment/getEnvironmentById/${projectId}`);
    // Backend returns a single object if one result, or array? 
    // The UI expects an array. Normalize it.
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  },
  create: (projectId, environmentName) => client('/environment', { 
    body: { project_id: projectId, environmentName } 
  }),
  update: (id, name) => client(`/environment/updateEnvironmentById/${id}`, { 
    method: 'PATCH', 
    body: { name } 
  }),
  delete: (id) => client(`/environment/deleteEnvironmentById/${id}`, { method: 'DELETE' }),
};
