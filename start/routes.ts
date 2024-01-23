import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Route from "@ioc:Adonis/Core/Route";
import Blog from "App/Models/Blog";

const getBlogs = async () => {
  const res = await Blog.all()
  return JSON.stringify(res);
}

// let state = {
//   data: [
//     { title: 'something' },
//     { title: 'something 1' },
//     { title: 'something 2' },
//     { title: 'something 3' },
//     { title: 'something 4' },
//     { title: 'something 5' },
//     { title: 'something 6' }
//   ]
// }


const state = {data: getBlogs()}
console.log(state);

Route.get("/", (ctx: HttpContextContract) => {
  return ctx.view.render("welcome", state);
});


Route.resource("/user", "UsersController");

Route.get("/auth/login", "AuthController.loginForm");
Route.post("/auth/login", "AuthController.login");

Route.resource("/blog", "BlogsController");