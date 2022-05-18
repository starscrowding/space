import {NextApiRequest, NextApiResponse} from 'next';
import {Stars, toJSON} from '@space/hooks/db';

const MAX = 4;

interface Result {
  ok: boolean;
  error?: string;
  stars?: Array<{}>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Result>) {
  const q = req.query?.q?.toString();
  let result, error;
  if (!q) {
    error = 'No query';
  }
  if (!error) {
    try {
      if (q === '.') {
        result = await Stars.aggregate([{$match: {listed: true}}, {$sample: {size: MAX}}]);
      } else {
        const split = q.split('*');
        const pattern = (split[0] || '').toLowerCase().replace(' ', '|');
        result = await Stars.find({name: new RegExp(pattern), listed: true}).limit(MAX);
      }
      return res.status(200).json({ok: !error, error, stars: toJSON(result)});
    } catch (e) {
      error = (e as Error)?.message;
    }
  }
  return res.status(400).json({ok: !error, error});
}
