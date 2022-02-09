const { createNewUser } = require('../services/users.service');

const createNewUserController = async (req, res, next) => {
  try {
    const { displayName, email, password, image } = req.body;

    const newUser = await createNewUser(displayName, email, password, image);

    return res.status(201).send(newUser);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createNewUserController,
};
