import { Document, ObjectId } from 'mongodb';
import { CommentResponse } from '../types/comment';
import clientPromise from './mongodb';

export type GetOptions = {
  limit?: number;
  filter?: {
    [key: string]: string | number;
  };
  sort?: keyof typeof sortingOptions;
};

export type PostOptions = {
  userEmail: string;
  value: number;
  comment: string;
  images: string[];
  beerId: string;
};

const sortingOptions = {
  'date-asc': 1,
  'date-desc': -1,
};

const withUserData = [
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user',
      pipeline: [
        {
          $project: {
            firstName: 1,
            lastName: 1,
            profileImage: 1,
          },
        },
      ],
    },
  },
  {
    $unwind: '$user',
  },
];

const withCreationDate = [
  {
    $addFields: { createdAt: { $toDate: '$_id' } },
  },
];

export const getAll = async ({
  limit = 20,
  sort = 'date-desc',
  filter,
}: GetOptions = {}) => {
  const client = await clientPromise;
  const db = client.db('beer-app');
  const votesCollection = db.collection('votes');
  const pipeline: Document[] = [...withCreationDate, ...withUserData];

  if (filter) {
    const filters = [];
    for (let [key, value] of Object.entries(filter)) {
      if (key === 'userId' || key === 'beerId') {
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

  if (typeof sort === 'string') {
    const sortStrategy = sortingOptions[sort];
    let sortObj: Document = {};

    if (sort.includes('date')) {
      sortObj.$sort = { _id: sortStrategy };
    }

    pipeline.push(sortObj);
  }

  pipeline.push({ $limit: limit });
  pipeline.push({ $unset: 'beerId' });
  pipeline.push({ $unset: 'userId' });

  const response = votesCollection.aggregate<CommentResponse>(pipeline);

  return response.toArray();
};

export const createComment = async ({
  userEmail,
  beerId,
  comment,
  images,
  value,
}: PostOptions) => {
  const client = await clientPromise;
  const db = client.db('beer-app');
  const votesCollection = db.collection('votes');
  const usersCollection = db.collection('users');

  const user = await usersCollection.findOne({ email: userEmail });

  const newComment = await votesCollection.insertOne({
    userId: user!._id,
    beerId: new ObjectId(beerId),
    value,
    comment,
    images,
  });

  return newComment;
};
