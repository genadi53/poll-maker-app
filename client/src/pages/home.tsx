import React from "react";
import { usePoolsQuery, useUsersQuery } from "../generated/graphql";
import { Pool } from "../components/pool";
interface Props {}

export const Home: React.FC<Props> = () => {
  const { data, loading } = useUsersQuery({ fetchPolicy: "network-only" });
  const { data: poolsData, loading: PoolsLoading } = usePoolsQuery();

  if (!poolsData || PoolsLoading) return <>loading...</>;
  if (!data || loading) return <>loading...</>;

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

      <ul>
        {poolsData.pools!.map((pool, idx) => (
          <>
            <Pool
              key={idx}
              question={pool.question}
              expirationDateTime={pool.expirationDateTime}
              creator={pool.creator}
              choices={pool.choices}
            />
          </>
        ))}
      </ul>
    </div>
  );
};
