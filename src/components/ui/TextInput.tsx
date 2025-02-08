import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { FaLock } from 'react-icons/fa';

const input = cva('rounded-xl p-3 text-sm w-full flex-grow', {
  variants: {
    intent: {
      regular: ['bg-white', 'text-[#B3B2B2]'],
      error: ['bg-red-600', 'text-white'],
      long: ['bg-white', 'text-[#B3B2B2]'],
      disabled: ['bg-gray-300', 'text-gray-600', 'cursor-not-allowed'],
    },
  },
  defaultVariants: {
    intent: 'regular',
  },
});

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    VariantProps<typeof input> {}

export const Input: React.FC<InputProps> = ({
  className,
  intent,
  placeholder,
  ...props
}) => (
  <div className="flex flex-col justify-between space-y-2">
    <label className="text-lg font-bold text-black">{props.name}</label>
    {intent === 'long' ? (
      <textarea
        rows={4}
        className={input({ intent, className })}
        placeholder={placeholder}
        {...props}
      />
    ) : intent === 'disabled' ? (
      <div className="flex items-center">
        <input
          disabled
          className={input({ intent, className })}
          placeholder={placeholder}
          {...props}
        />
        <div className="pointer-events-none ml-2">
          <FaLock />
        </div>
      </div>
    ) : (
      <input
        className={input({ intent, className })}
        placeholder={placeholder}
        {...props}
      />
    )}
  </div>
);

export default Input;
