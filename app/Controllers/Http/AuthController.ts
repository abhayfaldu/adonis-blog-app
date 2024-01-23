import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Blog from "App/Models/Blog"

export default class AuthController {
  public async loginForm(ctx: HttpContextContract) {
    return ctx.view.render("auth/login");
  }

  public async login(ctx: HttpContextContract) {
    const rulesForAllFields = [rules.required(), rules.trim()];

    const bodySchema = schema.create({
      email: schema.string([...rulesForAllFields, rules.email()]),
      password: schema.string([...rulesForAllFields, rules.minLength(8)]),
    });

    const messages = {
      required: "the {{ field }} is required.",
      minLength:
        "{{ field }} must be al least {{ options.minLength }} characters.",
    };

    const body = await ctx.request.validate({
      schema: bodySchema,
      messages,
    });

    await ctx.auth.use("web").attempt(body.email, body.password);
    return ctx.response.redirect('/')
  }
}
