import * as faker from "faker";
import { Users } from "../db/entity/User";
import { Posts, Genre } from "../db/entity/Posts";
import { AppDataSource } from "../db/data-source";
import { type DataSource } from "typeorm";
import { hashPassword } from "../validation/users";
import { Channel } from "../db/entity/User";

// create users
export const generateUsers = (count: number): Users[] => {
  const users: Users[] = [];
  for (let i = 0; i < count; i++) {
    const user = new Users();
    user.email = faker.internet.email();
    user.password = hashPassword("q123456");
    user.notificationChannel = faker.random.arrayElement([
      Channel.ALERT,
      Channel.LOG,
    ]);
    user.sendNotification = faker.random.boolean();
    users.push(user);
  }
  return users;
};

// create posts
export const generatePosts = async (count: number) => {
  const userRepository = AppDataSource.getRepository(Users);
  const users = await userRepository.find();
  const authorIds = users.map((user) => user.id);

  const posts: Posts[] = [];
  for (let i = 0; i < count; i++) {
    const post = new Posts();
    post.isPrivate = true;
    post.title = faker.lorem.words(4);
    post.text = faker.lorem.sentence(2);
    post.createDate = faker.date.past();
    post.genre = faker.random.arrayElement([
      Genre.SPORT,
      Genre.OTHER,
      Genre.BUSINESS,
      Genre.POLITIC,
    ]);
    post.author = faker.random.arrayElement(authorIds);
    posts.push(post);
  }

  return posts;
};

const seed = async (AppDataSource: DataSource): Promise<void> => {
  try {
    const users = generateUsers(10);
    await AppDataSource.manager.save(users);
    console.log("Users seeded successfully");

    const posts = await generatePosts(50);
    await AppDataSource.manager.save(posts);
    console.log("Posts seeded successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};

(async () => {
  try {
    await AppDataSource.initialize();
    await seed(AppDataSource);
    await AppDataSource.destroy();
  } catch (error) {
    console.error("Unhandled error in seeding process:", error);
    process.exit(1);
  }
})();
