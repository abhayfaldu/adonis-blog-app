import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Blog from "App/Models/Blog";

export default class BlogsController {
  public async create({request, auth}:HttpContextContract) {
    console.log(auth);
    
    try {
      const { title, content, image, tags, author } = request.body();
      
      const blog = new Blog();
      blog.title = title;
      blog.content = content;
      blog.image = image;
      blog.tags = tags;
      blog.author = author;

      await blog.save();
      return blog;
    } catch (error) {
      throw new Error(error);
    }
  }
  public async read() {
    try {
      const blogs = await Blog.all()
      return blogs;
    } catch (error) {
      throw new Error(error);
    }
  }
  public async update({ request, params }: HttpContextContract) {
    try {
      const { id } = params;

      const blog = await Blog.findByOrFail("id", id);
      
      blog.merge(request.only(
        [ "title", "content", "tags", "image", "author" ]
      ));
      await blog.save()

      return blog
    } catch (error) {
      throw new Error(error);
    }
  }
  public async delete({ params }: HttpContextContract) {
    try {
      const { id } = params;
      const blog = await Blog.findByOrFail('id', id)
      await blog.delete()
      return blog
    } catch (error) {
      throw new Error(error);
    }
  }
}
