import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSecrets, createSecret } from '../api/envsync.js';

export const useSecrets = (projectId) => {
  return useQuery({
    queryKey: ['secrets', projectId],
    queryFn: () => getSecrets(projectId),
    enabled: !!projectId,
  });
};

export const useCreateSecret = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, secretName, secretValue }) => 
      createSecret(projectId, secretName, secretValue),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['secrets', variables.projectId] });
    },
  });
};
