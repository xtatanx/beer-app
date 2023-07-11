import { createContext } from 'react';
import type { ContextType } from './types';

const DropDownContext = createContext<ContextType>(undefined!);

export default DropDownContext;
