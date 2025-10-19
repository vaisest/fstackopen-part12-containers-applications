import { gql } from "@apollo/client";

export const ALL_BOOKS = gql`
  query {
    allBooks {
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

export const ALL_BOOKS_OF_GENRE = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      author {
        name
        bookCount
        id
        born
      }
      id
      genres
    }
  }
`;

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query Me {
    me {
      username
      favoriteGenre
      id
    }
  }
`;
