const { createBlogPost,
  getPosts } = require('../services/blogPosts.service');

const createBlogPostController = async (req, res, next) => {
  try {
    const { title, content, categoryIds } = req.body;
    const { authorization } = req.headers;

    console.log(req.body);

    const newPost = await createBlogPost(title, content, categoryIds, authorization);

    return res.status(201).json(newPost);
  } catch (error) {
    return next(error);
  }
};

const getPostsController = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const posts = await getPosts(authorization);

    return res.status(200).json(posts);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createBlogPostController,
  getPostsController,
};