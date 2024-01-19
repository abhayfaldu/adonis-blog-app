/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route';

// Route.get('/', async ({ view }) => view.render('welcome'))

Route.post("/signup", 'AuthController.signup')
Route.post("/login", 'AuthController.login')

Route.get("/", "BlogsController.read");

// Route.resource('/abhay', 'asdfasdf11')
// Route.resource("/gaurav", "asdfasdf").apiOnly();


Route.group(() => {
  // Route.resource('/', "BlogsController").apiOnly().except(['index', 'show']);
  Route.post("/create", "BlogsController.create");
  Route.put("/update/:id", "BlogsController.update");
  Route.delete("/delete/:id", "BlogsController.delete");
}).middleware('auth').prefix("blog");

// Route.post("/blog", )