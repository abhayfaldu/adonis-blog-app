import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Route from "@ioc:Adonis/Core/Route";
import Blog from "App/Models/Blog";

async function getBlogs () {
  const res = await Blog.all()
  return res
}

Route.get("/", async (ctx: HttpContextContract) => {
  return ctx.view.render("welcome", { data: await getBlogs() });
})

Route.resource("/user", "UsersController");

Route.group(() => {
  Route.get("/login", "AuthController.loginForm");
  Route.post("/login", "AuthController.login");
  Route.post("/logout", "AuthController.logout");
}).prefix('/auth');

Route.resource("/blog", "BlogsController").middleware({'*':['auth:web']})