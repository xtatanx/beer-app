import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { getUser, updateUser } from '../../../lib/userService';
import { authOptions } from '../auth/[...nextauth]';
import type { UserResponse } from '../../../types/user';

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse | Error | null>,
) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).json({
        message: 'You must be logged in.',
      });
      return;
    }

    const { method, body } = req;
    const email = session?.user?.email;

    if (!email) {
      res.status(400).json({
        message: 'Make sure you are sending the correct parameters.',
      });
      return;
    }

    if (method === 'GET') {
      const user = await getUser(email);
      res.json(user);
      return;
    } else if (method === 'PUT') {
      await updateUser(email, body);
      res.status(204).end();
      return;
    }
  } catch (e) {
    res.status(500).end();
  }
}
