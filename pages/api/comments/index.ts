import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { createComment, getAll } from '../../../lib/commentService';
import { CommentResponse } from '../../../types/comment';
import { authOptions } from '../auth/[...nextauth]';

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommentResponse[] | Error>
) {
  try {
    if (req.method === 'GET') {
      const allComments = await getAll();

      if (allComments) {
        res.json(allComments);
      } else {
        res.status(204).end();
      }

      return;
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).json({
        message: 'You must be logged in.',
      });
      return;
    }

    if (req.method === 'POST') {
      const { beerId, comment = '', images = [], value } = req.body;
      const {
        user: { email },
      } = session;

      if (!email || typeof email !== 'string') {
        res.status(500).end();
      }

      if (!value || !beerId) {
        res.status(400).end();
        return;
      }

      const newComment = await createComment({
        userEmail: email as string,
        beerId,
        comment,
        images,
        value,
      });

      if (newComment) {
        res.status(201).end();
      }

      throw new Error('404');
    }

    res.status(405).end;
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal server error' });
  }
}
