export type DateType = Date | string | null;

export type DateRangeType = {
  startDate: DateType;
  endDate: DateType;
};

export type DateValueType = DateRangeType | null;