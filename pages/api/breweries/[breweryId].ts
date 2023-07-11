import type { NextApiRequest, NextApiResponse } from 'next';
import { getById } from '../../../lib/breweryService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { breweryId } = req.query;

    if (typeof breweryId !== 'string') {
      throw new Error('400');
    }

    const brewery = await getById(breweryId);

    if (!brewery) {
      throw new Error('404');
    }

    res.json(brewery);
  } catch (e) {
    console.log(e);
    let message = '';

    if (e instanceof Error) {
      message = e.message;
    }

    if (message === '404') {
      res.status(404).json({
        error: message,
      });
    } else if (message === '400') {
      res.status(400).json({
        error: 'Bad request',
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
