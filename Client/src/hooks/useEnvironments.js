import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEnvironments, createEnvironment } from '../api/envsync.js';

export const useEnvironments = (projectId) => {
  return useQuery({
    queryKey: ['environments', projectId],
    queryFn: () => getEnvironments(projectId),
    enabled: !!projectId,
  });
};

export const useCreateEnvironment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, name }) => createEnvironment(projectId, name),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['environments', variables.projectId] });
    },
  });
};
