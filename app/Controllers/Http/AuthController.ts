import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
export default class AuthController {
  public async login(ctx: HttpContextContract) {
    const req = await ctx.request.validate({
      schema: schema.create({
        email: schema.string({}, [rules.email()]),
        password: schema.string(),
      }),
    });

    try {
      await ctx.auth.use("web").attempt(req.email, req.password);
      return { user: ctx.auth.user?.name, isLoggedIn: ctx.auth.isLoggedIn };
    } catch {
      return ctx.response.badRequest("Invalid credentials");
    }
  }
}
