const express = require('express');

const { errorMiddleware } = require('./middlewares/error.middleware');
const { createNewUserController,
  handleLoginController } = require('./controllers/users.controller');

const app = express();

app.use(express.json());

app.listen(3000, () => console.log('ouvindo porta 3000!'));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

app.post('/user', createNewUserController);

app.post('/login', handleLoginController);

app.use(errorMiddleware);
