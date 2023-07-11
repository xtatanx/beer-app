import type { NextApiRequest, NextApiResponse } from 'next';
import { getAll } from '../../../lib/beerService';
import { BeerResponse, GetAllOptions } from '../../../types/beer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BeerResponse[]>
) {
  try {
    const { sort, limit, fields, breweryId } = req.query;
    const options: GetAllOptions = {};

    if (typeof sort === 'string') {
      options.sort = sort;
    }

    if (typeof limit === 'string') {
      options.limit = limit;
    }

    if (fields) {
      options.fields = fields;
    }

    options.filter = {};

    if (typeof breweryId === 'string') {
      options.filter.breweryId = breweryId;
    }

    const allBeers = await getAll(options);

    if (allBeers) {
      res.json(allBeers);
    } else {
      res.status(204).end();
    }
  } catch (e) {
    console.error(e);
    res.status(404);
  }
}
