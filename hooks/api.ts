export const BASE = 'https://starscrowding.com';
export const ABOUT = 'https://starscrowding.notion.site/About-626a40b60976481a94dd6f47a538944f';
export const FAQ = 'https://starscrowding.notion.site/FAQ-cf17bb2b4525417d80cf22a367523271';
export const GITHUB = 'https://github.com/starscrowding/space';
export const ENDPOINT = {
  ipfs: 'https://ipfs.io/ipfs',
  token: {
    index: '/api/token',
    set: '/api/token/set',
    search: '/api/token/search',
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
