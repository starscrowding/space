import { createAlchemyWeb3 } from '@alch/alchemy-web3';
export * from '@alch/alchemy-web3';

export const web3 = createAlchemyWeb3(
    process.env.ALCHEMY as string
);
