import { useMutation } from "@apollo/client";
import { useState } from "react";
import { LOGIN } from "../graphql/mutations";

const Login = ({ setToken, setPage }) => {
  const [login] = useMutation(LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (event) => {
    event.preventDefault();
    try {
      const res = await login({
        variables: { username, password },
      });
      setPage("authors");

      setToken(res.data.login.value);
      localStorage.setItem("libraryUserToken", res.data.login.value);
    } catch (error) {
      throw error;
    } finally {
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div>
      <h2>login</h2>

      <form onSubmit={loginHandler}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            type="text"
          ></input>
        </div>
        <div>
          password{" "}
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            type="password"
          ></input>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
