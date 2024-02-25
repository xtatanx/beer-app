import { getById } from '@/lib/breweryService';
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { query, method } = req;

    switch (method) {
      case 'POST': {
        const breweryId = query.breweryId;
        const brewery = await getById(breweryId as string);

        if (!brewery) {
          throw new Error('404');
        }

        const data = req.body;

        const transporter = nodemailer.createTransport(
          process.env.EMAIL_SERVER,
        );

        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: 'jhonnatanhxc@gmail.com',
          subject: `Reclamar cerveceria - ${brewery.name}`,
          text: `
          Hola, ${data.name} esta intentando reclamar la cerveceria ${brewery.name}. Estos son sus datos:

          Email: ${data.email}
          Cargo: ${data.title} 
          Comentarios: ${data.message}
          
          Por favor ponte en contacto con el`,
        });

        res.status(204).end();
        break;
      }
      default: {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (e) {
    let message = '';

    if (e instanceof Error) {
      message = e.message;
    }

    if (message === '404') {
      res.status(404).json({ error: 'Not found' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}
