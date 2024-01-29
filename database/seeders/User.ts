import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        email: "default@example.com",
        password: "qwerty",
        name: "Abhay Default",
        username: "AbhayFaldu",
      },
      {
        email: "default1@example.com",
        password: "qwerty",
        name: "Gaurav Default",
        username: "AbhayFaldu",
      },
    ]);
  }
}
