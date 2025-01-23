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
  }
}` as GeneratedMutation<
  APITypes.CreateAdministradorMutationVariables,
  APITypes.CreateAdministradorMutation
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
  }
}` as GeneratedMutation<
  APITypes.CreateContadorMutationVariables,
  APITypes.CreateContadorMutation
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
        providerID
        tableID
        status
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
      }
      nextToken
    }
    createdAt
    updatedAt
  }
}` as GeneratedMutation<
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
        providerID
        tableID
        status
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
      }
      nextToken
    }
    createdAt
    updatedAt
  }
}` as GeneratedMutation<
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
        providerID
        tableID
        status
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
      }
      nextToken
    }
    createdAt
    updatedAt
  }
}` as GeneratedMutation<
  APITypes.DeleteProviderMutationVariables,
  APITypes.DeleteProviderMutation
>;

export const createUnit = /* GraphQL */ `mutation CreateUnit(
  $input: CreateUnitInput!
  $condition: ModelUnitConditionInput
) {
  createUnit(input: $input, condition: $condition) {
    id
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
      }
      nextToken
    }
    createdAt
    updatedAt
  }
}` as GeneratedMutation<
  APITypes.CreateUnitMutationVariables,
  APITypes.CreateUnitMutation
>;

export const updateUnit = /* GraphQL */ `mutation UpdateUnit(
  $input: UpdateUnitInput!
  $condition: ModelUnitConditionInput
) {
  updateUnit(input: $input, condition: $condition) {
    id
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
      }
      nextToken
    }
    createdAt
    updatedAt
  }
}` as GeneratedMutation<
  APITypes.UpdateUnitMutationVariables,
  APITypes.UpdateUnitMutation
>;

export const deleteUnit = /* GraphQL */ `mutation DeleteUnit(
  $input: DeleteUnitInput!
  $condition: ModelUnitConditionInput
) {
  deleteUnit(input: $input, condition: $condition) {
    id
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
      }
      nextToken
    }
    createdAt
    updatedAt
  }
}` as GeneratedMutation<
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
      name
      Parts {
        nextToken
      }
      createdAt
      updatedAt
    }
    providerID
    Provider {
      id
      emails
      name
      Parts {
        nextToken
      }
      createdAt
      updatedAt
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
      }
      createdAt
      updatedAt
    }
    status
    failureReport {
      problemLocation
      operator
      description
    }
    workOrder {
      jobToBeDone
      personInCharge
      sparePart
      observation
    }
    mechanicReview {
      mechanic
    }
    partReq {
      partDescription
      price
      unitaryPrice
      quantity
      isCash
      isImportant
    }
    invoiceInfo {
      subTotal
      date
      number
    }
    reqDate
    partApprovalImg
    counterRecieptImg
    invoiceImg
    createdAt
    updatedAt
  }
}` as GeneratedMutation<
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
      name
      Parts {
        nextToken
      }
      createdAt
      updatedAt
    }
    providerID
    Provider {
      id
      emails
      name
      Parts {
        nextToken
      }
      createdAt
      updatedAt
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
      }
      createdAt
      updatedAt
    }
    status
    failureReport {
      problemLocation
      operator
      description
    }
    workOrder {
      jobToBeDone
      personInCharge
      sparePart
      observation
    }
    mechanicReview {
      mechanic
    }
    partReq {
      partDescription
      price
      unitaryPrice
      quantity
      isCash
      isImportant
    }
    invoiceInfo {
      subTotal
      date
      number
    }
    reqDate
    partApprovalImg
    counterRecieptImg
    invoiceImg
    createdAt
    updatedAt
  }
}` as GeneratedMutation<
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
      name
      Parts {
        nextToken
      }
      createdAt
      updatedAt
    }
    providerID
    Provider {
      id
      emails
      name
      Parts {
        nextToken
      }
      createdAt
      updatedAt
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
      }
      createdAt
      updatedAt
    }
    status
    failureReport {
      problemLocation
      operator
      description
    }
    workOrder {
      jobToBeDone
      personInCharge
      sparePart
      observation
    }
    mechanicReview {
      mechanic
    }
    partReq {
      partDescription
      price
      unitaryPrice
      quantity
      isCash
      isImportant
    }
    invoiceInfo {
      subTotal
      date
      number
    }
    reqDate
    partApprovalImg
    counterRecieptImg
    invoiceImg
    createdAt
    updatedAt
  }
}` as GeneratedMutation<
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
        providerID
        tableID
        status
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
      }
      nextToken
    }
    createdAt
    updatedAt
  }
}` as GeneratedMutation<
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
        providerID
        tableID
        status
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
      }
      nextToken
    }
    createdAt
    updatedAt
  }
}` as GeneratedMutation<
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
        providerID
        tableID
        status
        reqDate
        partApprovalImg
        counterRecieptImg
        invoiceImg
        createdAt
        updatedAt
      }
      nextToken
    }
    createdAt
    updatedAt
  }
}` as GeneratedMutation<
  APITypes.DeleteTableMutationVariables,
  APITypes.DeleteTableMutation
>;