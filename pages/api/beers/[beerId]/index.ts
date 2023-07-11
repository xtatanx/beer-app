// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getById } from '../../../../lib/beerService';
import type { BeerResponse } from '../../../../types/beer';

type Error = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BeerResponse | Error>
) {
  try {
    const { beerId } = req.query;

    if (typeof beerId !== 'string') {
      throw new Error('400');
    }

    const beer = await getById({ id: beerId });

    if (!beer) {
      throw new Error('404');
    }

    res.json(beer);
  } catch (e) {
    console.log(e);
    let message = '';
    if (e instanceof Error) {
      message = e.message;
    }

    if (message === '400') {
      res.status(400).json({ error: 'Bad request' });
    } else if (message === '404') {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
