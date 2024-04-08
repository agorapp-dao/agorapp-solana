import useSWR, { SWRConfiguration } from 'swr';

const fetcher = async <T>(path: string, transformer?: (data: T) => T) => {
  return fetch(path)
    .then(res => res.json())
    .then(data => {
      if (transformer) {
        return transformer(data);
      }
      return data;
    });
};

export function useJson<T>(path: string, transformer?: (data: T) => T, config?: SWRConfiguration) {
  return useSWR<T>(path, path => fetcher(path, transformer), config);
}
