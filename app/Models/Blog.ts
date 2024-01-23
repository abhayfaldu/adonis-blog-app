import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export default class Blog extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public description: string;

  @column({ prepare: (value: String) => JSON.stringify(value || {}) })
  public tags: string[];

  @column()
  public image: string;

  @column()
  public author: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async async (blog: Blog) {
    if (blog.$dirty.tags) {
      blog.tags = await blog.$dirty.tags.split(" ").join("").split(",")
    }
  }
}
