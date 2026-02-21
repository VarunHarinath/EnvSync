
// Config
export const USE_MOCK = false;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080/api/v1';

export const MOCK_DB = {
  projects: [
    { id: 'proj_1', name: 'E-Commerce Platform', created_at: '2023-10-15T10:00:00Z', updated_at: '2023-10-20T14:30:00Z' },
    { id: 'proj_2', name: 'Internal Dashboard', created_at: '2023-11-01T09:15:00Z', updated_at: '2023-11-05T11:20:00Z' },
    { id: 'proj_3', name: 'Mobile App API', created_at: '2023-12-10T16:45:00Z', updated_at: '2023-12-12T09:00:00Z' }
  ],
  environments: [
    { id: 'env_1', project_id: 'proj_1', name: 'Production', created_at: '2023-10-15T10:05:00Z' },
    { id: 'env_2', project_id: 'proj_1', name: 'Staging', created_at: '2023-10-15T10:06:00Z' },
    { id: 'env_3', project_id: 'proj_1', name: 'Development', created_at: '2023-10-15T10:06:00Z' },
    { id: 'env_4', project_id: 'proj_2', name: 'Production', created_at: '2023-11-01T09:20:00Z' }
  ],
  secrets: [
    { id: 'sec_1', project_id: 'proj_1', name: 'DATABASE_URL', value: 'postgres://user:pass@db.prod:5432/db', updated_at: '2023-10-20T14:30:00Z' },
    { id: 'sec_2', project_id: 'proj_1', name: 'STRIPE_KEY', value: 'sk_live_51M...', updated_at: '2023-10-21T10:00:00Z' },
    { id: 'sec_3', project_id: 'proj_2', name: 'API_SECRET', value: 'very-secret-value', updated_at: '2023-11-05T11:20:00Z' }
  ],
  api_keys: [
    { id: 'key_1', project_id: 'proj_1', environment_id: 'env_1', key_prefix: 'sk_prod_1234', created_at: '2023-10-25T12:00:00Z', status: 'active' },
    { id: 'key_2', project_id: 'proj_1', environment_id: 'env_2', key_prefix: 'sk_test_5678', created_at: '2023-10-26T15:30:00Z', status: 'active' },
    { id: 'key_3', project_id: 'proj_1', environment_id: 'env_3', key_prefix: 'sk_dev_9012', created_at: '2023-11-02T09:45:00Z', status: 'revoked' }
  ],
  environment_secrets: [
    { id: 'es_1', environment_id: 'env_1', secret_id: 'sec_1' },
    { id: 'es_2', environment_id: 'env_1', secret_id: 'sec_2' },
  ]
};

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export async function client(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  
  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  if (USE_MOCK) {
    console.log(`[MOCK API] ${config.method} ${endpoint}`, body || '');
    await delay();
    return handleMockRequest(endpoint, config);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP Error: ${response.status}`);
    }
    return data.data; // Backend wraps response in { success: true, data: ... }
  } catch (error) {
    console.error('API Call Failed:', error);
    throw error;
  }
}

function handleMockRequest(endpoint, config) {
  const method = config.method;
  const body = config.body ? JSON.parse(config.body) : {};

  // --- PROJECTS ---
  if (endpoint === '/project/getProjects' && method === 'GET') return MOCK_DB.projects;
  
  if (endpoint === '/project' && method === 'POST') {
    const newProject = {
      id: `proj_${Date.now()}`,
      name: body.name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    MOCK_DB.projects.unshift(newProject);
    return newProject;
  }
  
  if (endpoint.match(/^\/project\/getProjectById\/[^/]+$/) && method === 'GET') {
    const id = endpoint.split('/').pop();
    const p = MOCK_DB.projects.find(x => x.id === id);
    if (!p) throw new Error('Project not found');
    return p;
  }
  
  if (endpoint.match(/^\/project\/deleteproject\/[^/]+$/) && method === 'DELETE') {
    const id = endpoint.split('/').pop();
    MOCK_DB.projects = MOCK_DB.projects.filter(x => x.id !== id);
    return { success: true };
  }
  
  if (endpoint.match(/^\/project\/updateProjectById\/[^/]+$/) && method === 'PATCH') {
    const id = endpoint.split('/').pop();
    const p = MOCK_DB.projects.find(x => x.id === id);
    if (p) p.name = body.name || p.name;
    return p;
  }

  // --- ENVIRONMENTS ---
  if (endpoint.match(/^\/environment\/getEnvironmentById\/[^/]+$/) && method === 'GET') {
    const projectId = endpoint.split('/').pop();
    return MOCK_DB.environments.filter(e => e.project_id === projectId);
  }
  
  if (endpoint === '/environment' && method === 'POST') {
    const newEnv = {
      id: `env_${Date.now()}`,
      project_id: body.project_id,
      name: body.environmentName,
      created_at: new Date().toISOString()
    };
    MOCK_DB.environments.push(newEnv);
    return newEnv;
  }
  
  if (endpoint.match(/^\/environment\/deleteEnvironmentById\/[^/]+$/) && method === 'DELETE') {
    const id = endpoint.split('/').pop();
    MOCK_DB.environments = MOCK_DB.environments.filter(x => x.id !== id);
    return { success: true };
  }
  
  if (endpoint.match(/^\/environment\/updateEnvironmentById\/[^/]+$/) && method === 'PATCH') {
    const id = endpoint.split('/').pop();
    const e = MOCK_DB.environments.find(x => x.id === id);
    if (e) e.name = body.name || e.name;
    return e;
  }

  // --- SECRETS ---
  if (endpoint.match(/^\/secret\/getSecrectsByProjectId\/[^/]+$/) && method === 'GET') {
      const projectId = endpoint.split('/').pop();
      const secrets = MOCK_DB.secrets.filter(s => s.project_id === projectId);
      return { 
          getSecretsByProjectId: secrets,
          getSecrectValueBySecrectId: secrets.map(s => ({ secret_id: s.id, value: s.value })) 
      };
  }
  
   if (endpoint === '/secret' && method === 'POST') {
    const newSecret = {
        id: `sec_${Date.now()}`,
        project_id: body.project_id,
        name: body.secretName,
        value: body.secretValue,
        updated_at: new Date().toISOString()
    };
    MOCK_DB.secrets.push(newSecret);
    return newSecret;
  }
  
  if (endpoint.match(/^\/secret\/deleteSecretBySecretId\/[^/]+$/) && method === 'DELETE') {
    const id = endpoint.split('/').pop();
    MOCK_DB.secrets = MOCK_DB.secrets.filter(x => x.id !== id);
    return { success: true };
  }

  if (endpoint.match(/^\/secret\/updateSecretsBySecretId\/[^/]+$/) && method === 'PATCH') {
      const id = endpoint.split('/').pop();
      const s = MOCK_DB.secrets.find(x => x.id === id);
      if (s) {
          if (body.name) s.name = body.name;
          if (body.value) s.value = body.value;
      }
      return s;
  }

  // --- API KEYS ---
  if (endpoint.match(/^\/api-keys\/[^/]+$/) && method === 'GET') {
      const projectId = endpoint.split('/').pop();
      return MOCK_DB.api_keys.filter(k => k.project_id === projectId);
  }
  if (endpoint === '/api-keys' && method === 'POST') {
      return { success: true };
  }

  return { success: true, message: 'Mock action performed', data: {} };
}
