import { forwardRef, Ref } from 'react';
import type { DropDownMenuItemProps } from './types';

const DropDownMenuItem = (
  { children, ...props }: DropDownMenuItemProps,
  ref: Ref<HTMLButtonElement>
) => {
  return (
    <li>
      <button
        className="block h-full w-full px-4 py-2 text-left hover:bg-gray-200 focus-visible:bg-gray-200"
        {...props}
        ref={ref}
      >
        {children}
      </button>
    </li>
  );
};

export default forwardRef(DropDownMenuItem);
