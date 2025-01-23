export type DateType = string | null | Date;
export type DateValueType = DateRangeType | null;
export type DateRangeType = {
  startDate: DateType;
  endDate: DateType;
};
