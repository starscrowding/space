import useSWR from 'swr';
import { fetcher } from './api';

export const useStar = (ipfs: string) => {
    const { data, error } = useSWR(`https://ipfs.io/ipfs/${ipfs}`, fetcher);

    return {
        star: data,
        loading: !error && !data,
        error
    };
}
