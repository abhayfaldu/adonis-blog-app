import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";

export default class AuthController {
  public async signInForm(ctx: HttpContextContract) {
    return ctx.view.render("auth/signIn");
  }

  public async signIn(ctx: HttpContextContract) {
    const bodySchema = schema.create({
      email: schema.string.optional([rules.trim(), rules.email()]),
      password: schema.string(),
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

    try {
      await ctx.auth.use("web").attempt(body.email, body.password);
    } catch (error) {
      const state = { error: { statusCode: 404, message: error} }
      return ctx.view.render('errors/not-found', state)
    }
    return ctx.response.redirect('/')
  }

  public async logout(ctx: HttpContextContract) {
    await ctx.auth.logout()
    return ctx.response.redirect('/')
  }
}
