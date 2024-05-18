import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";

@Entity()
export class Followers {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.followers)
  user: Users;

  @ManyToOne(() => Users, (user) => user.following)
  following: Users;
}
