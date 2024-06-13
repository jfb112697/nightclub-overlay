import { useEffect, useState } from "react";

export function useFetchPoll(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const response = await fetch(url);
      const result = await response.json();
      if (isMounted) {
        setData(result);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [url]);

  return data;
}
