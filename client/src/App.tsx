import React, { useEffect, useState } from "react";
import { setAccessToken } from "./accessToken";
import RoutesComponent from "./Routes";

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/refresh_token", {
      method: "POST",
      credentials: "include",
    }).then(async (res) => {
      const data = await res.json();
      // console.log(data);
      setAccessToken(data.accessToken);
      // console.log(data.accessToken);
      setLoading(false);
    });
  }, []);

  if (loading) return <>Loading...</>;
  return <RoutesComponent />;
};
