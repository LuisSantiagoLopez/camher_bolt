import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const dropdown = cva("rounded-xl p-3", {
  variants: {
    intent: {
      regular: ["bg-white", "text-[#B3B2B2]"],
    },
  },
  defaultVariants: {
    intent: "regular",
  },
});

export interface DropdownProps
  // extends react select field props
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    // extends variant props
    VariantProps<typeof dropdown> {}

export const Dropdown: React.FC<DropdownProps> = ({
  className,
  intent,
  children,
  ...props
}) => (
  <div className="flex flex-col justify-start space-y-2">
        <label className="text-black text-bold text-lg" >{props.name}</label>
  <select className={dropdown({ intent, className })} {...props}>
    {children}
  </select>
  </div>
);

export default Dropdown;
