// ProviderQueryDropdown.tsx

import React from 'react';
import { ProviderT } from '@/graphql';

interface ProviderQueryDropdownProps {
  options: ProviderT[];  // or some narrower interface if needed
  setOption: React.Dispatch<React.SetStateAction<ProviderT | undefined>>;
  className?: string;
  placeholder?: string;
}

const ProviderQueryDropdown: React.FC<ProviderQueryDropdownProps> = ({
  options,
  setOption,
  className = '',
  placeholder = 'Seleccionar proveedor...',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedProvider = options.find((provider) => provider && provider.id === selectedId);
    setOption(selectedProvider || undefined);
  };

  return (
    <select
      className={`h-12 w-72 rounded-xl pl-4 text-neutral-400 ${className}`}
      onChange={handleChange}
      defaultValue=""
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((provider) => 
        provider ? (
          <option key={provider.id} value={provider.id}>
            {provider.name || 'Sin Nombre'}
          </option>
        ) : null
      )}
    </select>
  );
};

export default ProviderQueryDropdown;
