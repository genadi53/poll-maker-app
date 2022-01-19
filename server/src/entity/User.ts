import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Pool } from "./Pool";
import { Role } from "./Role";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column("int", { default: 0 })
  tokenVersion: number;

  @Field(() => [Pool])
  @ManyToOne(() => Pool, (pool) => pool.creator)
  pools: Pool[];

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
