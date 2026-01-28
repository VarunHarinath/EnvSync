/**
 * localStorage helpers for active project management
 */

export const getActiveProject = () => {
  const id = localStorage.getItem('activeProjectId');
  const name = localStorage.getItem('activeProjectName');
  return id && name ? { id, name } : null;
};

export const setActiveProject = (id, name) => {
  localStorage.setItem('activeProjectId', id);
  localStorage.setItem('activeProjectName', name);
};

export const clearActiveProject = () => {
  localStorage.removeItem('activeProjectId');
  localStorage.removeItem('activeProjectName');
};
