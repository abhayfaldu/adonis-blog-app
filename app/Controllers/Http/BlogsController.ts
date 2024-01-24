import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Blog from "App/Models/Blog";

export default class BlogsController {
  public async index() {
    const blogs = await Blog.all()
    return blogs;
  }

  public async create(ctx: HttpContextContract) {
    if (await ctx.auth.use('web').authenticate()) {
      return ctx.view.render('blog/create_blog')
    }
  }

  public async store(ctx:HttpContextContract) {
    const rulesForAllFields = [rules.required(), rules.trim()];

    const bodySchema = schema.create({
      title: schema.string([
        ...rulesForAllFields,
        rules.maxLength(100),
        rules.minLength(1),
      ]),
      description: schema.string([ ...rulesForAllFields, rules.minLength(1) ]),
      image: schema.string([ ...rulesForAllFields ]),
      tags: schema.string([ ...rulesForAllFields ])
    });

    const messages = {
      required: "the {{ field }} is required.",
      minLength:
        "{{ field }} must be al least {{ options.minLength }} characters.",
      maxLength:
        "{{ field }} must be not be more then {{ options.maxLength }} characters.",
    };

    const body = await ctx.request.validate({
      schema: bodySchema,
      messages,
    });

    const blog = await Blog.create(body);
    return blog;
  }

  public async show(ctx:HttpContextContract) {
    const id = ctx.params.id
    const blog = await Blog.findByOrFail('id', id)
    return blog;
  }

  public async edit(ctx: HttpContextContract) {
    const id = ctx.params.id
    return ctx.view.render(`blog/${id}/edit_blog`)
  }

  public async update(ctx: HttpContextContract) {
    const id = ctx.params.id
    const blog = await Blog.findByOrFail("id", id);
    blog.merge(ctx.request.only(
      [ "title", "description", "tags", "image", "author" ]
    ));
    await blog.save()
    return blog
  }

  public async destroy(ctx: HttpContextContract) {
    const id = ctx.params.id;
    const blog = await Blog.findByOrFail('id', id)
    await blog.delete()
    return blog
  }
}