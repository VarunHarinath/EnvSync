import { client } from './client';

export const environmentSecretsApi = {
  create: (environmentId, secretId) => client('/environment_secret', { 
    body: { environment_id: environmentId, secret_id: secretId } 
  }),
  getByEnvironmentId: (environmentId) => client(`/environment_secret/getEnvironmentSecretsById/${environmentId}`),
  remove: (attachmentId) => client(`/environment_secret/deleteEnvironmentSecretById/${attachmentId}`, { method: 'DELETE' }),
};
