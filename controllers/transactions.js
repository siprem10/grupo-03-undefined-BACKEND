const createHttpError = require('http-errors');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const { Transaction, Category } = require('../database/models');
const { decodeToken } = require('../utils/jwt');
const { Op } = require('sequelize');

module.exports = {

  get: catchAsync(async (req, res, next) => {
    try {

      const { name } = req.query;
      const findName = name ? name : "Ingreso";

      const token = req.header('auth-token');
      const decodedToken = decodeToken(token);

      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [
            { userId: decodedToken.id },
            { toUserId: decodedToken.id }
          ]
        }, include: [{
          model: Category, where: {
            name: {
              [Op.substring]: findName
            }
          }
        }]
      });

      if (!transactions || !transactions.length) {
        throw new Error(`No transaction with id ${id}`);
      }

      endpointResponse({
        res,
        message: 'Transaction retrieved successfully',
        body: transactions,
      });

    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        error.message
      );
      next(httpError);
    }
  }),

  getAll: catchAsync(async (req, res, next) => {
    try {

      const transactions = await Transaction.findAll({ include: [{ model: Category }] });

      endpointResponse({
        res,
        message: 'Transaction retrieved successfully',
        body: transactions,
      });

    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        error.message
      );
      next(httpError);
    }
  }),

  getById: catchAsync(async (req, res, next) => {
    try {

      const { id } = req.params;

      const transaction = await Transaction.findOne({ where: { id }, include: [{ model: Category }] });

      if (!transaction) {
        throw new Error(`No transaction with id ${id}`);
      }

      endpointResponse({
        res,
        message: 'Transaction retrieved successfully',
        body: transaction,
      });

    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        error.message
      );
      next(httpError);
    }
  }),

  create: catchAsync(async (req, res, next) => {
    try {

      const token = req.header('auth-token');
      const decodedToken = decodeToken(token);

      const { concept, categoryId, amount, toUserId } = req.body;

      const transaction = await Transaction.create({
        concept,
        amount,
        userId: decodedToken.id,
        toUserId,
        categoryId,
      });

      endpointResponse({
        res,
        message: 'Transaction created successfully',
        body: transaction,
      });

    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        error.message
      );
      next(httpError);
    }
  }),

  editById: catchAsync(async (req, res, next) => {
    try {
      const { concept } = req.body;
      const { id } = req.params;

      const transaction = await Transaction.update({ concept }, {
        where: { id: id },
      });

      endpointResponse({
        res,
        message: 'Transaction updated successfully',
        body: transaction,
      });

    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        error.message
      );
      next(httpError);
    }
  }),

  deleteById: catchAsync(async (req, res, next) => {
    const { id } = req.params;
    try {
      const deleted = await Transaction.destroy({ where: { id: id } });

      if (!deleted) {
        throw new Error(`Transaction with id ${id} was already deleted`);
      }
      endpointResponse({
        res,
        message: `Transaction ${id} deleted successfully`,
      });

    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        error.message
      );
      next(httpError);
    }
  }),
};
