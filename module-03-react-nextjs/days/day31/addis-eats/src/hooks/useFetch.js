import { useState, useEffect } from 'react';


export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(menubar.json(), { signal });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch ${url}`);
        }
        const result = await response.json();
        if (!signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("useFetch error:", err);
          setError(err);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
