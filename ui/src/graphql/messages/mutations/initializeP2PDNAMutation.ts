import gql from "graphql-tag";

export default gql`
  mutation InitializeP2PDNA($members: Requirements) {
    initializeP2PDNA(members: $members)
  }
`;
