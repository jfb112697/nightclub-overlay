import { useEffect, useState } from "react";

export function useFetchPoll(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const response = await fetch(url);
      const result = await response.json();
      if (isMounted) {
        if (result.Player1.name.includes("|")) {
          result.Player1.name = result.Player1.name.replace(/.*\| /, ""); //Replaces anything before a pipe and the first character after it
        }
        if (result.Player2.name.includes("|")) {
          result.Player2.name = result.Player2.name.replace(/.*\| /, ""); //Replaces anything before a pipe and the first character after it
        }
        var re = /(\b[a-z](?!\s))/g;
        result.round = result.round.toLowerCase().replace(re, (x) => {
          return x.toUpperCase();
        });
        setData(result);
      }
    };
    const interval = setInterval(fetchData, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [url]);

  return data;
}
