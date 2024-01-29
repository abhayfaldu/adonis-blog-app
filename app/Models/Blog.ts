import { BaseModel, BelongsTo, beforeSave, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import moment from "moment";
import User from './User';
export default class Blog extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public description: string;

  @column({ prepare: (value: String) => JSON.stringify(value || {}) })
  public tags: string | string[];

  @column()
  public image: string;

  @column()
  public userId: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  public serializeExtras() {
    return this.$extras;
  }

  public get date() {
    return moment(this.updatedAt.toISODate()).format("MMM DD, yyyy");
  }

  @beforeSave()
  public static async async(blog: Blog) {
    if (blog.$dirty.tags) {
      blog.tags = await blog.$dirty.tags.split(" ").join("").split(",");
    }
  }
}
