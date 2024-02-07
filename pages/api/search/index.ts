import { NextApiRequest, NextApiResponse } from 'next';
import { searchBeers, searchBreweries } from '../../../lib/searchService';
import type { SearchResponse } from '../../../types/search';

type Error = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse | Error>,
) {
  try {
    const { method } = req;

    if (method !== 'GET') {
      res.status(405).end();
      return;
    }

    const { term, type = 'cervezas' } = req.query;

    if (!term || typeof term !== 'string') {
      res.status(400).end();
      return;
    }

    let result;
    if (type === 'cervecerias') {
      result = await searchBreweries(term);
    } else {
      result = await searchBeers(term);
    }

    res.json(result as SearchResponse);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
