import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Users } from "./User";

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

  @Column({
    type: "enum",
    enum: Genre,
    default: Genre.OTHER,
  })
  genre: Genre;

  @Column({ type: "boolean", default: true })
  isPrivate: boolean;

  @ManyToOne(() => Users, (user) => user.posts)
  author: Users;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createDate: Date;
}
