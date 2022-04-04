import { useMemo } from 'react';
import { NFTStorage } from 'nft.storage';

export const useNftStorage = (token: string) => {
    return useMemo(() => new NFTStorage({ token }), [token]);
};
