import React, { useState } from "react";
import { useLoginMutation } from "../generated/graphql";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();
  let navigate = useNavigate();

  return (
    <div>
      <h1>Login</h1>
      <form
        autoComplete="off"
        onSubmit={async (e) => {
          e.preventDefault();
          const response = await login({
            variables: {
              usernameOrEmail,
              password,
            },
          });
          console.log(response);
          navigate("/");
        }}
      >
        <div>
          <input
            value={usernameOrEmail}
            id="usernameOrEmail"
            placeholder="UsernameOrEmail"
            onChange={(e) => {
              setUsernameOrEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};
