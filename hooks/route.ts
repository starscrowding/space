import { NextPageContext } from 'next';
import Router from 'next/router';
import { parseCookies } from 'nookies';
import { validateToken } from './crypto';

interface useUserProps {
    ctx: NextPageContext,
    redirectUrl?: string;
}

export const isSSR = (ctx: NextPageContext) => {
    return ctx && ctx.req;
};

export const redirect = (ctx: NextPageContext) => ({
    to: (url: string) => {
        console.log('redirect to: ', url);
        if (isSSR(ctx) && ctx.res) {
            ctx.res.writeHead(302, { Location: url });
            ctx.res.end();
        } else {
            Router.replace(url);
        }
    }
});

export const isAdmin = ({
    ctx,
    redirectUrl = '/login'
}: useUserProps) => {
    try {
        const { ADMIN } = process.env;
        const token = parseCookies(ctx)?.token;
        const now = Date.now().toString();
        if (ADMIN && token && validateToken({
            msg: now.slice(0, 4) + '0'.repeat(now.length - 4),
            key: ADMIN,
            token
        })) {
            return true;
        }
        redirect(ctx).to(redirectUrl);
        return false;
    } catch (e) {
        redirect(ctx).to(redirectUrl);
        return false;
    }
};
