import { useQuery } from "@apollo/client";
import { ALL_BOOKS, GET_CURRENT_USER } from "../graphql/queries";

const Recommendations = () => {
  const result = useQuery(ALL_BOOKS);
  const user = useQuery(GET_CURRENT_USER);
  console.log(user);

  const books = !result.loading ? result.data.allBooks : [];

  const favoriteGenre = !user.loading ? user.data.me.favoriteGenre : "";
  const filteredBooks = !user.loading
    ? books.filter((book) => book.genres.includes(favoriteGenre))
    : books;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{favoriteGenre}</b>
      </p>
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
    </div>
  );
};

export default Recommendations;
