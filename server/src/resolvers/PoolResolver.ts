import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Pool } from "../entity/Pool";
import { Choice } from "../entity/Choice";
import { User } from "../entity/User";
import { MyContext } from "../MyContext";
import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants";
import { getConnection } from "typeorm";

@Resolver()
export class PoolResolver {
  @Query(() => [Pool], { nullable: true })
  pools() {
    return Pool.find({ relations: ["choices", "creator"] });
  }

  @Query(() => Pool, { nullable: true })
  async findPoolById(
    @Arg("id", () => Int) id: number
  ): Promise<Pool | undefined> {
    // return Pool.findOne({ id: id }, { relations: ["users"] });

    const res = await getConnection()
      .createQueryBuilder()
      .select("pool")
      .from(Pool, "pool")
      .leftJoinAndSelect("pool.creator", "users")
      .leftJoinAndSelect("pool.choices", "choices")
      .where('pool."id" = :id', { id })
      .getOne();
    return res;
  }

  @Query(() => [Pool], { nullable: true })
  async findPoolByCreatorId(@Arg("user_id", () => Int) user_id: number) {
    const user = await User.findOne({ id: user_id });
    return Pool.find({
      where: {
        creator: user,
      },
    });
  }

  @Mutation(() => Pool, { nullable: true })
  async createPool(
    @Arg("question") question: string,
    @Arg("choicesOptions", () => String) choicesOptions: string,
    @Arg("expirationDateTime") expirationDateTime: string,
    @Ctx() context: MyContext
  ) {
    console.log(choicesOptions);
    // check for loged in user
    const authorization = context.req.headers["authorization"];
    if (!authorization) {
      return null;
    }
    let user = null;
    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, ACCESS_TOKEN_SECRET);
      user = await User.findOne(payload.userId);
    } catch (err) {
      console.log(err);
      throw new Error("not logged in");
    }

    console.log(user);
    const choicesArray = choicesOptions.split("-");

    console.log(choicesArray);

    const pool = await Pool.create({
      question,
      expirationDateTime,
      creator: user,
    });

    await pool.save();

    console.log("1");
    // const ch = await Promise.all(
    //   choicesArray.map(async (c) => {
    //     const ca = await Choice.create({ text: c, pool }).save();
    //     console.log(ca);
    //     return ca;
    //   })
    // );

    let ch = [] as Choice[];
    try {
      for (let i = 0; i < choicesArray.length; i++) {
        const c = Choice.create({ text: choicesArray[i], pool });
        await c.save();
        // const c = await getConnection()
        //   .createQueryBuilder()
        //   .insert()
        //   .into(Choice)
        //   .values([{ pool, text: choicesArray[i] }])
        //   .execute();
        // console.log(i);
        console.log(c);
        ch.push(c as any);
      }
    } catch (err) {
      console.log("**** ERR ****");
      console.log(err);
    }

    console.log(ch);
    pool.choices = ch;

    console.log(pool);
    await pool.save();
    return pool;
  }
}
