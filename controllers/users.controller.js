const { createNewUser,
  handleLogin,
  getUsers } = require('../services/users.service');

const createNewUserController = async (req, res, next) => {
  try {
    const { displayName, email, password, image } = req.body;

    const newUser = await createNewUser(displayName, email, password, image);

    return res.status(201).send(newUser);
  } catch (error) {
    return next(error);
  }
};

const handleLoginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const newLoginToken = await handleLogin(email, password);

    return res.status(200).json(newLoginToken);
  } catch (error) {
    return next(error);
  }
};

const getUsersController = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const usersList = await getUsers(authorization);

    return res.status(200).json(usersList);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createNewUserController,
  handleLoginController,
  getUsersController,
};
