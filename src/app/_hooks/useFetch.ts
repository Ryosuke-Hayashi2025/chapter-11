//  app/_hooks/useAdminFetch.ts
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export const useFetch = <T>(path: string) => {
  return useSWR<T>(`/api/${path}`, fetcher);
};
