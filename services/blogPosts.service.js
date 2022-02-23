require('dotenv').config();

const Joi = require('joi');
const JWT = require('jsonwebtoken');
const errorHandling = require('../utils/errorHandling');

// const { BlogPost } = require('../models');

const blogPostSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  categoryIds: Joi.array().required(),
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

const createBlogPost = async (title, content, categoryIds, authorization) => {
  if (!authorization) throw errorHandling(401, 'Token not found');

  const token = await validateToken(authorization);
  const { id: userId } = token;
  
  const { error } = blogPostSchema.validate({ title, content, categoryIds });

  if (error) throw errorHandling(400, error.message);

  // const newPost = await BlogPost.create({ title, content });

  return { title, content, categoryIds, userId };
};

module.exports = {
  createBlogPost,
};