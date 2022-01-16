import React from "react";
import { useUsersQuery } from "../generated/graphql";

interface Props {}

export const Home: React.FC<Props> = () => {
  const { data, loading } = useUsersQuery({ fetchPolicy: "network-only" });

  if (loading || !data) return <>loading...</>;

  return (
    <div>
      <div>Welcome!</div>
      <ul>
        {data.users.map((u) => (
          <li key={u.id}>
            {u.id} - {u.username} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
