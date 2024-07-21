import {
  autoUpdate,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react';
import { useRouter } from 'next/router';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import useAutocomplete from '../../hooks/useAutocomplete';
import AutocompleteContext from './AutocompleteContext';
import AutocompleteMenu from './AutocompleteMenu';
import { Input } from '../Input';

type AutocompleteProps = {
  placeholder: string;
};

const Autocomplete = ({ placeholder }: AutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const { result } = useAutocomplete(searchTerm);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLElement[]>([]);
  const router = useRouter();
  const hints = useMemo(() => {
    if (result) {
      const res = [];
      if (result.beers.length > 0) {
        res.push({
          title: 'Cervezas',
          items: result.beers,
        });
      }

      if (result.breweries.length > 0) {
        res.push({
          title: 'Cervecerias',
          items: result.breweries,
        });
      }

      return res;
    }
  }, [result]);
  const flattenHints = useMemo(() => {
    if (result) {
      let flattenList = [];
      for (let section of Object.values(result)) {
        flattenList.push(...section);
      }

      return flattenList;
    }
  }, [result]);
  const { x, y, strategy, context, refs } = useFloating<HTMLInputElement>({
    open,
    onOpenChange(open) {
      if (hints) {
        setOpen(open);
      }
    },
    middleware: [
      offset(6),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [
      useRole(context, { role: 'listbox' }),
      useDismiss(context),
      useListNavigation(context, {
        listRef,
        activeIndex,
        onNavigate: setActiveIndex,
        virtual: true,
        loop: true,
        focusItemOnHover: false,
      }),
    ],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchTerm(value);
  };

  const handleClick = () => {
    if (hints) {
      setOpen(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!flattenHints) return;

    if (e.code === 'Enter' && activeIndex !== null) {
      const link =
        'brewery' in flattenHints[activeIndex]
          ? `/cervezas/${flattenHints[activeIndex]._id}`
          : `/cervecerias/${flattenHints[activeIndex]._id}`;

      router.push(link);
      setActiveIndex(null);
      setInputValue(flattenHints[activeIndex].name);
    } else if (e.code === 'Enter') {
      router.push({
        pathname: '/buscar/',
        query: {
          q: inputValue,
        },
      });
    }
  };

  useEffect(() => {
    setInputValue('');
    setActiveIndex(null);
    setOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    if (!flattenHints) return;

    if (activeIndex !== null) {
      setInputValue(flattenHints[activeIndex].name);
    }
  }, [activeIndex, flattenHints]);

  useEffect(() => {
    if (hints) {
      setOpen(true);
    }
  }, [hints]);

  return (
    <AutocompleteContext.Provider
      value={{
        getItemProps,
        listRef,
        setOpen,
        activeIndex,
        hints,
        setInputValue,
        refs,
      }}
    >
      <div className="relative flex items-center">
        <Input
          ref={refs.setReference}
          {...getReferenceProps({
            onChange: handleInputChange,
            onClick: handleClick,
            onKeyDown: handleKeyDown,
            value: inputValue,
            placeholder,
            'aria-autocomplete': 'list',
          })}
          className="pl-10"
          type="text"
        ></Input>
        <div className="absolute left-0 flex aspect-square h-full items-center justify-center text-gray-600">
          <MdSearch></MdSearch>
        </div>
      </div>
      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            initialFocus={-1}
            visuallyHiddenDismiss
          >
            <div
              ref={refs.setFloating}
              {...getFloatingProps({
                style: {
                  position: strategy,
                  left: x ?? 0,
                  top: y ?? 0,
                  overflow: 'auto',
                },
              })}
              className="rounded border bg-background shadow-sm"
            >
              <AutocompleteMenu></AutocompleteMenu>
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </AutocompleteContext.Provider>
  );
};

export default Autocomplete;
