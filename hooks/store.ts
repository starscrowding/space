import useSWR from 'swr';
import { ENDPOINT, fetcher } from './api';

export const useStar = (ipfs: string) => {
  const { data, error } = useSWR(`${ENDPOINT.ipfs}/${ipfs}`, fetcher);

  return {
    star: data,
    loading: !error && !data,
    error,
  };
};
