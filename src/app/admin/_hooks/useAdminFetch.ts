// app/admin/_hooks/useAdminFetch.ts
import useSWR from "swr";

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", Authorization: token },
  });

  return res.json();
};

export const useAdminFetch = <T>(path: string, token?: string) => {
  const shouldFetch = !!token;
  const key = shouldFetch ? [`/api/${path}`, token] : null;

  return useSWR<T>(key, ([url, token]: [string, string]) =>
    fetcher(url, token),
  );
};
