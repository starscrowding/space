import { NextPageContext } from 'next';
import Router from 'next/router';
import { parseCookies } from 'nookies';

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

export const useAdmin = ({
    ctx,
    redirectUrl = '/'
}: useUserProps) => {
    try {
        const { ADMIN } = process.env;
        const adminCookie = parseCookies(ctx).admin;
        if (ADMIN && adminCookie && adminCookie === ADMIN) {
            return true;
        }
        redirect(ctx).to(redirectUrl);
    } catch (e) {
        redirect(ctx).to(redirectUrl);
    }
};
