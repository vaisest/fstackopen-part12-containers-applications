import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { SET_BIRTHYEAR } from "../graphql/mutations";
import { ALL_AUTHORS } from "../graphql/queries";

const Authors = () => {
  const result = useQuery(ALL_AUTHORS);

  const [setBirthyear] = useMutation(SET_BIRTHYEAR);

  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const authors = !result.loading ? result.data.allAuthors : [];

  const submit = async (event) => {
    event.preventDefault();

    setBirthyear({
      variables: { name, setBornTo: parseInt(born, 10) },
      refetchQueries: [{ query: ALL_AUTHORS }],
    });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name{" "}
          <select
            value={name}
            onChange={(event) => setName(event.target.value)}
          >
            {authors.map((author) => (
              <option value={author.name} key={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born{" "}
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          ></input>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
