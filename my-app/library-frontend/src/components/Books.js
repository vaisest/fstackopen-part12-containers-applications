import { useLazyQuery, useQuery } from "@apollo/client";
import { ALL_BOOKS, ALL_BOOKS_OF_GENRE } from "../graphql/queries";

const Books = () => {
  const allResult = useQuery(ALL_BOOKS);
  const [getGenreResult, { loading: genreLoading, data: genreData }] =
    useLazyQuery(ALL_BOOKS_OF_GENRE);

  const books = !allResult.loading ? allResult.data.allBooks : [];
  const genres = [...new Set(books.flatMap((book) => book.genres))];
  const filteredBooks = genreData ? genreData.allBooks : books;
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() =>
              getGenreResult({
                variables: { genre },
                fetchPolicy: "network-only",
              })
            }
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
