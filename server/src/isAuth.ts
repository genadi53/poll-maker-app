import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { ACCESS_TOKEN_SECRET } from "./constants";
import { MyContext } from "./MyContext";

export const isAuth: MiddlewareFn<MyContext> = (
  {
    //   _root, _info, _args
    context,
  },
  next
) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) throw new Error("not authenticated");

  try {
    const token = authorization.split(" ")[1];
    console.log(authorization);
    console.log("***** ******");
    console.log(token);
    const payload = verify(token, ACCESS_TOKEN_SECRET);
    // console.log(payload);
    context.payload = payload as any;
  } catch (err) {
    console.log("*** ERROR ***");
    console.log(err);
    throw new Error("not authenticated");
  }
  return next();
};
