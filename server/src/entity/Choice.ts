import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Pool } from "./Pool";
import { Vote } from "./Vote";

@ObjectType()
@Entity()
export class Choice extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  text: string;

  @ManyToOne(() => Pool, (pool) => pool.choices, { cascade: true })
  pool: Pool;

  @OneToMany(() => Vote, (vote) => vote.choice)
  votes: Vote;
}
