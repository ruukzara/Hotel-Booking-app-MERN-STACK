import { useEffect, useState } from "react";
import http from "../http";

const useFetchWithQuery = (url, searchParams) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Changed 'false' to 'null'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await http.get(url, { params: searchParams });
        setData(res.data);
        setError(null); // Reset error on successful fetch
      } catch (error) {
        setError(error); // Set the error on fetch failure
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await http.get(url, { params: searchParams });
      setData(res.data);
      setError(null); // Reset error on successful re-fetch
    } catch (error) {
      setError(error); // Set the error on re-fetch failure
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };
};

export default useFetchWithQuery;
