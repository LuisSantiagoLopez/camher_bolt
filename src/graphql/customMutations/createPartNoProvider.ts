import { gql } from 'graphql-tag';

export const createPartNoProvider = gql`
  mutation CreatePartNoProvider($input: CreatePartInput!) {
    createPart(input: $input) {
      id
      unitID
      tableID
      # Omit Provider, Unit, etc.
    }
  }
`;
