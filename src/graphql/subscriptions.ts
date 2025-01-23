/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateAdministrador = /* GraphQL */ `subscription OnCreateAdministrador(
  $filter: ModelSubscriptionAdministradorFilterInput
) {
  onCreateAdministrador(filter: $filter) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateAdministradorSubscriptionVariables,
  APITypes.OnCreateAdministradorSubscription
>;
export const onUpdateAdministrador = /* GraphQL */ `subscription OnUpdateAdministrador(
  $filter: ModelSubscriptionAdministradorFilterInput
) {
  onUpdateAdministrador(filter: $filter) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateAdministradorSubscriptionVariables,
  APITypes.OnUpdateAdministradorSubscription
>;
export const onDeleteAdministrador = /* GraphQL */ `subscription OnDeleteAdministrador(
  $filter: ModelSubscriptionAdministradorFilterInput
) {
  onDeleteAdministrador(filter: $filter) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteAdministradorSubscriptionVariables,
  APITypes.OnDeleteAdministradorSubscription
>;
export const onCreateContador = /* GraphQL */ `subscription OnCreateContador($filter: ModelSubscriptionContadorFilterInput) {
  onCreateContador(filter: $filter) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateContadorSubscriptionVariables,
  APITypes.OnCreateContadorSubscription
>;
export const onUpdateContador = /* GraphQL */ `subscription OnUpdateContador($filter: ModelSubscriptionContadorFilterInput) {
  onUpdateContador(filter: $filter) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateContadorSubscriptionVariables,
  APITypes.OnUpdateContadorSubscription
>;
export const onDeleteContador = /* GraphQL */ `subscription OnDeleteContador($filter: ModelSubscriptionContadorFilterInput) {
  onDeleteContador(filter: $filter) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteContadorSubscriptionVariables,
  APITypes.OnDeleteContadorSubscription
>;
export const onCreateProvider = /* GraphQL */ `subscription OnCreateProvider($filter: ModelSubscriptionProviderFilterInput) {
  onCreateProvider(filter: $filter) {
    id
    emails
    name
    Parts {
      items {
        id
        unitID
        Unit {
          id
          Parts {
            nextToken
            __typename
          }
          name
          createdAt
          updatedAt
          __typename
        }
        providerID
        Provider {
          id
          emails
          name
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        tableID
        Table {
          id
          from
          to
          type
          status
          customFile
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        status
        failureReport {
          problemLocation
          operator
          description
          __typename
        }
        workOrder {
          jobToBeDone
          personInCharge
          sparePart
          observation
          __typename
        }
        mechanicReview {
          mechanic
          __typename
        }
        partReq {
          partDescription
          price
          unitaryPrice
          quantity
          isCash
          isImportant
          __typename
        }
        invoiceInfo {
          subTotal
          date
          number
          __typename
        }
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateProviderSubscriptionVariables,
  APITypes.OnCreateProviderSubscription
>;
export const onUpdateProvider = /* GraphQL */ `subscription OnUpdateProvider($filter: ModelSubscriptionProviderFilterInput) {
  onUpdateProvider(filter: $filter) {
    id
    emails
    name
    Parts {
      items {
        id
        unitID
        Unit {
          id
          Parts {
            nextToken
            __typename
          }
          name
          createdAt
          updatedAt
          __typename
        }
        providerID
        Provider {
          id
          emails
          name
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        tableID
        Table {
          id
          from
          to
          type
          status
          customFile
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        status
        failureReport {
          problemLocation
          operator
          description
          __typename
        }
        workOrder {
          jobToBeDone
          personInCharge
          sparePart
          observation
          __typename
        }
        mechanicReview {
          mechanic
          __typename
        }
        partReq {
          partDescription
          price
          unitaryPrice
          quantity
          isCash
          isImportant
          __typename
        }
        invoiceInfo {
          subTotal
          date
          number
          __typename
        }
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateProviderSubscriptionVariables,
  APITypes.OnUpdateProviderSubscription
>;
export const onDeleteProvider = /* GraphQL */ `subscription OnDeleteProvider($filter: ModelSubscriptionProviderFilterInput) {
  onDeleteProvider(filter: $filter) {
    id
    emails
    name
    Parts {
      items {
        id
        unitID
        Unit {
          id
          Parts {
            nextToken
            __typename
          }
          name
          createdAt
          updatedAt
          __typename
        }
        providerID
        Provider {
          id
          emails
          name
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        tableID
        Table {
          id
          from
          to
          type
          status
          customFile
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        status
        failureReport {
          problemLocation
          operator
          description
          __typename
        }
        workOrder {
          jobToBeDone
          personInCharge
          sparePart
          observation
          __typename
        }
        mechanicReview {
          mechanic
          __typename
        }
        partReq {
          partDescription
          price
          unitaryPrice
          quantity
          isCash
          isImportant
          __typename
        }
        invoiceInfo {
          subTotal
          date
          number
          __typename
        }
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteProviderSubscriptionVariables,
  APITypes.OnDeleteProviderSubscription
>;
export const onCreateUnit = /* GraphQL */ `subscription OnCreateUnit($filter: ModelSubscriptionUnitFilterInput) {
  onCreateUnit(filter: $filter) {
    id
    Parts {
      items {
        id
        unitID
        Unit {
          id
          Parts {
            nextToken
            __typename
          }
          name
          createdAt
          updatedAt
          __typename
        }
        providerID
        Provider {
          id
          emails
          name
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        tableID
        Table {
          id
          from
          to
          type
          status
          customFile
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        status
        failureReport {
          problemLocation
          operator
          description
          __typename
        }
        workOrder {
          jobToBeDone
          personInCharge
          sparePart
          observation
          __typename
        }
        mechanicReview {
          mechanic
          __typename
        }
        partReq {
          partDescription
          price
          unitaryPrice
          quantity
          isCash
          isImportant
          __typename
        }
        invoiceInfo {
          subTotal
          date
          number
          __typename
        }
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUnitSubscriptionVariables,
  APITypes.OnCreateUnitSubscription
>;
export const onUpdateUnit = /* GraphQL */ `subscription OnUpdateUnit($filter: ModelSubscriptionUnitFilterInput) {
  onUpdateUnit(filter: $filter) {
    id
    Parts {
      items {
        id
        unitID
        Unit {
          id
          Parts {
            nextToken
            __typename
          }
          name
          createdAt
          updatedAt
          __typename
        }
        providerID
        Provider {
          id
          emails
          name
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        tableID
        Table {
          id
          from
          to
          type
          status
          customFile
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        status
        failureReport {
          problemLocation
          operator
          description
          __typename
        }
        workOrder {
          jobToBeDone
          personInCharge
          sparePart
          observation
          __typename
        }
        mechanicReview {
          mechanic
          __typename
        }
        partReq {
          partDescription
          price
          unitaryPrice
          quantity
          isCash
          isImportant
          __typename
        }
        invoiceInfo {
          subTotal
          date
          number
          __typename
        }
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUnitSubscriptionVariables,
  APITypes.OnUpdateUnitSubscription
>;
export const onDeleteUnit = /* GraphQL */ `subscription OnDeleteUnit($filter: ModelSubscriptionUnitFilterInput) {
  onDeleteUnit(filter: $filter) {
    id
    Parts {
      items {
        id
        unitID
        Unit {
          id
          Parts {
            nextToken
            __typename
          }
          name
          createdAt
          updatedAt
          __typename
        }
        providerID
        Provider {
          id
          emails
          name
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        tableID
        Table {
          id
          from
          to
          type
          status
          customFile
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        status
        failureReport {
          problemLocation
          operator
          description
          __typename
        }
        workOrder {
          jobToBeDone
          personInCharge
          sparePart
          observation
          __typename
        }
        mechanicReview {
          mechanic
          __typename
        }
        partReq {
          partDescription
          price
          unitaryPrice
          quantity
          isCash
          isImportant
          __typename
        }
        invoiceInfo {
          subTotal
          date
          number
          __typename
        }
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUnitSubscriptionVariables,
  APITypes.OnDeleteUnitSubscription
>;
export const onCreatePart = /* GraphQL */ `subscription OnCreatePart($filter: ModelSubscriptionPartFilterInput) {
  onCreatePart(filter: $filter) {
    id
    unitID
    Unit {
      id
      Parts {
        items {
          id
          unitID
          Unit {
            id
            name
            createdAt
            updatedAt
            __typename
          }
          providerID
          Provider {
            id
            emails
            name
            createdAt
            updatedAt
            __typename
          }
          tableID
          Table {
            id
            from
            to
            type
            status
            customFile
            createdAt
            updatedAt
            __typename
          }
          status
          failureReport {
            problemLocation
            operator
            description
            __typename
          }
          workOrder {
            jobToBeDone
            personInCharge
            sparePart
            observation
            __typename
          }
          mechanicReview {
            mechanic
            __typename
          }
          partReq {
            partDescription
            price
            unitaryPrice
            quantity
            isCash
            isImportant
            __typename
          }
          invoiceInfo {
            subTotal
            date
            number
            __typename
          }
          reqDate
          partApprovalImg
          counterRecieptImg
          invoiceImg
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      name
      createdAt
      updatedAt
      __typename
    }
    providerID
    Provider {
      id
      emails
      name
      Parts {
        items {
          id
          unitID
          Unit {
            id
            name
            createdAt
            updatedAt
            __typename
          }
          providerID
          Provider {
            id
            emails
            name
            createdAt
            updatedAt
            __typename
          }
          tableID
          Table {
            id
            from
            to
            type
            status
            customFile
            createdAt
            updatedAt
            __typename
          }
          status
          failureReport {
            problemLocation
            operator
            description
            __typename
          }
          workOrder {
            jobToBeDone
            personInCharge
            sparePart
            observation
            __typename
          }
          mechanicReview {
            mechanic
            __typename
          }
          partReq {
            partDescription
            price
            unitaryPrice
            quantity
            isCash
            isImportant
            __typename
          }
          invoiceInfo {
            subTotal
            date
            number
            __typename
          }
          reqDate
          partApprovalImg
          counterRecieptImg
          invoiceImg
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
    tableID
    Table {
      id
      from
      to
      type
      status
      customFile
      Parts {
        items {
          id
          unitID
          Unit {
            id
            name
            createdAt
            updatedAt
            __typename
          }
          providerID
          Provider {
            id
            emails
            name
            createdAt
            updatedAt
            __typename
          }
          tableID
          Table {
            id
            from
            to
            type
            status
            customFile
            createdAt
            updatedAt
            __typename
          }
          status
          failureReport {
            problemLocation
            operator
            description
            __typename
          }
          workOrder {
            jobToBeDone
            personInCharge
            sparePart
            observation
            __typename
          }
          mechanicReview {
            mechanic
            __typename
          }
          partReq {
            partDescription
            price
            unitaryPrice
            quantity
            isCash
            isImportant
            __typename
          }
          invoiceInfo {
            subTotal
            date
            number
            __typename
          }
          reqDate
          partApprovalImg
          counterRecieptImg
          invoiceImg
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
    status
    failureReport {
      problemLocation
      operator
      description
      __typename
    }
    workOrder {
      jobToBeDone
      personInCharge
      sparePart
      observation
      __typename
    }
    mechanicReview {
      mechanic
      __typename
    }
    partReq {
      partDescription
      price
      unitaryPrice
      quantity
      isCash
      isImportant
      __typename
    }
    invoiceInfo {
      subTotal
      date
      number
      __typename
    }
    reqDate
    partApprovalImg
    counterRecieptImg
    invoiceImg
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePartSubscriptionVariables,
  APITypes.OnCreatePartSubscription
>;
export const onUpdatePart = /* GraphQL */ `subscription OnUpdatePart($filter: ModelSubscriptionPartFilterInput) {
  onUpdatePart(filter: $filter) {
    id
    unitID
    Unit {
      id
      Parts {
        items {
          id
          unitID
          Unit {
            id
            name
            createdAt
            updatedAt
            __typename
          }
          providerID
          Provider {
            id
            emails
            name
            createdAt
            updatedAt
            __typename
          }
          tableID
          Table {
            id
            from
            to
            type
            status
            customFile
            createdAt
            updatedAt
            __typename
          }
          status
          failureReport {
            problemLocation
            operator
            description
            __typename
          }
          workOrder {
            jobToBeDone
            personInCharge
            sparePart
            observation
            __typename
          }
          mechanicReview {
            mechanic
            __typename
          }
          partReq {
            partDescription
            price
            unitaryPrice
            quantity
            isCash
            isImportant
            __typename
          }
          invoiceInfo {
            subTotal
            date
            number
            __typename
          }
          reqDate
          partApprovalImg
          counterRecieptImg
          invoiceImg
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      name
      createdAt
      updatedAt
      __typename
    }
    providerID
    Provider {
      id
      emails
      name
      Parts {
        items {
          id
          unitID
          Unit {
            id
            name
            createdAt
            updatedAt
            __typename
          }
          providerID
          Provider {
            id
            emails
            name
            createdAt
            updatedAt
            __typename
          }
          tableID
          Table {
            id
            from
            to
            type
            status
            customFile
            createdAt
            updatedAt
            __typename
          }
          status
          failureReport {
            problemLocation
            operator
            description
            __typename
          }
          workOrder {
            jobToBeDone
            personInCharge
            sparePart
            observation
            __typename
          }
          mechanicReview {
            mechanic
            __typename
          }
          partReq {
            partDescription
            price
            unitaryPrice
            quantity
            isCash
            isImportant
            __typename
          }
          invoiceInfo {
            subTotal
            date
            number
            __typename
          }
          reqDate
          partApprovalImg
          counterRecieptImg
          invoiceImg
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
    tableID
    Table {
      id
      from
      to
      type
      status
      customFile
      Parts {
        items {
          id
          unitID
          Unit {
            id
            name
            createdAt
            updatedAt
            __typename
          }
          providerID
          Provider {
            id
            emails
            name
            createdAt
            updatedAt
            __typename
          }
          tableID
          Table {
            id
            from
            to
            type
            status
            customFile
            createdAt
            updatedAt
            __typename
          }
          status
          failureReport {
            problemLocation
            operator
            description
            __typename
          }
          workOrder {
            jobToBeDone
            personInCharge
            sparePart
            observation
            __typename
          }
          mechanicReview {
            mechanic
            __typename
          }
          partReq {
            partDescription
            price
            unitaryPrice
            quantity
            isCash
            isImportant
            __typename
          }
          invoiceInfo {
            subTotal
            date
            number
            __typename
          }
          reqDate
          partApprovalImg
          counterRecieptImg
          invoiceImg
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
    status
    failureReport {
      problemLocation
      operator
      description
      __typename
    }
    workOrder {
      jobToBeDone
      personInCharge
      sparePart
      observation
      __typename
    }
    mechanicReview {
      mechanic
      __typename
    }
    partReq {
      partDescription
      price
      unitaryPrice
      quantity
      isCash
      isImportant
      __typename
    }
    invoiceInfo {
      subTotal
      date
      number
      __typename
    }
    reqDate
    partApprovalImg
    counterRecieptImg
    invoiceImg
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePartSubscriptionVariables,
  APITypes.OnUpdatePartSubscription
>;
export const onDeletePart = /* GraphQL */ `subscription OnDeletePart($filter: ModelSubscriptionPartFilterInput) {
  onDeletePart(filter: $filter) {
    id
    unitID
    Unit {
      id
      Parts {
        items {
          id
          unitID
          Unit {
            id
            name
            createdAt
            updatedAt
            __typename
          }
          providerID
          Provider {
            id
            emails
            name
            createdAt
            updatedAt
            __typename
          }
          tableID
          Table {
            id
            from
            to
            type
            status
            customFile
            createdAt
            updatedAt
            __typename
          }
          status
          failureReport {
            problemLocation
            operator
            description
            __typename
          }
          workOrder {
            jobToBeDone
            personInCharge
            sparePart
            observation
            __typename
          }
          mechanicReview {
            mechanic
            __typename
          }
          partReq {
            partDescription
            price
            unitaryPrice
            quantity
            isCash
            isImportant
            __typename
          }
          invoiceInfo {
            subTotal
            date
            number
            __typename
          }
          reqDate
          partApprovalImg
          counterRecieptImg
          invoiceImg
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      name
      createdAt
      updatedAt
      __typename
    }
    providerID
    Provider {
      id
      emails
      name
      Parts {
        items {
          id
          unitID
          Unit {
            id
            name
            createdAt
            updatedAt
            __typename
          }
          providerID
          Provider {
            id
            emails
            name
            createdAt
            updatedAt
            __typename
          }
          tableID
          Table {
            id
            from
            to
            type
            status
            customFile
            createdAt
            updatedAt
            __typename
          }
          status
          failureReport {
            problemLocation
            operator
            description
            __typename
          }
          workOrder {
            jobToBeDone
            personInCharge
            sparePart
            observation
            __typename
          }
          mechanicReview {
            mechanic
            __typename
          }
          partReq {
            partDescription
            price
            unitaryPrice
            quantity
            isCash
            isImportant
            __typename
          }
          invoiceInfo {
            subTotal
            date
            number
            __typename
          }
          reqDate
          partApprovalImg
          counterRecieptImg
          invoiceImg
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
    tableID
    Table {
      id
      from
      to
      type
      status
      customFile
      Parts {
        items {
          id
          unitID
          Unit {
            id
            name
            createdAt
            updatedAt
            __typename
          }
          providerID
          Provider {
            id
            emails
            name
            createdAt
            updatedAt
            __typename
          }
          tableID
          Table {
            id
            from
            to
            type
            status
            customFile
            createdAt
            updatedAt
            __typename
          }
          status
          failureReport {
            problemLocation
            operator
            description
            __typename
          }
          workOrder {
            jobToBeDone
            personInCharge
            sparePart
            observation
            __typename
          }
          mechanicReview {
            mechanic
            __typename
          }
          partReq {
            partDescription
            price
            unitaryPrice
            quantity
            isCash
            isImportant
            __typename
          }
          invoiceInfo {
            subTotal
            date
            number
            __typename
          }
          reqDate
          partApprovalImg
          counterRecieptImg
          invoiceImg
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
    status
    failureReport {
      problemLocation
      operator
      description
      __typename
    }
    workOrder {
      jobToBeDone
      personInCharge
      sparePart
      observation
      __typename
    }
    mechanicReview {
      mechanic
      __typename
    }
    partReq {
      partDescription
      price
      unitaryPrice
      quantity
      isCash
      isImportant
      __typename
    }
    invoiceInfo {
      subTotal
      date
      number
      __typename
    }
    reqDate
    partApprovalImg
    counterRecieptImg
    invoiceImg
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePartSubscriptionVariables,
  APITypes.OnDeletePartSubscription
>;
export const onCreateTable = /* GraphQL */ `subscription OnCreateTable($filter: ModelSubscriptionTableFilterInput) {
  onCreateTable(filter: $filter) {
    id
    from
    to
    type
    status
    customFile
    Parts {
      items {
        id
        unitID
        Unit {
          id
          Parts {
            nextToken
            __typename
          }
          name
          createdAt
          updatedAt
          __typename
        }
        providerID
        Provider {
          id
          emails
          name
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        tableID
        Table {
          id
          from
          to
          type
          status
          customFile
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        status
        failureReport {
          problemLocation
          operator
          description
          __typename
        }
        workOrder {
          jobToBeDone
          personInCharge
          sparePart
          observation
          __typename
        }
        mechanicReview {
          mechanic
          __typename
        }
        partReq {
          partDescription
          price
          unitaryPrice
          quantity
          isCash
          isImportant
          __typename
        }
        invoiceInfo {
          subTotal
          date
          number
          __typename
        }
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTableSubscriptionVariables,
  APITypes.OnCreateTableSubscription
>;
export const onUpdateTable = /* GraphQL */ `subscription OnUpdateTable($filter: ModelSubscriptionTableFilterInput) {
  onUpdateTable(filter: $filter) {
    id
    from
    to
    type
    status
    customFile
    Parts {
      items {
        id
        unitID
        Unit {
          id
          Parts {
            nextToken
            __typename
          }
          name
          createdAt
          updatedAt
          __typename
        }
        providerID
        Provider {
          id
          emails
          name
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        tableID
        Table {
          id
          from
          to
          type
          status
          customFile
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        status
        failureReport {
          problemLocation
          operator
          description
          __typename
        }
        workOrder {
          jobToBeDone
          personInCharge
          sparePart
          observation
          __typename
        }
        mechanicReview {
          mechanic
          __typename
        }
        partReq {
          partDescription
          price
          unitaryPrice
          quantity
          isCash
          isImportant
          __typename
        }
        invoiceInfo {
          subTotal
          date
          number
          __typename
        }
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTableSubscriptionVariables,
  APITypes.OnUpdateTableSubscription
>;
export const onDeleteTable = /* GraphQL */ `subscription OnDeleteTable($filter: ModelSubscriptionTableFilterInput) {
  onDeleteTable(filter: $filter) {
    id
    from
    to
    type
    status
    customFile
    Parts {
      items {
        id
        unitID
        Unit {
          id
          Parts {
            nextToken
            __typename
          }
          name
          createdAt
          updatedAt
          __typename
        }
        providerID
        Provider {
          id
          emails
          name
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        tableID
        Table {
          id
          from
          to
          type
          status
          customFile
          Parts {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        status
        failureReport {
          problemLocation
          operator
          description
          __typename
        }
        workOrder {
          jobToBeDone
          personInCharge
          sparePart
          observation
          __typename
        }
        mechanicReview {
          mechanic
          __typename
        }
        partReq {
          partDescription
          price
          unitaryPrice
          quantity
          isCash
          isImportant
          __typename
        }
        invoiceInfo {
          subTotal
          date
          number
          __typename
        }
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTableSubscriptionVariables,
  APITypes.OnDeleteTableSubscription
>;
