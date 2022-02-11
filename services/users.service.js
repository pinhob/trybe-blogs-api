require('dotenv').config();

const Joi = require('joi');
const JWT = require('jsonwebtoken');
const errorHandling = require('../utils/errorHandling');

const { User } = require('../models');

const newUserSchema = Joi.object({
  displayName: Joi.string().min(8),
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
  image: Joi.string(),
});

const createNewUser = async (displayName, email, password, image) => {
  const { error } = newUserSchema.validate({ displayName, email, password, image });

  if (error) throw errorHandling(400, error.message);
  
  const emailAlreadyExists = await User.findOne({ where: { email } });

  if (emailAlreadyExists) throw errorHandling(409, 'User already registered');

  const newUser = await User.create({ displayName, email, password, image });

  const { id } = newUser;

  const token = JWT.sign({ id, email }, process.env.JWT_SECRET);

  return { token };
};

module.exports = {
  createNewUser,
};
