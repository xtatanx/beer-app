import cloudinary from 'cloudinary';
import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { updateUser } from '../../../lib/userService';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).json({
        message: 'You must be logged in.',
      });
      return;
    }

    const email = session?.user?.email;

    if (!email) {
      res.status(400).json({
        message: 'Make sure you are sending the correct parameters.',
      });
      return;
    }

    if (req.method == 'POST') {
      const file = await new Promise<formidable.File>((resolve, reject) => {
        const form = formidable();
        form.parse(req, (err, _, files) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(files?.file as formidable.File);
        });
      });

      const result = await cloudinary.v2.uploader.upload(file.filepath, {
        unique_filename: false,
        folder: process.env.CLOUDINARY_FOLDER,
      });

      await updateUser(email, {
        profileImage: result.secure_url,
      });

      res.status(204).end();
      return;
    }

    res.status(405).end();
    return;
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
