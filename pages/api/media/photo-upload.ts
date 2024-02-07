import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import cloudinary from 'cloudinary';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).json({
        message: 'You must be logged in.',
      });
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).end();
      return;
    }

    const file = await new Promise<formidable.File>((resolve, reject) => {
      const form = formidable();
      form.parse(req, (err, _, files) => {
        if (err) {
          reject(err);
          return;
        }

        resolve((files as any).file[0]);
      });
    });

    if (!file) {
      res.status(500).end();
      return;
    }

    const result = await cloudinary.v2.uploader.upload(file.filepath, {
      folder: process.env.CLOUDINARY_FOLDER,
    });

    res.json({
      image: result.secure_url,
    });
  } catch (e) {
    res.status(500).end();
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
