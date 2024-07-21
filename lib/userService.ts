import type { UpdateFields, UserResponse } from '../types/user';
import clientPromise from './mongodb';

// TODO: we should get user by Id
export const getUser = async (email: string) => {
  const client = await clientPromise;
  const db = client.db('beer-app');
  const usersCollection = db.collection<UserResponse>('users');
  const usersCursor = usersCollection.aggregate<UserResponse>([
    {
      $match: {
        email: email,
      },
    },
    {
      $lookup: {
        from: 'accounts',
        localField: '_id',
        foreignField: 'userId',
        as: 'linkedAccounts',
        pipeline: [
          {
            $project: {
              _id: 0,
              provider: 1,
            },
          },
          {
            $unwind: '$provider',
          },
        ],
      },
    },
    {
      $set: {
        linkedAccounts: '$linkedAccounts.provider',
      },
    },
  ]);

  const users = await usersCursor.toArray();

  return users[0];
};

export const updateUser = async (email: string, fields: UpdateFields) => {
  const client = await clientPromise;
  const db = client.db('beer-app');
  const usersCollection = db.collection<UserResponse>('users');

  return usersCollection.updateOne(
    { email },
    {
      $set: {
        ...(fields.firstName && fields.lastName
          ? { name: `${fields.firstName} ${fields.lastName}` }
          : {}),
        ...fields,
      },
    },
  );
};
