import { CognitoUser } from '@aws-amplify/auth';
import { ModelPartConnection, ProviderT } from '@/graphql';

export interface PartReq {
    partDescription?: string[];
    price?: number;
    unitaryPrice?: number[];
    quantity?: number[];
    isCash?: boolean;
    isImportant?: boolean;
  }
  
  export interface MechanicReview {
    mechanic?: string;
  }
  
  export interface WorkOrder {
    jobToBeDone?: string;
    personInCharge?: string;
    sparePart?: string;
    observation?: string;
  }
  
  export interface FailureReport {
    problemLocation?: string;
    operator?: string;
    description?: string;
  }
  
  export interface InvoiceInfo {
    subTotal?: number;
    date?: string;
    number?: string;
  }
  
  export interface Administrador {
    id: string;
    emails?: string[];
    name?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Contador {
    id: string;
    emails?: string[];
    name?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Provider {
    id: string;
    emails?: (string | null)[] | null; // Updated to allow nulls within the array
    name?: string | null;
    Parts?: Part[] | null;
    createdAt: string; // Added as per GraphQL schema
    updatedAt: string; // Added as per GraphQL schema
  }
  
  export interface Unit {
    id: string;
    Parts?: Part[] | null;
    name?: string | null;
    createdAt: string; // Added as per GraphQL schema
    updatedAt: string; // Added as per GraphQL schema
  }
  
  export interface Part {
    id: string;
    unitID: string;
    Unit: Unit;
    providerID?: string | null;
    Provider?: Provider | null;
    tableID: string;
    Table: Table;
    status?: number | null;
    failureReport?: FailureReport | null;
    workOrder?: WorkOrder | null;
    mechanicReview?: MechanicReview | null;
    partReq?: PartReq | null;
    invoiceInfo?: InvoiceInfo | null;
    reqDate?: string | null;
    partApprovalImg?: string | null;
    counterRecieptImg?: string | null;
    invoiceImg?: string | null;
  }
  
  export interface Table {
    id: string;
    from: string;
    to: string;
    type: TableType;
    status: number;
    customFile?: string;
    Parts?: Part[];
    createdAt: string;
    updatedAt?: string;
  }
  
  export enum TableType {
    CURRENT = "CURRENT",
    HISTORY = "HISTORY",
  }
  
  export interface CardProps {
    type:
      | 'unit'
      | 'counter' // Counter Receipt
      | 'failure' // Failure Report (Taller)
      | 'admincard' // Admin Card (Both Flows)
      | 'receipt'
      | 'provider';
    data: Part;
    isAction?: boolean;
    handleClick?: () => void;
    handleBack?: () => void;
  }
  
  export interface StatusProps {
    status: number;
    range?: number;
    minRange?: number;
    tipo: 'counter' | 'failure' | 'admincard' | 'receipt';
  }
  
  export interface StatusPropsProvider {
    setPartID: React.Dispatch<React.SetStateAction<string | null>>;
    updatePrevTools: (tool: string) => void;
    email: string;
  }
  
  export interface StatusPropsTaller {
    status: number;
    range?: number;
    minRange?: number;
    tipo: 'unit' | 'counter' | 'failure';
    setPartID: React.Dispatch<React.SetStateAction<string>>;
    updatePrevTools: (tool: string) => void;
  }
  
  export interface TableT {
    id: string;
    from: string;
    to: string;
    type: TableType;
    status: number;
    customFile?: string;
    Parts?: Part[];
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface AuthScreenProps {
    updatePrevTools: (tool: string) => void;
  }
  
  export interface FlowContextType {
    flow: string;
    setFlow: (flow: string) => void;
    name: string;
    email: string;
  }
  
  export interface SelectedToolContextType {
    pastTools: string[];
    setPastTools: (tools: string[]) => void;
    selectedTool: string;
    setSelectedTool: (tool: string) => void;
  }
  
  export interface User extends CognitoUser {
    signInUserSession?: {
        idToken: {
            payload: {
                'cognito:groups': string[];
            };
        };
    };
  }
  
  export interface DateRangeType {
    startDate: Date;
    endDate: Date;
  }