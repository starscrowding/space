import {NextApiRequest, NextApiResponse} from 'next';
import {web3, GetNftMetadataResponse} from '@space/hooks/alchemy';

interface Result {
  ok: boolean;
  error?: string;
  meta?: GetNftMetadataResponse;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Result>) {
  const id = req.body?.id;
  let error;
  if (!process.env.CONTRACT) {
    error = 'No contract';
  }
  if (!id) {
    error = 'No id';
  }
  if (!error) {
    try {
      const meta = await web3.alchemy.getNftMetadata({
        contractAddress: process.env.CONTRACT as string,
        tokenId: id,
        tokenType: 'erc1155',
      });
      return res.status(200).json({ok: !error, error, meta});
    } catch (e) {
      error = (e as Error)?.message;
    }
  }
  return res.status(400).json({ok: !error, error});
}
