import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getEnvironmentSecrets, 
  attachSecretToEnvironment, 
  detachSecretFromEnvironment 
} from '../api/envsync.js';

export const useEnvSecrets = (environmentId) => {
  return useQuery({
    queryKey: ['environment-secrets', environmentId],
    queryFn: () => getEnvironmentSecrets(environmentId),
    enabled: !!environmentId,
  });
};

export const useAttachSecretToEnv = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ environmentId, secretId }) => 
      attachSecretToEnvironment(environmentId, secretId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['environment-secrets', variables.environmentId] 
      });
    },
  });
};

export const useDetachSecretFromEnv = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ environmentId, secretId }) => 
      detachSecretFromEnvironment(environmentId, secretId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['environment-secrets', variables.environmentId] 
      });
    },
  });
};
