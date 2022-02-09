const Joi = require('joi');
const errorHandling = require('../utils/errorHandling');

const newUserSchema = Joi.object({
  displayName: Joi.string().min(8),
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
});

const createNewUser = async (displayName, email, password, image) => {
  const { error } = newUserSchema.validate({ displayName, email, password });

  if (error) throw errorHandling(400, error.message);

  return { message: 'xablau' };
};

module.exports = {
  createNewUser,
};
