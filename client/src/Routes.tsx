import React from "react";
import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
// import { useHelloQuery } from "./generated/graphql";
// import { useQuery } from "@apollo/client";
// import { gql } from "apollo-boost";

const RoutesComponent: React.FC = () => {
  return (
    <BrowserRouter>
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
        <hr />
      </>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
  // const { data, loading } = useQuery(
  //   gql` { hello } `
  // );

  // const { data, loading } = useHelloQuery();
  // if (loading || !data) return <div>loading...</div>;
  // return <div>data is {data.hello}</div>;
};

export default RoutesComponent;
