import React from 'react';
import { ProviderT as Provider } from '@/graphql';

interface ProviderQueryDropdownProps {
  options: Provider[];
  setOption: (provider: Provider | undefined) => void;
  className?: string;
  placeholder?: string;
  isLoading?: boolean;
  error?: Error | null;
}

const ProviderQueryDropdown: React.FC<ProviderQueryDropdownProps> = ({
  options,
  setOption,
  className,
  placeholder,
  isLoading,
  error
}) => {
  if (error) {
    return <div className="text-red-500">{error.message}</div>;
  }

  if (isLoading) {
    return <div className="loading-spinner">Loading providers...</div>;
  }

  return (
    <select
      className={`h-12 w-44 rounded-xl pl-4 ${className}`}
      onChange={(e) => {
        const selected = options.find(p => p?.id === e.target.value);
        setOption(selected);
      }}
      disabled={isLoading || !!error}
    >
      <option value="">{placeholder}</option>
      {options.map((provider) => (
        <option key={provider?.id} value={provider?.id}>
          {provider?.name || 'Unnamed Provider'}
        </option>
      ))}
    </select>
  );
};

export default ProviderQueryDropdown;
