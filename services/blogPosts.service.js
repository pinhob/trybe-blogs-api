require('dotenv').config();

const Joi = require('joi');
const JWT = require('jsonwebtoken');
const errorHandling = require('../utils/errorHandling');

const { BlogPost, PostsCategory, Category } = require('../models');

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

// Com base nas soluções dos colegas Caê Calçolari e Aleilton Chavenco: https://github.com/tryber/sd-013-c-project-blogs-api/pull/69/files e https://github.com/tryber/sd-013-c-project-blogs-api/pull/38/files
const verifyIfCategoriesExists = async (categoryIds) => Promise.all(
  await categoryIds.map(async (id) => {
    const findCategoryById = await Category.findByPk(id);

    if (!findCategoryById) throw errorHandling(400, '"categoryIds" not found');

    return true;
  }),
);

const createBlogPost = async (title, content, categoryIds, authorization) => {
  if (!authorization) throw errorHandling(401, 'Token not found');

  const token = await validateToken(authorization);
  const { id: userId } = token;
  
  const { error } = blogPostSchema.validate({ title, content, categoryIds });

  if (error) throw errorHandling(400, error.message);

  await verifyIfCategoriesExists(categoryIds);

  const newPost = await BlogPost.create({ title, content, userId });

  // inspirado no código do colega Aleiton: https://github.com/tryber/sd-013-c-project-blogs-api/pull/69/files#
  await categoryIds.forEach(async (category) => {
    await PostsCategory.create({ postId: newPost.id, categoryId: category });
  });

  return newPost;
};

module.exports = {
  createBlogPost,
};