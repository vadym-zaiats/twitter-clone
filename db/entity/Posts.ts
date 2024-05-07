import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from "typeorm";
import { Users } from "./Users";

export enum Genre {
  POLITIC = "Politic",
  BUSINESS = "Business",
  SPORT = "Sport",
  OTHER = "Other",
}

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column({ nullable: true })
  picture: string;

  @ManyToOne(() => Users, (user) => user.posts)
  author: Users;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createDate: Date;
}
