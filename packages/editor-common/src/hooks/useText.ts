import useSWR, { SWRConfiguration } from 'swr';

const fetcher = (path: string) => fetch(path).then(res => res.text());

export function useText(path: string | undefined, config?: SWRConfiguration) {
  return useSWR(path, fetcher, config);
}
