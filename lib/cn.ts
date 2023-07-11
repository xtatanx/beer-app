import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const cn: typeof cva = (base, config) => {
  const classes = cva(base, config);

  return (props) => {
    return twMerge(classes(props));
  };
};

export default cn;
