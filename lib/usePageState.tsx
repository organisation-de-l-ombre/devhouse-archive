import { useEffect, useState } from "react";

export function usePageState<T>(loadingFunction: () => Promise<T>) {
  const [error, setError] = useState<Error>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<T>(null);

  useEffect(() => {
    loadingFunction()
      .then(setData)
      .catch(setError)
      .then(() => setLoading(false));
  }, [loadingFunction]);

  return {
    error,
    setError,
    data,
    setData,
    loading,
    setLoading,
  };
}
