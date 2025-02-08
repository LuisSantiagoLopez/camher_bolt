import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const button = cva(
  'p-8 lg:text-xl sm:text-md text-center font-light rounded-2xl min-w-[150px] w-[90%] sm:w-[30%]',
  {
    variants: {
      intent: {
        title: [
          'bg-black',
          'text-white',
          'hover:bg-slate-800',
          'lg:w-[35%]',
          'w-[90%]',
        ],
        regular: ['bg-black', 'text-white', 'hover:bg-slate-800', 'w-full'],
        green: [
          'bg-camhergreen',
          'text-black',
          'text-center',
          'rounded-full',
          'hover:bg-green-500', // Adjust hover color as needed
          'hover:text-gray-200',
        ],
        red: [
          'bg-camherred',
          'text-black',
          'text-center',
          'rounded-full',
          'hover:bg-red-500', // Adjust hover color as needed
          'hover:text-gray-200',
        ],
      },
      defaultVariants: {
        intent: 'regular',
      },
    },
  },
);
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  ...props
}) => (
  <button className={button({ intent, className })} {...props}>
    {props.children}
  </button>
);

export default Button;
