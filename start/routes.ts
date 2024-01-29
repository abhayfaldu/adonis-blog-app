import Route from "@ioc:Adonis/Core/Route";

Route.get("/", "BlogsController.index");

Route.group(() => {
  Route.get("/sign-in", "AuthController.signInForm")
  Route.post("/sign-in", "AuthController.signIn")
  Route.post("/logout", "AuthController.logout")
}).prefix('/auth');

Route.resource("/user", "UsersController").middleware({
  "show": "auth",
  "update": "auth",
  "destroy": "auth",
})

Route.group(() => {
  Route.resource("/blog", "BlogsController").except(['index'])
  Route.get("/blog/user/:userId", "BlogsController.usersBlogs")
}).middleware(["auth:web"]);
