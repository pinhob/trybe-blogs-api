const Joi = require('joi');
const errorHandling = require('../middlewares/error.middleware');

const newUserSchema = Joi.object({
  displayName: Joi.string().min(8),
  email: Joi.string().email().required(),
  password: Joi.string().equal(6).required(),
  image: Joi.string(),
});

const createNewUser = (displayName, email, password, image) => {
  const { error } = newUserSchema.validate({ displayName, email, password, image });

  if (error) throw errorHandling(400, error.message);

  return { message: 'xablau' };
};

module.exports = {
  createNewUser,
};
