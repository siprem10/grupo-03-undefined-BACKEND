const createHttpError = require('http-errors');
const { Category } = require("../database/models");
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');

module.exports = {
  getAll: catchAsync(async (req, res, next) => {
    try {
      const categories = await Category.findAll({ paranoid: true });

      if (!categories || !categories.length) {
        throw new Error("Categorias no encontradas!");
      }

      endpointResponse({
        res,
        message: 'Categorias recibidas correctamente!',
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
        throw new Error(`Categoria no encontrada!`);
      }

      endpointResponse({
        res,
        message: 'Categoria recibida correctamente!',
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
        message: 'Categoria creada correctamente!',
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
        message: 'Categorias actualizada correctamente!',
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
        message: 'Categoria borrada correctamente!',
        body: deleted,
      });

    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
};
