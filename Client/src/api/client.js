/**
 * API client wrapper for fetch requests
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Generic GET request
 */
export const apiGet = async (path) => {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Generic POST request
 */
export const apiPost = async (path, body) => {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Generic DELETE request
 * Supports both body and query params - adjust based on backend implementation
 */
export const apiDelete = async (path, bodyOrQuery = null) => {
  let url = `${API_BASE_URL}${path}`;
  
  // If bodyOrQuery is provided and backend expects query params, append them
  // Otherwise, send as body. Adjust this based on your backend implementation.
  if (bodyOrQuery && typeof bodyOrQuery === 'object') {
    // For now, using query params approach - change to body if backend expects it
    const params = new URLSearchParams(bodyOrQuery);
    url = `${url}?${params.toString()}`;
  }

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // If backend expects DELETE with body, uncomment this:
  // if (bodyOrQuery && typeof bodyOrQuery === 'object') {
  //   options.body = JSON.stringify(bodyOrQuery);
  // }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  // DELETE might return empty response
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;
};
