import {NextApiRequest, NextApiResponse} from 'next';
import {api, ENDPOINT} from '@space/hooks/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ipfs = req?.query?.ipfs;
  if (ipfs) {
    try {
      const ipfsData = await api(`${ENDPOINT.ipfs}/${ipfs}`);
      const b64 = ipfsData?.image || '';
      const img = Buffer.from(b64.replace(/^data:image\/png;base64,/, ''), 'base64');
      res
        .writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': img.length,
        })
        .end(img);
    } catch (e) {
      return res.status(400).end();
    }
  }
  return res.status(400).end();
}
