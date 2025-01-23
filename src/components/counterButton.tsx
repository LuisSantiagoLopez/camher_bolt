import React, { useState } from 'react';

interface NumberInputProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  title: string;
  onChange?: (value: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({
  initialValue = 1,
  min = 0,
  max = Infinity,
  step = 1,
  onChange,
  title,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleIncrement = () => {
    if (value + step <= max) {
      const newValue = value + step;
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const handleDecrement = () => {
    if (value - step >= min) {
      const newValue = value - step;
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="font-bold text-black">{title}</p>
      <div className=" rounded-md bg-camherdarkyellow px-2">
        <button className="" onClick={handleDecrement}>
          -
        </button>
        <span className="m-1">{value}</span>
        <button className="" onClick={handleIncrement}>
          +
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
