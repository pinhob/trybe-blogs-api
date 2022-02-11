const { createNewCategory,
  getCategories } = require('../services/categories.service');

const createNewCategoryController = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { authorization } = req.headers;

    const newCategory = await createNewCategory(name, authorization);

    return res.status(201).json(newCategory);
  } catch (error) {
    return next(error);
  }
};

const getCategoriesController = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    
    const categories = await getCategories(authorization);

    return res.status(200).json(categories);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createNewCategoryController,
  getCategoriesController,
};