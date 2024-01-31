import Application from '@ioc:Adonis/Core/Application';
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Blog from "App/Models/Blog";
// import { uploadImage } from 'Config/cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default class BlogsController {
  public async index(ctx: HttpContextContract) {
    const data = await Blog.query()
      .leftJoin('users', 'users.id', '=', 'blogs.user_id')
      .select('blogs.*', 'users.name as user_name');
    return ctx.view.render("blog/blog-list", { data });
  }

  public async create(ctx: HttpContextContract) {
    const user = ctx.auth?.user;
    return ctx.view.render("blog/create_blog", { user });
  }

  public async store(ctx: HttpContextContract) {

    // validation
    const bodySchema = schema.create({
      title: schema.string([
        rules.trim(),
        rules.maxLength(100),
      ]),
      description: schema.string.optional([rules.trim()]),
      tags: schema.string([rules.trim()]),
    });

    const messages = {
      required: "the {{ field }} is required.",
      maxLength:
        "{{ field }} must be not be more then {{ options.maxLength }} characters.",
    };

    const body = await ctx.request.validate({
      schema: bodySchema,
      messages,
    });

    const bodyWithAuthor = { ...body, user_id: ctx.auth?.user?.id };
    const blog = await Blog.create(bodyWithAuthor);

    return ctx.response.redirect(`/blog/${blog.id}`);
  }

  public async show(ctx: HttpContextContract) {
    const data = await Blog.query()
      .where("id", ctx.params.id)
      .preload("user")
      .first();
    if (data) {
      return ctx.view.render("blog/single_blog", { data });
    }
  }

  public async edit(ctx: HttpContextContract) {
    const data = await Blog.findOrFail(ctx.params.id);
    return ctx.view.render(`blog/edit_blog`, { data });
  }

  public async update(ctx: HttpContextContract) {
    const blog = await Blog.findOrFail(ctx.params.id);

    const commonRules = [rules.trim()];
    const bodySchema = schema.create({
      title: schema.string.optional([
        ...commonRules,
        rules.maxLength(100),
        rules.minLength(1),
      ]),
      description: schema.string.optional([...commonRules, rules.minLength(1)]),
      image: schema.string.optional([...commonRules]),
      tags: schema.string.optional([...commonRules]),
    });

    const body = await ctx.request.validate({ schema: bodySchema });
    await blog.merge(body).save();
    return ctx.response.redirect(`/blog/${blog.id}`);
  }

  public async destroy(ctx: HttpContextContract) {
    await Blog.query().where('id', ctx.params.id).delete();
    return ctx.response.redirect('/');
  }

  public async usersBlogs(ctx: HttpContextContract) {
    const data = await Blog.query()
      .leftJoin("users", "users.id", "=", "blogs.user_id")
      .where('user_id', ctx.auth!.user!.id)
      .select("blogs.*", "users.name as user_name");
    return ctx.view.render("blog/blog-list", { data, isDelete: true });
  }
}
