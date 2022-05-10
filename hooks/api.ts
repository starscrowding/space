export const BASE = 'https://starscrowding.com';
export const ABOUT = 'https://starscrowding.notion.site/About-626a40b60976481a94dd6f47a538944f';
export const FAQ = 'https://starscrowding.notion.site/FAQ-cf17bb2b4525417d80cf22a367523271';
export const GITHUB = 'https://github.com/starscrowding/space';
export const OPENSEA = 'https://opensea.io/assets/matic/0xf2e805a8773e991cdee1a7e44e54eb238f2a2f07';
export const COLLECTION = 'https://opensea.io/collection/starscrowding';
export const FORM = 'https://forms.gle/AKtu2MF6NQXWAEcu5';
export const GRAVITY_CONTRACT = 'https://polygonscan.com/address/0x0Cb15eE96f7b75A40B5e182F30Da762Fb616F793';
export const POOL = 'https://app.uniswap.org/#/pool/112088';
export const ENDPOINT = {
  ipfs: 'https://ipfs.io/ipfs',
  token: {
    index: '/api/token',
    set: '/api/token/set',
    search: '/api/token/search',
    img: '/api/token/img',
  },
};

export const api = async (url: RequestInfo, params?: RequestInit) => {
  return fetch(url, params).then(res => res.json());
};

export const post = async (url: RequestInfo, body: any, params?: RequestInit) => {
  return await api(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    ...params,
  });
};

export const fetcher = (...args: any) => api.apply(null, args);
