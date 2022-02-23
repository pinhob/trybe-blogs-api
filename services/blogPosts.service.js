require('dotenv').config();

const Joi = require('joi');
const JWT = require('jsonwebtoken');
const errorHandling = require('../utils/errorHandling');

const { BlogPost, PostsCategory, Category, User } = require('../models');

const blogPostSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  categoryIds: Joi.array().required(),
});

const updatePostSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

const validateToken = async (authorization) => {
  if (!authorization) throw errorHandling(401, 'Token not found');

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

const getPosts = async (authorization) => {
  await validateToken(authorization);

  const posts = await BlogPost.findAll({
    include: [
      { model: Category, as: 'categories' },
      { model: User, as: 'user' },
    ],
  });

  return posts;
};

const getPostById = async (authorization, id) => {
  await validateToken(authorization);

  const post = await BlogPost.findOne({
    where: { id },
    include: [
      { model: Category, as: 'categories', through: { attributes: [] } },
      { model: User, as: 'user' },
    ],
  });

  if (!post) throw errorHandling(404, 'Post does not exist');

  return post;
};

const deletePostById = async (authorization, id) => {
  const token = await validateToken(authorization);

  const post = await BlogPost.findByPk(id);

  if (!post) throw errorHandling(404, 'Post does not exist');

  const userIsPostAuthor = post.userId === token.id;

  if (!userIsPostAuthor) throw errorHandling(401, 'Unauthorized user');

  await BlogPost.destroy({
    where: { id },
  });

  return true;
};

const updatePostById = async (title, content, categoryIds, authorization, id) => {
  const token = await validateToken(authorization);

  const { error } = updatePostSchema.validate({ title, content });

  if (error) throw errorHandling(400, error.message);

  if (categoryIds) throw errorHandling(400, 'Categories cannot be edited');

  const post = await BlogPost.findOne({
    where: { id },
    include: [
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });

  const userIsPostAuthor = post.userId === token.id;

  if (!userIsPostAuthor) throw errorHandling(401, 'Unauthorized user');

  if (!post) throw errorHandling(404, 'Post does not exist');

  await post.update({ title, content });

  return post;
};

module.exports = {
  createBlogPost,
  getPosts,
  getPostById,
  deletePostById,
  updatePostById,
};