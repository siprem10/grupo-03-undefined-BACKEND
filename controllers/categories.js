const createHttpError = require('http-errors');
const { Category } = require("../database/models");
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');

module.exports = {
  getAll: catchAsync(async (req, res, next) => {
    try {
      const categories = await Category.findAll({ paranoid: true });

      if (!categories || !categories.length) {
        throw new Error("Categories not found");
      }

      endpointResponse({
        res,
        message: 'Categories retrieved successfully',
        body: categories,
      });

    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
  getById: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id, { paranoid: true });

      if (!category) {
        throw new Error(`Category with id ${id} not found`);
      }

      endpointResponse({
        res,
        message: 'Category retrieved successfully',
        body: category,
      });

    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),

  create: catchAsync(async (req, res, next) => {
    try {
      const { name } = req.body;

      const category = await Category.create({ name });

      endpointResponse({
        res,
        message: 'Category created successfully',
        body: category,
      });

    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),

  editById: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params.id;
      const { name } = req.body;

      const updated = await Category.update({ name }, { where: { id } });

      endpointResponse({
        res,
        message: 'Category updated successfully',
        body: updated,
      });

    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),

  deleteById: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params.id;

      const deleted = await Category.destroy({ where: { id } });

      endpointResponse({
        res,
        message: 'Category updated successfully',
        body: deleted,
      });

    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
};
