import {
  autoUpdate,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingTree,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react';
import { useEffect, useRef, useState } from 'react';
import DropDownContext from './DropDownContext';
import type { DropDownProps } from './types';

const DropDownBase = ({ children }: DropDownProps) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listItemsRef = useRef<HTMLButtonElement[]>([]);
  const tree = useFloatingTree();

  const nodeId = useFloatingNodeId();
  const { reference, floating, x, y, strategy, isPositioned, context } =
    useFloating({
      nodeId,
      open,
      placement: 'bottom-end',
      whileElementsMounted: autoUpdate,
      onOpenChange: setOpen,
    });
  const click = useClick(context);
  const role = useRole(context, {
    role: 'menu',
  });
  const listNavigation = useListNavigation(context, {
    loop: true,
    activeIndex,
    onNavigate: setActiveIndex,
    listRef: listItemsRef,
  });
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, role, dismiss, listNavigation]
  );

  useEffect(() => {
    const handleTreeClick = () => {
      setOpen(false);
    };

    tree?.events.on('click', handleTreeClick);

    return () => {
      tree?.events.off('click', handleTreeClick);
    };
  }, [tree]);

  return (
    <DropDownContext.Provider
      value={{
        tree,
        reference,
        floating,
        x,
        y,
        strategy,
        isPositioned,
        open,
        getReferenceProps,
        getFloatingProps,
        getItemProps,
        listItemsRef,
        context,
      }}
    >
      {children}
    </DropDownContext.Provider>
  );
};

export default DropDownBase;
