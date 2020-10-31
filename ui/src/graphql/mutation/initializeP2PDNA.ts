import gql from "graphql-tag";

export default gql`
  mutation InitializeP2PDNA($requirements: Requirements) {
    initializeP2PDNA(requirements: $requirements) {
      Boolean
    }
  }
`;
