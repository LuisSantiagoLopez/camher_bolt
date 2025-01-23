/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createAdministrador = /* GraphQL */ `mutation CreateAdministrador(
  $input: CreateAdministradorInput!
  $condition: ModelAdministradorConditionInput
) {
  createAdministrador(input: $input, condition: $condition) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAdministradorMutationVariables,
  APITypes.CreateAdministradorMutation
>;
export const updateAdministrador = /* GraphQL */ `mutation UpdateAdministrador(
  $input: UpdateAdministradorInput!
  $condition: ModelAdministradorConditionInput
) {
  updateAdministrador(input: $input, condition: $condition) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAdministradorMutationVariables,
  APITypes.UpdateAdministradorMutation
>;
export const deleteAdministrador = /* GraphQL */ `mutation DeleteAdministrador(
  $input: DeleteAdministradorInput!
  $condition: ModelAdministradorConditionInput
) {
  deleteAdministrador(input: $input, condition: $condition) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAdministradorMutationVariables,
  APITypes.DeleteAdministradorMutation
>;
export const createContador = /* GraphQL */ `mutation CreateContador(
  $input: CreateContadorInput!
  $condition: ModelContadorConditionInput
) {
  createContador(input: $input, condition: $condition) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateContadorMutationVariables,
  APITypes.CreateContadorMutation
>;
export const updateContador = /* GraphQL */ `mutation UpdateContador(
  $input: UpdateContadorInput!
  $condition: ModelContadorConditionInput
) {
  updateContador(input: $input, condition: $condition) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateContadorMutationVariables,
  APITypes.UpdateContadorMutation
>;
export const deleteContador = /* GraphQL */ `mutation DeleteContador(
  $input: DeleteContadorInput!
  $condition: ModelContadorConditionInput
) {
  deleteContador(input: $input, condition: $condition) {
    id
    emails
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteContadorMutationVariables,
  APITypes.DeleteContadorMutation
>;
export const createProvider = /* GraphQL */ `mutation CreateProvider(
  $input: CreateProviderInput!
  $condition: ModelProviderConditionInput
) {
  createProvider(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateProviderMutationVariables,
  APITypes.CreateProviderMutation
>;
export const updateProvider = /* GraphQL */ `mutation UpdateProvider(
  $input: UpdateProviderInput!
  $condition: ModelProviderConditionInput
) {
  updateProvider(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateProviderMutationVariables,
  APITypes.UpdateProviderMutation
>;
export const deleteProvider = /* GraphQL */ `mutation DeleteProvider(
  $input: DeleteProviderInput!
  $condition: ModelProviderConditionInput
) {
  deleteProvider(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteProviderMutationVariables,
  APITypes.DeleteProviderMutation
>;
export const createUnit = /* GraphQL */ `mutation CreateUnit(
  $input: CreateUnitInput!
  $condition: ModelUnitConditionInput
) {
  createUnit(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUnitMutationVariables,
  APITypes.CreateUnitMutation
>;
export const updateUnit = /* GraphQL */ `mutation UpdateUnit(
  $input: UpdateUnitInput!
  $condition: ModelUnitConditionInput
) {
  updateUnit(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUnitMutationVariables,
  APITypes.UpdateUnitMutation
>;
export const deleteUnit = /* GraphQL */ `mutation DeleteUnit(
  $input: DeleteUnitInput!
  $condition: ModelUnitConditionInput
) {
  deleteUnit(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUnitMutationVariables,
  APITypes.DeleteUnitMutation
>;
export const createPart = /* GraphQL */ `mutation CreatePart(
  $input: CreatePartInput!
  $condition: ModelPartConditionInput
) {
  createPart(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreatePartMutationVariables,
  APITypes.CreatePartMutation
>;
export const updatePart = /* GraphQL */ `mutation UpdatePart(
  $input: UpdatePartInput!
  $condition: ModelPartConditionInput
) {
  updatePart(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdatePartMutationVariables,
  APITypes.UpdatePartMutation
>;
export const deletePart = /* GraphQL */ `mutation DeletePart(
  $input: DeletePartInput!
  $condition: ModelPartConditionInput
) {
  deletePart(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeletePartMutationVariables,
  APITypes.DeletePartMutation
>;
export const createTable = /* GraphQL */ `mutation CreateTable(
  $input: CreateTableInput!
  $condition: ModelTableConditionInput
) {
  createTable(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateTableMutationVariables,
  APITypes.CreateTableMutation
>;
export const updateTable = /* GraphQL */ `mutation UpdateTable(
  $input: UpdateTableInput!
  $condition: ModelTableConditionInput
) {
  updateTable(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateTableMutationVariables,
  APITypes.UpdateTableMutation
>;
export const deleteTable = /* GraphQL */ `mutation DeleteTable(
  $input: DeleteTableInput!
  $condition: ModelTableConditionInput
) {
  deleteTable(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteTableMutationVariables,
  APITypes.DeleteTableMutation
>;
