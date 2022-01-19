import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Choice } from "./Choice";
import { User } from "./User";
import { Pool } from "./Pool";

@ObjectType()
@Entity()
export class Vote extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pool)
  pool: Pool;

  @ManyToOne(() => Choice, (choice) => choice.votes)
  choice: Choice;

  @ManyToOne(() => User)
  user: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
