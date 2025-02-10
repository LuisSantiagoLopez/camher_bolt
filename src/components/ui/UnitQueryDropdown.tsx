import React from 'react';
import { Unit } from '@/types/database';

interface UnitQueryDropdownProps {
  options: Unit[];
  setOption: React.Dispatch<React.SetStateAction<Unit | undefined>>;
  className?: string;
  placeholder?: string;
}

const UnitQueryDropdown: React.FC<UnitQueryDropdownProps> = ({
  options,
  setOption,
  className,
  placeholder,
}) => {
  return (
    <select
      className={`h-12 w-44 my-2 rounded-xl pl-4 text-neutral-400 ${className}`}
      onChange={(e) =>
        setOption(options.find((unit: Unit) => unit?.id === e.target.value))
      }
    >
      <option>{placeholder}</option>
      {options.map((unit: Unit) => (
        <option key={unit?.id} value={unit?.id}>
          {unit?.name}
        </option>
      ))}
    </select>
  );
};

export default UnitQueryDropdown;
