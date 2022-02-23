const { createBlogPost } = require('../services/blogPosts.service');

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

module.exports = {
  createBlogPostController,
};