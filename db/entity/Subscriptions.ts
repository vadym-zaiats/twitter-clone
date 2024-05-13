import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";

@Entity()
export class Subscriptions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.subscribers)
  subscriber: Users;

  @ManyToOne(() => Users, (user) => user.subscriptions)
  subscribedTo: Users;
}
