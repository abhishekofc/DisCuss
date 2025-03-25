import { useEffect, useState } from "react";

export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setdata] = useState(null);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        setloading(true);
        const response = await fetch(url, options);
        const responsedata = await response.json();

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}, ${response.status}`);
        }

        setdata(responsedata);
        seterror(null);
      } catch (error) {
        seterror(error.message);
      } finally {
        setloading(false);
      }
    };

    fetchdata();
  }, dependencies);

  return { data, loading, error };
};
