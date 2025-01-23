/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getAdministrador = /* GraphQL */ `query GetAdministrador($id: ID!) {
  getAdministrador(id: $id) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAdministradorQueryVariables,
  APITypes.GetAdministradorQuery
>;
export const listAdministradors = /* GraphQL */ `query ListAdministradors(
  $filter: ModelAdministradorFilterInput
  $limit: Int
  $nextToken: String
) {
  listAdministradors(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      emails
      name
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAdministradorsQueryVariables,
  APITypes.ListAdministradorsQuery
>;
export const getContador = /* GraphQL */ `query GetContador($id: ID!) {
  getContador(id: $id) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetContadorQueryVariables,
  APITypes.GetContadorQuery
>;
export const listContadors = /* GraphQL */ `query ListContadors(
  $filter: ModelContadorFilterInput
  $limit: Int
  $nextToken: String
) {
  listContadors(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      emails
      name
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListContadorsQueryVariables,
  APITypes.ListContadorsQuery
>;
export const getProvider = /* GraphQL */ `query GetProvider($id: ID!) {
  getProvider(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetProviderQueryVariables,
  APITypes.GetProviderQuery
>;
export const listProviders = /* GraphQL */ `query ListProviders(
  $filter: ModelProviderFilterInput
  $limit: Int
  $nextToken: String
) {
  listProviders(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProvidersQueryVariables,
  APITypes.ListProvidersQuery
>;
export const getUnit = /* GraphQL */ `query GetUnit($id: ID!) {
  getUnit(id: $id) {
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
` as GeneratedQuery<APITypes.GetUnitQueryVariables, APITypes.GetUnitQuery>;
export const listUnits = /* GraphQL */ `query ListUnits(
  $filter: ModelUnitFilterInput
  $limit: Int
  $nextToken: String
) {
  listUnits(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUnitsQueryVariables, APITypes.ListUnitsQuery>;
export const getPart = /* GraphQL */ `query GetPart($id: ID!) {
  getPart(id: $id) {
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
` as GeneratedQuery<APITypes.GetPartQueryVariables, APITypes.GetPartQuery>;
export const listParts = /* GraphQL */ `query ListParts(
  $filter: ModelPartFilterInput
  $limit: Int
  $nextToken: String
) {
  listParts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      unitID
      Unit {
        id
        Parts {
          items {
            id
            unitID
            providerID
            tableID
            status
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
            providerID
            tableID
            status
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
            providerID
            tableID
            status
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListPartsQueryVariables, APITypes.ListPartsQuery>;
export const partsByUnitID = /* GraphQL */ `query PartsByUnitID(
  $unitID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelPartFilterInput
  $limit: Int
  $nextToken: String
) {
  partsByUnitID(
    unitID: $unitID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      unitID
      Unit {
        id
        Parts {
          items {
            id
            unitID
            providerID
            tableID
            status
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
            providerID
            tableID
            status
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
            providerID
            tableID
            status
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PartsByUnitIDQueryVariables,
  APITypes.PartsByUnitIDQuery
>;
export const partsByProviderID = /* GraphQL */ `query PartsByProviderID(
  $providerID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelPartFilterInput
  $limit: Int
  $nextToken: String
) {
  partsByProviderID(
    providerID: $providerID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      unitID
      Unit {
        id
        Parts {
          items {
            id
            unitID
            providerID
            tableID
            status
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
            providerID
            tableID
            status
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
            providerID
            tableID
            status
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PartsByProviderIDQueryVariables,
  APITypes.PartsByProviderIDQuery
>;
export const partsByTableID = /* GraphQL */ `query PartsByTableID(
  $tableID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelPartFilterInput
  $limit: Int
  $nextToken: String
) {
  partsByTableID(
    tableID: $tableID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      unitID
      Unit {
        id
        Parts {
          items {
            id
            unitID
            providerID
            tableID
            status
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
            providerID
            tableID
            status
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
            providerID
            tableID
            status
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PartsByTableIDQueryVariables,
  APITypes.PartsByTableIDQuery
>;
export const getTable = /* GraphQL */ `query GetTable($id: ID!) {
  getTable(id: $id) {
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
` as GeneratedQuery<APITypes.GetTableQueryVariables, APITypes.GetTableQuery>;
export const listTables = /* GraphQL */ `query ListTables(
  $filter: ModelTableFilterInput
  $limit: Int
  $nextToken: String
) {
  listTables(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTablesQueryVariables,
  APITypes.ListTablesQuery
>;
export const tablesByType = /* GraphQL */ `query TablesByType(
  $type: TableType!
  $sortDirection: ModelSortDirection
  $filter: ModelTableFilterInput
  $limit: Int
  $nextToken: String
) {
  tablesByType(
    type: $type
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.TablesByTypeQueryVariables,
  APITypes.TablesByTypeQuery
>;
export const tablesByStatus = /* GraphQL */ `query TablesByStatus(
  $status: Int!
  $sortDirection: ModelSortDirection
  $filter: ModelTableFilterInput
  $limit: Int
  $nextToken: String
) {
  tablesByStatus(
    status: $status
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.TablesByStatusQueryVariables,
  APITypes.TablesByStatusQuery
>;
