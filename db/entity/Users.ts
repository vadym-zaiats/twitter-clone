import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from "typeorm";
import { Posts } from "./Posts";
import { FavoritePosts } from "./FavoritePosts";
import { Subscriptions } from "./Subscriptions";
import { Followers } from "./Followers";

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

  @Column({ type: "varchar", nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: "bigint", nullable: true })
  resetPasswordExpires: number | null;

  @OneToMany(() => Posts, (post) => post.author)
  posts: Posts[];

  @OneToMany(() => FavoritePosts, (favorite) => favorite.user)
  favoritePosts: FavoritePosts[];

  @OneToMany(() => Subscriptions, (subscription) => subscription.user)
  subscriptions: Subscriptions[];

  @OneToMany(() => Subscriptions, (subscription) => subscription.subscribed)
  subscribers: Subscriptions[];

  @OneToMany(() => Followers, (follower) => follower.user)
  followers: Followers[];

  @OneToMany(() => Followers, (follower) => follower.following)
  following: Followers[];
}
