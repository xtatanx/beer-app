import { FloatingNode, useFloatingNodeId } from '@floating-ui/react';
import { useContext } from 'react';
import DropDownContext from './DropDownContext';
import type { DropDownToggleProps } from './types';

const DropDownToggle = ({ children }: DropDownToggleProps) => {
  const { reference, getReferenceProps } = useContext(DropDownContext);
  const nodeId = useFloatingNodeId();

  return (
    <FloatingNode id={nodeId}>
      <button ref={reference} {...getReferenceProps()}>
        {children}
      </button>
    </FloatingNode>
  );
};

export default DropDownToggle;
