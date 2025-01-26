import { DateValueType } from 'react-tailwindcss-datepicker/dist/types';
import React from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

type DatePickerProps = {
  value: DateValueType;
  setValue: (value: DateValueType) => void;
  placeholder?: string;
  asSingle?: boolean;
};

export const DatePicker = ({
  value,
  setValue,
  placeholder,
  asSingle,
}: DatePickerProps) => {
  return (
    <div className="mx-4 flex w-[80%] flex-col items-center justify-center md:w-[70%] lg:w-[40%]">
      <Datepicker
        value={value}
        onChange={setValue}
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