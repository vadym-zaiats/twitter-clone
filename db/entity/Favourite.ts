import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Users } from "./User";
import { Posts } from "./Posts";

@Entity()
export class Favourite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.favorites)
  user: Users;

  @ManyToOne(() => Posts, (post) => post.favorites)
  post: Posts;
}
