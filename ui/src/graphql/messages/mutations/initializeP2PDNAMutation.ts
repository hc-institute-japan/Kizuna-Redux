import gql from "graphql-tag";

export default gql`
  mutation InitializeP2PDNA($properties: Properties) {
    initializeP2PDNA(properties: $properties) {
      id
      creator
      conversant
    }
  }
`;
