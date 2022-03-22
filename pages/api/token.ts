import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'nookies';

interface Data {
  ok: boolean
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const isOK = !!req.body;
  if (isOK) {
    setCookie({ res }, 'token', req.body, {
      path: '/',
      maxAge: 11 * 24 * 60 * 60,
    });
  }
  res.status(200).json({ ok: isOK });
}
