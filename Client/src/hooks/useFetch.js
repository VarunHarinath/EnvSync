import { useState, useEffect, useCallback } from 'react';

export function useFetch(fetchFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]); // Be careful with dependencies here. usually fetchFn should be stable or wrapped in useCallback by caller.

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, setData, isLoading, error, refetch: fetchData };
}
