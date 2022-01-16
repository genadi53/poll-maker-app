import React, { useState } from "react";
import { useRegisterMutation } from "../generated/graphql";
import { useNavigate } from "react-router-dom";

export const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register] = useRegisterMutation();
  let navigate = useNavigate();

  return (
    <div>
      <h1>Register</h1>
      <form
        autoComplete="off"
        onSubmit={async (e) => {
          e.preventDefault();
          console.log(email, username);
          const response = await register({
            variables: {
              email,
              username,
              password,
            },
          });
          console.log(response);
          navigate("/");
        }}
      >
        <div>
          <input
            value={username}
            id="username"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            value={email}
            id="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
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
