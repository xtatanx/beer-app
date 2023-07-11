import { Document, ObjectId } from 'mongodb';
import type { BreweryResponse, Options } from '../types/brewery';
import clientPromise from './mongodb';

const withVerifiedPipeline = [
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
];

const withBeerCountPipeline = [
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
];

const withCommentsCountPipeline = [
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
];

export const getAll = async ({ limit = 20 }: Options = {}) => {
  const client = await clientPromise;
  const db = client.db('beer-app');
  const breweriesCollection = db.collection('breweries');
  const pipeline: Document[] = [
    ...withVerifiedPipeline,
    ...withBeerCountPipeline,
    ...withCommentsCountPipeline,
  ];

  pipeline.push({ $limit: limit });

  const response = breweriesCollection.aggregate<BreweryResponse>(pipeline);

  return response.toArray();
};

export const getById = async (id: string) => {
  const client = await clientPromise;
  const db = client.db('beer-app');
  const breweriesCollection = db.collection('breweries');
  const pipeline: Document[] = [
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    ...withVerifiedPipeline,
    ...withBeerCountPipeline,
    ...withCommentsCountPipeline,
  ];

  const breweryCursor =
    breweriesCollection.aggregate<BreweryResponse>(pipeline);
  const breweries = await breweryCursor.toArray();
  return breweries[0];
};
