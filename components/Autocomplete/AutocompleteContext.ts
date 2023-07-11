import type { ExtendedRefs } from '@floating-ui/react';
import type { HTMLProps, MutableRefObject } from 'react';
import { createContext, Dispatch, SetStateAction } from 'react';
import type { BeerResponse, BreweryResponse } from '../../types/autocomplete';

export type AutocompleteContext = {
  getItemProps: (
    userProps?: HTMLProps<HTMLElement> | undefined
  ) => Record<string, unknown>;
  listRef: MutableRefObject<HTMLElement[]>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  activeIndex: number | null;
  hints:
    | (
        | {
            title: string;
            items: BeerResponse[];
          }
        | {
            title: string;
            items: BreweryResponse[];
          }
      )[]
    | undefined;
  setInputValue: Dispatch<SetStateAction<string>>;
  refs: ExtendedRefs<HTMLInputElement>;
};

const AutocompleteContext = createContext<AutocompleteContext>(undefined!);

export default AutocompleteContext;
