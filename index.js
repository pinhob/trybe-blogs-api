const express = require('express');

const { errorMiddleware } = require('./middlewares/error.middleware');
const { createNewUserController,
  handleLoginController,
  getUsersController,
  getUserByIdController,
  deleteUserController } = require('./controllers/users.controller');

const { createNewCategoryController,
  getCategoriesController } = require('./controllers/categories.controller');

const { createBlogPostController,
  getPostsController,
  getPostByIdController,
  deletePostByIdController,
  updatePostByIdController } = require('./controllers/blogPosts.controler');

const app = express();

app.use(express.json());

app.listen(3000, () => console.log('ouvindo porta 3000!'));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

app.post('/user', createNewUserController);

app.post('/login', handleLoginController);

app.get('/user', getUsersController);

app.get('/user/:id', getUserByIdController);

app.post('/categories', createNewCategoryController);

app.get('/categories', getCategoriesController);

app.post('/post', createBlogPostController);

app.get('/post', getPostsController);

app.get('/post/:id', getPostByIdController);

app.put('/post/:id', updatePostByIdController);

app.delete('/post/:id', deletePostByIdController);

app.delete('/user/me', deleteUserController);

app.use(errorMiddleware);
