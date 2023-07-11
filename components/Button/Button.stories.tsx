import type { Meta } from '@storybook/react';
import { useRef } from 'react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
};

const variants = [
  {
    size: 'sm',
  },
  {
    size: 'md',
  },
  {
    size: 'lg',
  },
  {
    active: true,
  },
  {
    disabled: true,
  },
];

export const Primary = () => {
  return (
    <div className="space-y-3">
      {variants.map((variant, index) => {
        return (
          <div key={index}>
            <Button variant="primary" {...variant}>
              Click Me
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export const Secondary = () => {
  return (
    <div className="space-y-3">
      {variants.map((variant, index) => {
        return (
          <div key={index}>
            <Button variant="secondary" {...variant}>
              Click Me
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export const Polymorphic = () => {
  return (
    <Button
      as="button"
      type="submit"
      href="wwww.google.com"
      target="_blank"
      rel="norel"
    >
      Click me
    </Button>
  );
};

export const PolymorphicRef = () => {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <Button as="div" ref={ref}>
      Click me
    </Button>
  );
};

export default meta;
