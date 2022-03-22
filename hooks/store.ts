import useSWR from 'swr';
import { fetcher } from './api';

export const useStar = (id: string) => {
    const { data, error } = useSWR(`/api/star/${id}`, fetcher)

    return {
        star: data,
        isLoading: !error && !data,
        isError: error
    }
}
