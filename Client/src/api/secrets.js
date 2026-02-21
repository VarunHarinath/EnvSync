import { client } from './client';

export const secretsApi = {
  getByProject: async (projectId) => {
    const data = await client(`/secret/getSecrectsByProjectId/${projectId}`);
    // Backend now returns an array of secrets with joined values
    return data || [];
  },
  create: (projectId, secretName, secretValue) => client('/secret', { 
    body: { project_id: projectId, secretName, secretValue } 
  }),
  update: (id, name, value) => client(`/secret/updateSecretsBySecretId/${id}`, { 
    method: 'PATCH', 
    body: { name, value } 
  }),
  delete: (id) => client(`/secret/deleteSecretBySecretId/${id}`, { method: 'DELETE' }),
};
