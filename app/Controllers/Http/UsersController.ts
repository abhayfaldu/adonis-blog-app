import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

export default class UsersController {
  public async index() {
    const users = await User.all()
    return users;
  }

  public async create(ctx: HttpContextContract) {
    return ctx.view.render("auth/signup");
  }

  public async store(ctx: HttpContextContract) {
    const commonRules = [rules.required(), rules.trim()];

    const bodySchema = schema.create({
      name: schema.string([...commonRules, rules.maxLength(20)]),
      username: schema.string([...commonRules, rules.maxLength(20)]),
      email: schema.string([...commonRules, rules.email()]),
      password: schema.string([...commonRules, rules.minLength(6)]),
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

    const findUserWithEmail = await User.findBy("email", body.email);
    if (findUserWithEmail) {
      return ctx.response.status(400).json({ message: "Email already exists" });
    }

    await User.create(body);
    return ctx.view.render('auth/signIn');
  }
  
  public async show(ctx:HttpContextContract) {
    const user = await User.findOrFail(ctx.params.id)
    return ctx.view.render('user/profile', { user })
  }

  public async edit(ctx: HttpContextContract) {
    return ctx.view.render(`user/${ctx.params.id}/edit`)
  }

  public async update(ctx: HttpContextContract) {
    const user = await User.findOrFail(ctx.params.id)
    user.merge(ctx.request.only(
      [ "name", "username", "email", "password" ]
    ));
    return user;
  }

  public async destroy(ctx: HttpContextContract) {
    const user = await User.findOrFail(ctx.params.id);
    await user.delete();
    return user;
  }
}
