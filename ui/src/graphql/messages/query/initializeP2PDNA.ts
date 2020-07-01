import gql from "graphql-tag";

export default gql`
  query InitializeP2PDNA($requirements: Requirements) {
    initializeP2PDNA(requirements: $requirements)
  }
`;
