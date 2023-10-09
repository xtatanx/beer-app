import { VariantProps } from 'class-variance-authority';
import React from 'react';
import type {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from '../../types/polymorphic-components';
import cn from '@/lib/cn';

const buttonClasses = cn(
  'rounded font-bold whitespace-nowrap disabled:bg-zinc-400 disabled:text-zinc-500 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: [
          'text-zinc-50',
          'bg-amber-300',
          'hover:bg-amber-400',
          'active:bg-amber-400',
        ],
        secondary: [
          'text-neutral-800',
          'bg-gray-300',
          'hover:bg-gray-400',
          'active:bg-gray-400',
        ],
      },
      size: {
        sm: ['py-1', 'px-4', 'text-sm'],
        md: ['py-2', 'px-6', 'text-base'],
        lg: ['py-3', 'px-8', 'text-lg'],
      },
      active: {
        isActive: [],
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        active: 'isActive',
        className: 'bg-amber-400',
      },
      {
        variant: 'secondary',
        active: 'isActive',
        className: 'bg-gray-400',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

type StyleProps = Omit<VariantProps<typeof buttonClasses>, 'active'>;

type ButtonProps<T extends React.ElementType> = PolymorphicComponentPropWithRef<
  T,
  {
    active?: boolean;
  } & StyleProps
>;

const Button = React.forwardRef(
  <T extends React.ElementType = 'button'>(
    { children, variant, size, active, as, ...rest }: ButtonProps<T>,
    ref?: PolymorphicRef<T>
  ) => {
    const Component = as || 'button';

    return (
      <Component
        ref={ref}
        className={buttonClasses({
          variant,
          size,
          active: active ? 'isActive' : null,
        })}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;
