import { useState, useEffect } from "react";

export function useFetch(url) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    async function fetchData() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (!controller.signal.aborted) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setState({ data: null, loading: false, error: err.message || "Failed to fetch data" });
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return state;
}

export default useFetch;
