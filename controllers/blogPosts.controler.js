const { createBlogPost,
  getPosts,
  getPostById,
  deletePostById,
  updatePostById } = require('../services/blogPosts.service');

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

const getPostByIdController = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const { id } = req.params;

    const post = await getPostById(authorization, id);

    return res.status(200).json(post);
  } catch (error) {
    return next(error);
  }
};

const deletePostByIdController = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const { id } = req.params;

    await deletePostById(authorization, id);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const updatePostByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { authorization } = req.headers;

    const uptadedPost = await updatePostById(req.body, authorization, id);

    return res.status(200).json(uptadedPost);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createBlogPostController,
  getPostsController,
  getPostByIdController,
  deletePostByIdController,
  updatePostByIdController,
};