import { FloatingTreeType, UseFloatingReturn } from '@floating-ui/react';
import React, {
  ButtonHTMLAttributes,
  HTMLProps,
  MutableRefObject,
  ReactNode,
} from 'react';
import DropDownMenu from './DropDownMenu';
import DropDownMenuItem from './DropDownMenuItem';
import DropDownToggle from './DropDownToggle';

export type DropDownProps = {
  children: ReactNode;
};

export type DropDownToggleProps = {
  children: ReactNode;
};

export type DropDownMenuProps = {
  children: ReactNode;
};

export interface DropDownMenuItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export type ContextType = Pick<
  UseFloatingReturn,
  'floating' | 'reference' | 'x' | 'y' | 'strategy' | 'isPositioned' | 'context'
> & {
  open: Boolean;
  listItemsRef: MutableRefObject<HTMLElement[]>;
  getFloatingProps: (
    userProps?: HTMLProps<HTMLElement> | undefined
  ) => Record<string, unknown>;
  getItemProps: (
    userProps?: HTMLProps<HTMLElement> | undefined
  ) => Record<string, unknown>;
  getReferenceProps: (
    userProps?: HTMLProps<Element> | undefined
  ) => Record<string, unknown>;
  tree: FloatingTreeType | null;
};

export type DropDownComponent<P = {}> = React.FC<P> & {
  Menu: typeof DropDownMenu;
  MenuItem: typeof DropDownMenuItem;
  Toggle: typeof DropDownToggle;
};
