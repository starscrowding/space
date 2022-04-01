import dynamic from 'next/dynamic';

export const MintToken: any = dynamic(() => import('./mint').then(mod => mod.MintToken) as any, { ssr: false });
export const Token: any = dynamic(() => import('./view').then(mod => mod.Token) as any, { ssr: false });
export const StoreToken: any = dynamic(() => import('./store').then(mod => mod.StoreToken) as any, { ssr: false });
