import { gql } from "@apollo/client";

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        bookCount
        born
        name
        id
      }
      published
      genres
      id
    }
  }
`;
