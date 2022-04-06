import {NextApiRequest, NextApiResponse} from 'next';
import {isAdmin} from '@space/hooks/route';
import {Stars, toJSON} from '@space/hooks/db';

interface Result {
  ok: boolean;
  error?: string;
  star?: Object;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Result>) {
  const admin = isAdmin({ctx: {req, res} as any, redirectUrl: ''});
  let error;
  if (!!admin) {
    try {
      switch (req.method) {
        case 'GET':
          const id = req?.query?.id as string;
          if (id) {
            const split = id.split('*');
            const star = await Stars.findOne({
              $or: [{id: +split[1] || +split[0] || 0}, {name: new RegExp(split[0])}],
            });
            return res.status(200).json({ok: !error, error, star: toJSON(star)});
          } else {
            error = 'no id';
          }
        case 'POST':
          const body = req?.body;
          if (body) {
            const {id} = body;
            const star = await Stars.findOneAndUpdate({id}, body, {upsert: true, new: true});
            return res.status(200).json({ok: !error, error, star: toJSON(star)});
          } else {
            error = 'no body';
          }
      }
    } catch (e) {
      error = (e as Error)?.message;
    }
  } else {
    error = 'for admin only';
  }
  return res.status(400).json({ok: !error, error});
}
