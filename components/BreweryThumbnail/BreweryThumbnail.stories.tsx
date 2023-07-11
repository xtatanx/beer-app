import type { Meta } from '@storybook/react';
import BreweryThumbnail from './BreweryThumbnail';
import type { BreweryThumbnailProps } from '../../types/brewery';

const meta: Meta<typeof BreweryThumbnail> = {
  title: 'BreweryThumbnail',
  component: BreweryThumbnail,
  args: {
    id: '1234',
    profileImage: 'https://picsum.photos/id/30/400/400',
    beers: 1,
    rates: 10,
    name: 'Jabato Cerveceria',
    location: 'Bogota, Colombia',
    verified: true,
  },
};

const Template = (args: BreweryThumbnailProps) => (
  <div className="w-[300px]">
    <BreweryThumbnail {...args} />
  </div>
);

export const Default = Template.bind({});

export default meta;
