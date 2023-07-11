import type { Meta } from '@storybook/react';
import Autocomplete from '../Autocomplete';

const meta: Meta<typeof Autocomplete> = {
  title: 'Autocomplete',
  component: Autocomplete,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[380px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

const hints = [
  {
    title: 'Beers',
    items: [
      { title: 'beer1' },
      { title: 'beer2' },
      { title: 'beer3' },
      { title: 'beer4' },
    ],
  },
  {
    title: 'Breweries',
    items: [
      { title: 'brewery1' },
      { title: 'brewery2' },
      { title: 'brewery3' },
      { title: 'brewery4' },
    ],
  },
];

export const Default = () => {
  return (
    <>
      <Autocomplete placeholder="Buscar aca"></Autocomplete>
    </>
  );
};
