import { client } from './client';

export const apiKeysApi = {
  getByProject: async (projectId) => (await client(`/projects/${projectId}/api-keys`)).map(key=>({...key,status:key.active&&!key.revoked_at?'active':'revoked'})),
  create: (projectId, environmentId) => client(`/projects/${projectId}/api-keys`, { body: { name: 'SDK key', environmentId } }),
  revoke: (id) => client(`/api-keys/${id}/revoke`, { body: {} }),
};
