import { DateValueType as LibraryDateValueType } from "react-tailwindcss-datepicker/dist/types";

export type DateType = Date | null;

export type DateRangeType = {
  startDate: DateType;
  endDate: DateType;
};

export type DateValueType = LibraryDateValueType;