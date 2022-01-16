import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { User } from "./entity/User";
import { MyContext } from "./MyContext";
import { createAccessToken, createRefreshToken } from "./auth";
import { isAuth } from "./isAuth";
import { sendRefreshToken } from "./sendRefreshToken";
import { getConnection } from "typeorm";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Hello!";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    console.log(payload);
    return `bye ${payload!.userId}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email", () => String) email: string,
    @Arg("username") username: string,
    @Arg("password") password: string
  ) {
    const hashedpass = await hash(password, 12);
    try {
      await User.insert({ email, username, password: hashedpass });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("usernameOrEmail", () => String) usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) throw new Error("invalid login");

    const valid = await compare(password, user.password);
    if (!valid) throw new Error("invalid password");

    sendRefreshToken(res, createRefreshToken(user));
    return createAccessToken(user);
  }
}
