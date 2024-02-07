import { NextApiRequest, NextApiResponse } from 'next';
import { autocomplete } from '../../../lib/searchService';
import type { AutocompleteResponse } from '../../../types/autocomplete';

type Error = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AutocompleteResponse | Error>,
) {
  try {
    const { method } = req;

    if (method !== 'GET') {
      res.status(405).end();
      return;
    }

    const { term } = req.query;

    if (!term || typeof term !== 'string') {
      res.status(400).end();
      return;
    }

    const result = await autocomplete(term);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
