import { DeepOmit } from './DeepOmit';
import {
  GetPartQuery,
  GetProviderQuery,
  GetUnitQuery,
  GetTableQuery,
} from './API';

export type ProviderT = DeepOmit<
  Exclude<GetProviderQuery['getProvider'], null>,
  '__typename'
>;

export type PartT = DeepOmit<
  Exclude<GetPartQuery['getPart'], null>,
  '__typename'
>;
export type UnitT = DeepOmit<
  Exclude<GetUnitQuery['getUnit'], null>,
  '__typename'
>;

export type TableT = DeepOmit<
  Exclude<GetTableQuery['getTable'], null>,
  '__typename'
>;
 