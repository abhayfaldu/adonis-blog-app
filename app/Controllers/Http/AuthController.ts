import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import User from "App/Models/User";

export default class AuthController {
  public async signup(ctx: HttpContextContract) {
      const userWithEmail = await User.findBy("email", ctx.request.body().email);

      if (userWithEmail) {
        return ctx.response
          .status(400)
          .json({ message: "Email already exists" });
      }

      const body = await ctx.request.validate({
        schema: schema.create({
          name: schema.string(),
          email: schema.string({}, [rules.email()]),
          password: schema.string(),
        }),
      });

      const user = await User.create(body);
      // const user = new User();
      // user.name = body.name;
      // user.email = body.email;
      // user.password = body.password;
      // await user.save();

      return user;
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const req = await request.validate({
      schema: schema.create({
        email: schema.string({}, [rules.email()]),
        password: schema.string(),
      }),
    });

    try {
      await auth.use("web").attempt(req.email, req.password);
      return { user: auth.user?.name, isLoggedIn: auth.isLoggedIn}
    } catch {
      return response.badRequest("Invalid credentials");
    }
  }
}
