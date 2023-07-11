import { FloatingTree, useFloatingParentNodeId } from '@floating-ui/react';
import DropDownBase from './DropDownBase';
import type { DropDownComponent, DropDownProps } from './types';

const DropDown = (props: DropDownProps) => {
  const parentId = useFloatingParentNodeId();

  if (parentId === null) {
    return (
      <FloatingTree>
        <DropDownBase {...props} />
      </FloatingTree>
    );
  }
};

export default DropDown as DropDownComponent<DropDownProps>;
