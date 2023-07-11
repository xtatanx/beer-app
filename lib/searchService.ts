import type { BeerResponse } from '../types/beer';
import type { BreweryResponse } from '../types/brewery';
import type {
  BreweryResponse as BreweryResponseAutocomplete,
  BeerResponse as BeerResponseAutocomplete,
} from '../types/autocomplete';

import clientPromise from './mongodb';

const beerStages = [
  {
    $limit: 10,
  },
  {
    $lookup: {
      from: 'breweries',
      localField: 'breweryId',
      foreignField: '_id',
      as: 'brewery',
    },
  },
  {
    $set: {
      brewery: {
        $arrayElemAt: ['$brewery', 0],
      },
    },
  },
  {
    $project: {
      name: 1,
      profileImage: 1,
      brewery: {
        name: 1,
        handler: 1,
        profileImage: 1,
      },
    },
  },
];

const breweryStages = [
  {
    $limit: 10,
  },
  {
    $project: {
      name: 1,
      profileImage: 1,
      handler: 1,
    },
  },
];

export const autocomplete = async (term: string) => {
  const beersPipeline = [
    {
      $search: {
        autocomplete: {
          query: term,
          path: 'name',
        },
      },
    },
    ...beerStages,
  ];

  const breweriesPipeline = [
    {
      $search: {
        autocomplete: {
          query: term,
          path: 'name',
        },
      },
    },
    ...breweryStages,
  ];

  const client = await clientPromise;
  const db = client.db('beer-app');
  const beersPromise = db
    .collection('beers')
    .aggregate<BeerResponseAutocomplete>(beersPipeline)
    .toArray();
  const breweriesPromise = db
    .collection('breweries')
    .aggregate<BreweryResponseAutocomplete>(breweriesPipeline)
    .toArray();

  const beers = await beersPromise;
  const breweries = await breweriesPromise;

  return {
    beers,
    breweries,
  };
};

export const searchBeers = async (term: string) => {
  const client = await clientPromise;
  const db = client.db('beer-app');
  const beersPromise = await db
    .collection('beers')
    .aggregate<BeerResponse>([
      {
        $search: {
          autocomplete: {
            path: 'name',
            query: term,
          },
        },
      },
      { $limit: 20 },
      {
        $lookup: {
          from: 'styles',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'style',
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
      { $unwind: '$style' },
      { $unset: 'categoryId' },
      {
        $lookup: {
          from: 'breweries',
          localField: 'breweryId',
          foreignField: '_id',
          as: 'brewery',
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: '$brewery',
      },
      { $unset: 'breweryId' },
      {
        $lookup: {
          from: 'votes',
          localField: '_id',
          foreignField: 'beerId',
          as: 'rate',
          pipeline: [
            {
              $group: {
                _id: '$beerId',
                value: { $avg: '$value' },
                total: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ],
        },
      },
      { $unwind: '$rate' },
    ])
    .toArray();
  return beersPromise;
};

export const searchBreweries = async (term: string) => {
  const client = await clientPromise;
  const db = client.db('beer-app');
  const breweryPromise = await db
    .collection('breweries')
    .aggregate<BreweryResponse>([
      {
        $search: {
          autocomplete: {
            path: 'name',
            query: term,
          },
        },
      },
      { $limit: 20 },
      {
        $set: {
          verified: {
            $convert: {
              input: '$userId',
              to: 'bool',
              onNull: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: 'beers',
          localField: '_id',
          foreignField: 'breweryId',
          as: 'beers',
        },
      },
      {
        $set: {
          beersTotal: { $size: '$beers' },
        },
      },
      {
        $unset: 'beers',
      },
      {
        $lookup: {
          from: 'beers',
          localField: '_id',
          foreignField: 'breweryId',
          as: 'beers',
          pipeline: [
            {
              $lookup: {
                from: 'votes',
                localField: '_id',
                foreignField: 'beerId',
                as: 'comments',
              },
            },
            { $unwind: '$comments' },
          ],
        },
      },
      {
        $set: {
          commentsTotal: { $size: '$beers' },
        },
      },
      {
        $unset: 'beers',
      },
    ])
    .toArray();
  return breweryPromise;
};
