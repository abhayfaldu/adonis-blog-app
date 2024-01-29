import { test } from '@japa/runner'

test('display blog/blog-list page', async ({ client }) => {
  const response = await client.get('/')

  response.assertStatus(200)
  response.assertTextIncludes('<h1 class="title"> It Works! </h1>')
})
