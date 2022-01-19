import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Choice } from "./Choice";
import { User } from "./User";

@ObjectType()
@Entity()
export class Pool extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  question: string;

  @Field(() => String)
  @CreateDateColumn()
  expirationDateTime: Date;

  @Field(() => [Choice])
  @OneToMany(() => Choice, (choice) => choice.pool)
  choices: Choice[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.pools)
  creator: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
