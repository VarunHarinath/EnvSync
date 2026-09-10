import { client } from './client';

export const secretsApi = {
  getByProject: async (projectId) => {
    const data = await client(`/projects/${projectId}/secrets`);
    // Backend now returns an array of secrets with joined values
    return data || [];
  },
  create: (projectId, secretName, secretValue) => client(`/projects/${projectId}/secrets`, {
    body: { name: secretName, value: secretValue }
  }),
  update: (id, name, value) => client(`/secrets/${id}`, {
    method: 'PATCH', 
    body: { name, value } 
  }),
  delete: (id) => client(`/secrets/${id}`, { method: 'DELETE' }),
  reveal: (id) => client(`/secrets/${id}/reveal`, { body: {} }),
};
