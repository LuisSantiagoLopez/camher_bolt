import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";



type EagerPartReq = {
  readonly partDescription?: string | null;
  readonly price?: number | null;
  readonly isCash?: boolean | null;
  readonly isImportant?: boolean | null;
}

type LazyPartReq = {
  readonly partDescription?: string | null;
  readonly price?: number | null;
  readonly isCash?: boolean | null;
  readonly isImportant?: boolean | null;
}

export declare type PartReq = LazyLoading extends LazyLoadingDisabled ? EagerPartReq : LazyPartReq

export declare const PartReq: (new (init: ModelInit<PartReq>) => PartReq)

type EagerMechanicReview = {
  readonly mechanic?: string | null;
}

type LazyMechanicReview = {
  readonly mechanic?: string | null;
}

export declare type MechanicReview = LazyLoading extends LazyLoadingDisabled ? EagerMechanicReview : LazyMechanicReview

export declare const MechanicReview: (new (init: ModelInit<MechanicReview>) => MechanicReview)

type EagerWorkOrder = {
  readonly jobToBeDone?: string | null;
  readonly personInCharge?: string | null;
  readonly sparePart?: string | null;
  readonly observation?: string | null;
}

type LazyWorkOrder = {
  readonly jobToBeDone?: string | null;
  readonly personInCharge?: string | null;
  readonly sparePart?: string | null;
  readonly observation?: string | null;
}

export declare type WorkOrder = LazyLoading extends LazyLoadingDisabled ? EagerWorkOrder : LazyWorkOrder

export declare const WorkOrder: (new (init: ModelInit<WorkOrder>) => WorkOrder)

type EagerFailureReport = {
  readonly problemLocation?: string | null;
  readonly operator?: string | null;
  readonly description?: string | null;
}

type LazyFailureReport = {
  readonly problemLocation?: string | null;
  readonly operator?: string | null;
  readonly description?: string | null;
}

export declare type FailureReport = LazyLoading extends LazyLoadingDisabled ? EagerFailureReport : LazyFailureReport

export declare const FailureReport: (new (init: ModelInit<FailureReport>) => FailureReport)

type EagerProvider = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Provider, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email?: string | null;
  readonly name?: string | null;
  readonly Parts?: (Part | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyProvider = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Provider, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email?: string | null;
  readonly name?: string | null;
  readonly Parts: AsyncCollection<Part>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Provider = LazyLoading extends LazyLoadingDisabled ? EagerProvider : LazyProvider

export declare const Provider: (new (init: ModelInit<Provider>) => Provider) & {
  copyOf(source: Provider, mutator: (draft: MutableModel<Provider>) => MutableModel<Provider> | void): Provider;
}

type EagerUnit = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Unit, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Parts?: (Part | null)[] | null;
  readonly name?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUnit = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Unit, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Parts: AsyncCollection<Part>;
  readonly name?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Unit = LazyLoading extends LazyLoadingDisabled ? EagerUnit : LazyUnit

export declare const Unit: (new (init: ModelInit<Unit>) => Unit) & {
  copyOf(source: Unit, mutator: (draft: MutableModel<Unit>) => MutableModel<Unit> | void): Unit;
}

type EagerPart = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Part, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly unitID: string;
  readonly Unit: Unit;
  readonly providerID?: string | null;
  readonly status?: number | null;
  readonly failureReport?: FailureReport | null;
  readonly workOrder?: WorkOrder | null;
  readonly mechanicReview?: MechanicReview | null;
  readonly partReq?: PartReq | null;
  readonly reqDate?: string | null;
  readonly partApprovalImg?: string | null;
  readonly counterRecieptImg?: string | null;
  readonly Provider?: Provider | null;
  readonly invoiceImg?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPart = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Part, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly unitID: string;
  readonly Unit: AsyncItem<Unit>;
  readonly providerID?: string | null;
  readonly status?: number | null;
  readonly failureReport?: FailureReport | null;
  readonly workOrder?: WorkOrder | null;
  readonly mechanicReview?: MechanicReview | null;
  readonly partReq?: PartReq | null;
  readonly reqDate?: string | null;
  readonly partApprovalImg?: string | null;
  readonly counterRecieptImg?: string | null;
  readonly Provider: AsyncItem<Provider | undefined>;
  readonly invoiceImg?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Part = LazyLoading extends LazyLoadingDisabled ? EagerPart : LazyPart

export declare const Part: (new (init: ModelInit<Part>) => Part) & {
  copyOf(source: Part, mutator: (draft: MutableModel<Part>) => MutableModel<Part> | void): Part;
}