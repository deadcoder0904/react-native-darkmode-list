import gql from "graphql-tag";

export default gql`
  mutation createApp($id: ID!, $name: String!, $link: String!) {
    createApp(input: { id: $id, name: $name, link: $link }) {
      id
      name
      link
    }
  }
`;
