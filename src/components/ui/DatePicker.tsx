import { DateValueType } from 'react-tailwindcss-datepicker/dist/types';
import { DateRangeType } from '@/types/datepickerTypes';
import React from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

type DatePickerProps = {
  value: DateRangeType;
  setValue: (value: DateRangeType) => void;  // Simplified type
  placeholder?: string;
  asSingle?: boolean;
};

export const DatePicker = ({
  value,
  setValue,
  placeholder,
  asSingle,
}: DatePickerProps) => {
  const handleChange = (newValue: DateValueType) => {
    if (!newValue) return;
    
    const convertedValue: DateRangeType = {
      startDate: newValue.startDate ? new Date(newValue.startDate) : null,
      endDate: newValue.endDate ? new Date(newValue.endDate) : null,
    };
    
    setValue(convertedValue);
  };

  return (
    <div className="mx-4 flex w-[80%] flex-col items-center justify-center md:w-[70%] lg:w-[40%]">
      <Datepicker
        value={{
          startDate: value.startDate || null,
          endDate: value.endDate || null
        }}
        onChange={handleChange}
        placeholder={placeholder ?? 'Fecha Inicio Tabla - Fecha Fin Tabla'}
        separator="-"
        showShortcuts={true}
        primaryColor="orange"
        maxDate={new Date()}
        asSingle={asSingle}
      />
    </div>
  );
};