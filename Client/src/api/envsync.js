/**
 * EnvSync API functions
 * Based on actual backend routes in WebService/index.js
 * 
 * Backend routes (from WebService/index.js):
 * - GET/POST /api/v1/project
 * - GET/POST /api/v1/environment
 * - GET/POST /api/v1/secret
 * - GET/POST/DELETE /api/v1/environment_secret
 * - GET /api/v1/ (home)
 */

import { apiGet, apiPost, apiDelete } from './client.js';

// Projects
// Route: GET/POST /api/v1/project
export const getProjects = () => apiGet('/api/v1/project');
export const createProject = (name) => apiPost('/api/v1/project', { name });

// Environments
// Route: GET/POST /api/v1/environment
// Note: Backend expects 'environmentName' not 'name' for POST
export const getEnvironments = (projectId) => 
  apiGet(`/api/v1/environment?project_id=${projectId}`);
export const createEnvironment = (projectId, name) => 
  apiPost('/api/v1/environment', { project_id: projectId, environmentName: name });

// Secrets
// Route: GET/POST /api/v1/secret
export const getSecrets = (projectId) => 
  apiGet(`/api/v1/secret?project_id=${projectId}`);
export const createSecret = (projectId, secretName, secretValue) => 
  apiPost('/api/v1/secret', { project_id: projectId, secretName, secretValue });

// Environment Secrets
// Route: GET/POST/DELETE /api/v1/environment_secret
export const getEnvironmentSecrets = (environmentId) => 
  apiGet(`/api/v1/environment_secret?environment_id=${environmentId}`);
export const attachSecretToEnvironment = (environmentId, secretId) => 
  apiPost('/api/v1/environment_secret', { environment_id: environmentId, secret_id: secretId });
export const detachSecretFromEnvironment = (environmentId, secretId) => 
  apiDelete('/api/v1/environment_secret', { environment_id: environmentId, secret_id: secretId });
