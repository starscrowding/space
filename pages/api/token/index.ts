import { NextApiRequest, NextApiResponse, NextPageContext } from 'next';
import { isAdmin } from '@space/hooks/route';
import { Stars, toJSON } from '@space/hooks/db';

interface Result {
    ok: boolean;
    error?: string;
    star?: Object;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Result>
) {
    const admin = isAdmin({ ctx: { req, res } as any, redirectUrl: '' });
    let error;
    if (!!admin) {
        switch (req.method) {
            case 'GET':
                const { id } = req?.query;
                if (id) {
                    const star = await Stars.findOne({ name: id });
                    return res.status(200).json({ ok: !error, error, star: toJSON(star) });
                } else {
                    error = 'no id';
                }
            case 'POST':
                const body = req?.body;
                if (body) {
                    const star = await Stars.create(body);
                    return res.status(200).json({ ok: !error, error, star: toJSON(star) });
                } else {
                    error = 'no body';
                }
        }
    } else {
        error = 'for admin only';
    }
    return res.status(400).json({ ok: !error, error });
}
