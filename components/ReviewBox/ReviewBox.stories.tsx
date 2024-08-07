import type { Meta, StoryFn } from '@storybook/react';
import { SessionProvider } from 'next-auth/react';
import ReviewBox from './ReviewBox';
import { http, HttpResponse } from 'msw';

const session = {
  user: {
    name: 'Jhonnatan Gonzalez',
    firstName: 'Jhonnatan',
    lastName: 'Gonzalez',
    email: 'jhonnatanhxc@gmail.com',
    image:
      'https://res.cloudinary.com/beer-app/image/upload/v1672488534/dev-content/clzzu1jciah81nyo9wfz.jpg',
  },
  expires: '2022-12-08T18:48:17.675Z',
};

const meta: Meta<typeof ReviewBox> = {
  title: 'ReviewBox',
  component: ReviewBox,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <SessionProvider session={session}>
        <div className="mx-auto w-[580px]">
          <Story />
        </div>
      </SessionProvider>
    ),
  ],
  args: {
    beerId: '32dasf34',
  },
};

export default meta;

const Template: StoryFn<typeof ReviewBox> = (args) => {
  return <ReviewBox {...args}></ReviewBox>;
};

export const Default = Template.bind({});

Default.parameters = {
  msw: {
    handlers: [
      http.get('/api/user', () => {
        return HttpResponse.json({
          _id: '1',
          name: 'Jhonnatan Gonzalez',
          firstName: 'Jhonnatan',
          lastName: 'Gonzalez',
          email: 'jhonnatanhxc@gmail.com',
          image:
            'https://res.cloudinary.com/beer-app/image/upload/v1672488534/dev-content/clzzu1jciah81nyo9wfz.jpg',
          bio: '',
        });
      }),
      http.post('/api/media/photo-upload', () => {
        return HttpResponse.json({
          image:
            'https://res.cloudinary.com/beer-app/image/upload/v1679246404/dev-content/va2w7ctmgqmueyu9vn9h.jpg',
        });
      }),
      http.post('/api/comments', () => {
        return new HttpResponse(null, {
          status: 204,
        });
      }),
    ],
  },
};
