import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { UserResolver } from "./UserResolver";
import { buildSchema } from "type-graphql";
import { verify } from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "./constants";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";

const main = async () => {
  const app = express();
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  // app.get("/", (_req, res) => res.send("hello"));
  app.post("/refresh_token", async (req, res) => {
    //console.log(req.headers);
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
      payload = verify(token, REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    // token is valid and then is send back a new access token
    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));
    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started");
  });
};

main();
