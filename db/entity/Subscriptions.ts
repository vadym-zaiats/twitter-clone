import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";

@Entity()
export class Subscriptions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.subscribers)
  user: Users;

  @ManyToOne(() => Users, (user) => user.subscriptions)
  subscribed: Users;
}
