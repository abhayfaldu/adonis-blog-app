import Hash from "@ioc:Adonis/Core/Hash";
import { BaseModel, beforeSave, column, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import Blog from 'App/Models/Blog';
import { DateTime } from "luxon";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public username: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public avatar: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @hasMany(() => Blog)
  public blogs: HasMany<typeof Blog>;
}
