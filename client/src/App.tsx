import React from "react";
import { useHelloQuery } from "./generated/graphql";
// import { useQuery } from "@apollo/client";
// import { gql } from "apollo-boost";

const App: React.FC = () => {
  // const { data, loading } = useQuery(
  //   gql` { hello } `
  // );

  const { data, loading } = useHelloQuery();

  if (loading || !data) return <div>loading...</div>;
  return <div>data is {data.hello}</div>;
};

export default App;
