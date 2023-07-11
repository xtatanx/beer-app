import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { Children, cloneElement, isValidElement, useContext } from 'react';
import DropDownContext from './DropDownContext';
import type { DropDownMenuProps } from './types';

const DropDownMenu = ({ children }: DropDownMenuProps) => {
  const {
    tree,
    floating,
    strategy,
    y,
    x,
    open,
    getFloatingProps,
    context,
    getItemProps,
    listItemsRef,
  } = useContext(DropDownContext);

  return (
    <FloatingPortal>
      {open && (
        <FloatingFocusManager
          context={context}
          initialFocus={0}
          visuallyHiddenDismiss
        >
          <ul
            className="border bg-white py-2 shadow-sm"
            ref={floating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
            }}
            {...getFloatingProps()}
          >
            {Children.map(children, (child, index) => {
              return (
                isValidElement(child) &&
                cloneElement(
                  child,
                  getItemProps({
                    role: 'menu',
                    onClick(event) {
                      child.props.onClick?.(event);
                      tree?.events.emit('click');
                    },
                    ref(node) {
                      if (node) {
                        listItemsRef.current[index] = node;
                      }
                    },
                  })
                )
              );
            })}
          </ul>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
};

export default DropDownMenu;
