import type { NextApiRequest, NextApiResponse } from 'next';
import type { Options, BreweryResponse } from '../../../types/brewery';
import { getAll } from '../../../lib/breweryService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BreweryResponse[]>,
) {
  try {
    const { limit } = req.query;
    const options: Options = {};

    if (typeof limit === 'string') {
      options.limit = Number(limit);
    }

    const allBreweries = await getAll(options);

    if (allBreweries) {
      res.json(allBreweries);
    } else {
      res.status(204).end();
    }
  } catch (e) {
    console.error(e);
    res.status(404);
  }
}
