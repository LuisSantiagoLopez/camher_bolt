import React from 'react';
import { ProviderT as Provider } from '@/graphql';

interface ProviderQueryDropdownProps {
  options: Provider[];
  setOption: React.Dispatch<React.SetStateAction<Provider | undefined>>;
  className?: string;
  placeholder?: string;
}

const ProviderQueryDropdown: React.FC<ProviderQueryDropdownProps> = ({
  options,
  setOption,
  className,
  placeholder,
}) => {
  return (
    <select
      className={`h-12 w-44 rounded-xl pl-4 text-neutral-400 ${className}`}
      onChange={(e) =>
        setOption(
          options.find((provider: Provider) => provider?.id === e.target.value),
        )
      }
    >
      <option>{placeholder}</option>
      {options.map((provider: Provider) => (
        <option key={provider?.id} value={provider?.id}>
          {provider?.name}
        </option>
      ))}
    </select>
  );
};

export default ProviderQueryDropdown;
