import gql from "graphql-tag";

export default gql`
  subscription NewApp {
    onCreateApp {
      id
      name
      link
    }
  }
`;
