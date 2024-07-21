import { Document, ObjectId, SortDirection } from 'mongodb';
import type { BeerDocument, BeerResponse, GetAllOptions } from '../types/beer';
import clientPromise from './mongodb';

type GetByIdQuery = {
  id: string;
};

type SortingOptions = { [key: string]: SortDirection };

const sortingOptions: SortingOptions = {
  'date-asc': 1,
  'date-desc': -1,
  'rate-asc': 1,
  'rate-desc': -1,
};

const withCategoryPipeline = [
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
];

const withBreweryPipeline = [
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
];

const withRatePipeline = [
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
];

export const getAll = async (options: GetAllOptions = {}) => {
  const { sort = 'date-asc', limit = '20', fields, filter } = options;
  const client = await clientPromise;
  const db = client.db('beer-app');
  const beersCollection = db.collection<BeerDocument>('beers');
  const pipeline: Document[] = [];

  if (filter) {
    const filters = [];
    for (let [key, value] of Object.entries(filter)) {
      if (key === 'breweryId') {
        filters.push({
          [key]: new ObjectId(value),
        });
      } else {
        filters.push({
          [key]: value,
        });
      }
    }

    pipeline.push({
      $match: {
        $and: filters,
      },
    });
  }

  pipeline.push(
    ...withCategoryPipeline,
    ...withBreweryPipeline,
    ...withRatePipeline,
  );

  if (typeof sort === 'string') {
    const sortStrategy = sortingOptions[sort];
    let sortObj: Document = {};

    if (sort.includes('date')) {
      sortObj.$sort = { _id: sortStrategy };
    }

    if (sort.includes('rate')) {
      sortObj.$sort = { 'rate.value': sortStrategy };
    }

    pipeline.push(sortObj);
  }

  if (typeof limit === 'string') {
    pipeline.push({
      $limit: Number(limit),
    });
  }

  if (fields) {
    const projection: Document = {};

    if (typeof fields === 'string') {
      const fieldsList = fields.split(',');
      fieldsList.forEach((field) => {
        projection[field] = 1;
      });
    } else if (Array.isArray(fields)) {
      fields.forEach((field) => {
        projection[field] = 1;
      });
    }

    pipeline.push({
      $project: projection,
    });
  }

  const allBeersCursor = beersCollection.aggregate<BeerResponse>(pipeline);
  const allBeers = await allBeersCursor.toArray();
  return allBeers;
};

export const getById = async (query: GetByIdQuery) => {
  const { id } = query;

  const client = await clientPromise;
  const db = client.db('beer-app');
  const beersCollection = db.collection<BeerDocument>('beers');
  const pipeline: Document[] = [
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    ...withCategoryPipeline,
    ...withBreweryPipeline,
    ...withRatePipeline,
  ];

  const beerCursor = beersCollection.aggregate<BeerResponse>(pipeline);
  const beer = await beerCursor.toArray();
  return beer[0];
};
