import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User } from "./entity/User";
import { MyContext } from "./MyContext";

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

    res.cookie(
      "jid",
      sign({ userId: user.id }, "secretforrefresh", {
        expiresIn: "7d",
      }),
      {
        httpOnly: true,
        // domain
      }
    );

    return {
      accessToken: sign({ userId: user.id }, "secret", {
        expiresIn: "15m",
      }),
    };
  }
}
