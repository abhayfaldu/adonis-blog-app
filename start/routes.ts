import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Route from "@ioc:Adonis/Core/Route";
import Blog from "App/Models/Blog";

Route.get("/", "BlogsController.index");

Route.resource("/user", "UsersController");

Route.group(() => {
  Route.get("/sign-in", "AuthController.signInForm")
  Route.post("/sign-in", "AuthController.signIn")
  Route.post("/logout", "AuthController.logout")
}).prefix('/auth');

Route.group(() => {
  Route.resource("/blog", "BlogsController").except(['index'])
  Route.get("/blog/user/:userId", "BlogsController.usersBlogs")
}).middleware(["auth:web"]);
