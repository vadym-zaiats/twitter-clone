import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from "typeorm";
import { Posts } from "./Posts";
import { Favourite } from "./Favourite";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  email: string;

  @Column()
  password: string;

  @Column()
  userName: string;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  background: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createDate: Date;

  @OneToMany(() => Posts, (post) => post.author)
  posts: Posts[];

  @OneToMany(() => Favourite, (favorite) => favorite.user)
  favorites: Favourite[];
}
