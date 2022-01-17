import React from "react";
import { Link } from "react-router-dom";
import { setAccessToken } from "./accessToken";
import { useMeQuery, useLogoutMutation } from "./generated/graphql";

export const Header: React.FC = () => {
  const { data, loading } = useMeQuery({ fetchPolicy: "network-only" });
  const [logout, { client }] = useLogoutMutation();
  let body: any = null;

  if (loading) {
    body = <div>loading....</div>;
  } else if (data && data.me) {
    body = (
      <div>
        {JSON.stringify(data.me)}
        <div>
          <button
            onClick={async () => {
              await logout();
              setAccessToken("");
              await client.resetStore();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  } else {
    body = <div>not loged in</div>;
  }

  return (
    <>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/register">Register</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <Link to="/bye">Bye</Link>
      </div>
      <div>{body}</div>

      <hr />
    </>
  );
};
