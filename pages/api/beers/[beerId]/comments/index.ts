import type { NextApiRequest, NextApiResponse } from 'next';
import { getAll } from '../../../../../lib/commentService';
import type { GetOptions } from '../../../../../lib/commentService';

enum Filter {
  USER_ID = 'userId',
  BEER_ID = 'beerId',
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { limit, userId, beerId } = req.query;
  const options: GetOptions = {};

  if (typeof limit === 'string') {
    options.limit = Number(limit);
  }

  if (typeof userId === 'string') {
    options.filter = options.filter || {};
    options.filter[Filter.USER_ID] = userId;
  }

  if (typeof beerId === 'string') {
    options.filter = options.filter || {};
    options.filter[Filter.BEER_ID] = beerId;
  }

  const comments = await getAll(options);

  res.json(comments);
}
