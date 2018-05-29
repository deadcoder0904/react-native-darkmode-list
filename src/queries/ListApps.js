import gql from "graphql-tag";

export default gql`
  query listApps {
    listApps {
      items {
        id
        name
        link
      }
    }
  }
`;
