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

const handleLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
});

const validateToken = async (authorization) => {
  const tokenInfos = await JWT.verify(authorization,
    process.env.JWT_SECRET,
    (err, decodedInfos) => {
    if (err) throw errorHandling(401, 'Expired or invalid token');

    return decodedInfos;
  });

  return tokenInfos;
};

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

const handleLogin = async (email, password) => {
  const { error } = handleLoginSchema.validate({ email, password });

  if (error) throw errorHandling(400, error.message);
  
  const emailAlreadyExists = await User.findOne({ where: { email } });

  console.log('return:', emailAlreadyExists);

  if (!emailAlreadyExists) throw errorHandling(400, 'Invalid fields');

  const { id, password: storedPassword } = emailAlreadyExists;
  
  const passwordsMatch = password === storedPassword;

  console.log('passwords', passwordsMatch);

  if (!passwordsMatch) throw errorHandling(400, 'Invalid fields');

  const token = JWT.sign({ id, email }, process.env.JWT_SECRET);

  return { token };
};

const getUsers = async (authorization) => {
  if (!authorization) throw errorHandling(401, 'Token not found');

  JWT.verify(authorization, process.env.JWT_SECRET, (err, decodedInfos) => {
    if (err) throw errorHandling(401, 'Expired or invalid token');

    return decodedInfos;
  });

  const usersStoredObj = await User.findAll();

  const userList = Object.values(usersStoredObj);

  return userList;
};

const getUserById = async (id, authorization) => {
  if (!authorization) throw errorHandling(401, 'Token not found');

  await validateToken(authorization);

  const user = await User.findByPk(id);

  if (!user) throw errorHandling(404, 'User does not exist');

  const { dataValues: userInfos } = user;

  return { ...userInfos };
};

module.exports = {
  createNewUser,
  handleLogin,
  getUsers,
  getUserById,
};
