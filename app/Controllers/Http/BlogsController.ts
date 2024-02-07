import Application from '@ioc:Adonis/Core/Application';
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Blog from "App/Models/Blog";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises'; // Note: Using fs.promises for promise-based file operations
// import path from 'path';

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
    const image = ctx.request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'png', 'gif', 'avif', 'jpeg'],
    })
    
    if (!image) {
      return ctx.response.json({message: 'Image not found'})
    }
    if (!image.isValid) {
      return image.errors
    }
    const fileName = `${Date.now()}_${image.clientName}`;
    if (image) {
      await image.move(Application.tmpPath('uploads'), { name: fileName })
    }
    const filePath = Application.tmpPath('uploads') + "/" + fileName;
    
    let image_url
    await cloudinary.uploader
      .upload(filePath)
      .then(async (result) => {
        image_url = result.secure_url
        await fs.unlink(filePath)
      });

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
    
    const updatedBody = {
      ...body,
      user_id: ctx.auth?.user?.id,
      image: image_url,
    };
    
    const blog = await Blog.create(updatedBody);
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
  
  public async extractFirstPTagContent(htmlString) {
    // Use a regular expression to match the content of the first <p> tag
    if (!htmlString) {
      const match = /<p>(.*?)<\/p>/i.exec(htmlString);

      // If a match is found, extract the content
      if (match && match[1]) {
        const textContent = match[1];

        // Return the entire content if it's less than 100 characters
        if (textContent.length <= 100) {
          return textContent;
        }

        // Extract the first 100 characters and add three dots
        const truncatedContent = textContent.substring(0, 100) + '...';
        return truncatedContent;
      }
    }
    return null; // Return null if no <p> tags are found
  }
}
