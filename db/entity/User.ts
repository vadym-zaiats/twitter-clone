import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from "typeorm";
import { Posts } from "./Posts";

export enum Channel {
  LOG = "log",
  ALERT = "alert",
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  email: string;

  @Column()
  password: string;

  @Column({ type: "boolean", default: false })
  sendNotification: boolean;

  @Column({
    type: "enum",
    enum: Channel,
    default: Channel.LOG,
  })
  notificationChannel: Channel;

  @OneToMany(() => Posts, (post) => post.author)
  posts: Posts[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createDate: Date;
}
