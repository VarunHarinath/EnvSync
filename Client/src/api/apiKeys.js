import { client } from './client';

export const apiKeysApi = {
  getByProject: (projectId) => client(`/api-keys/${projectId}`),
  create: (projectId, environmentId) => client('/api-keys', { 
    body: { project_id: projectId, environment_id: environmentId } 
  }),
  revoke: (id) => client(`/api-keys/${id}`, { method: 'DELETE' }),
};
