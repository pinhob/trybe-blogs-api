require('dotenv').config();

const Joi = require('joi');
const JWT = require('jsonwebtoken');
const errorHandling = require('../utils/errorHandling');

const { Category } = require('../models');

const categoriesSchema = Joi.object({
  name: Joi.string().required(),
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

const createNewCategory = async (name, authorization) => {
  if (!authorization) throw errorHandling(401, 'Token not found');

  await validateToken(authorization);

  const { error } = categoriesSchema.validate({ name });

  if (error) throw errorHandling(400, error.message);

  const category = await Category.create({ name });

  return category;
};

module.exports = {
  createNewCategory,
};