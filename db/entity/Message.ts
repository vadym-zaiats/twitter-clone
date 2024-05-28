import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Users } from "./Users";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.sentMessages)
  sender: Users;

  @ManyToOne(() => Users, (user) => user.receivedMessages)
  receiver: Users;

  @Column()
  content: string;

  @CreateDateColumn()
  timestamp: Date;
}
