// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Provider, Unit, Part, PartReq, MechanicReview, WorkOrder, FailureReport } = initSchema(schema);

export {
  Provider,
  Unit,
  Part,
  PartReq,
  MechanicReview,
  WorkOrder,
  FailureReport
};