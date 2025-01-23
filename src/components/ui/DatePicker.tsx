import { DateRangeType, DateValueType } from '@/types/datepickerTypes';
import React from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

type DatePickerProps = {
  value: DateRangeType | null;
  setValue: React.Dispatch<React.SetStateAction<DateRangeType>>;
  placeholder?: string;
  asSingle?: boolean;
};

export const DatePicker = ({
  value,
  setValue,
  placeholder,
  asSingle,
}: DatePickerProps) => {
  const handleValueChange = (newValue: DateValueType) => {
    if (newValue && 'startDate' in newValue && 'endDate' in newValue) {
      setValue(newValue as DateRangeType);
    }
  };
  return (
    <div className="mx-4 flex w-[80%] flex-col items-center justify-center md:w-[70%] lg:w-[40%]">
      <Datepicker
        value={value}
        placeholder={
          placeholder ? placeholder : 'Fecha Inicio Tabla - Fecha Fin Tabla'
        }
        separator={'-'}
        showShortcuts={true}
        onChange={handleValueChange}
        primaryColor={'orange'}
        maxDate={new Date()}
        asSingle={asSingle ? true : false}
      />
    </div>
  );
};
