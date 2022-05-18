import {NextApiRequest, NextApiResponse} from 'next';
import {ethers} from 'ethers';
import {isAdmin} from '@space/hooks/route';
import {toJSON} from '@space/hooks/db';

interface Result {
  ok: boolean;
  error?: string;
  wallet?: Object;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Result>) {
  const admin = isAdmin({ctx: {req, res} as any, redirectUrl: ''});
  let error;
  if (!!admin) {
    try {
      switch (req.method) {
        case 'GET':
          const wallet = ethers.Wallet.createRandom();
          return res.status(200).json({
            ok: !error,
            error,
            wallet: toJSON({
              address: wallet.address,
              key: wallet.privateKey,
            }),
          });
      }
    } catch (e) {
      error = (e as Error)?.message;
    }
  } else {
    error = 'for admin only';
  }
  return res.status(400).json({ok: !error, error});
}
