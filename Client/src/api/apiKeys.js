import { client } from './client';

export const apiKeysApi = {
  getByProject: (projectId) => client(`/api/project/${projectId}`),
  create: (projectId, environmentId, keyHash, keyPrefix) => client('/api/newApi', { 
    body: { 
      project_id: projectId, 
      environment_id: environmentId,
      key_hash: keyHash,
      key_prefix: keyPrefix
    } 
  }),
  revoke: (id) => client(`/api/${id}`, { method: 'DELETE' }),
};
