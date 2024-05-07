import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Posts } from "./Posts";

@Entity()
export class FavoritePosts {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.favoritePosts)
  user: Users;

  @ManyToOne(() => Posts, (post) => post.favoritePosts)
  post: Posts;
}
