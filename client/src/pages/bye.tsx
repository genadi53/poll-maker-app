import React from "react";
import { getAccessToken } from "../accessToken";
import { useByeQuery } from "../generated/graphql";

interface Props {}

export const Bye: React.FC<Props> = () => {
  const { data, loading, error } = useByeQuery({
    fetchPolicy: "network-only",
  });

  if (error) {
    console.log(error);
    return (
      <>
        error
        <>{JSON.stringify(getAccessToken())}</>
      </>
    );
  }
  if (loading) return <>loading...</>;
  if (!data) return <>no data</>;

  return (
    <div>
      <div>Bye!</div>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};
