import { client } from './client';

export const environmentSecretsApi = {
  create: (environmentId, secretId) => client(`/environments/${environmentId}/secrets/${secretId}`, { body: {} }),
  getByEnvironmentId: (environmentId) => client(`/environments/${environmentId}/secrets`),
  remove: (attachmentId) => client(`/environment-secrets/${attachmentId}`, { method: 'DELETE' }),
};
