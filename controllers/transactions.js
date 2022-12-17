const createHttpError = require('http-errors');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const { Transaction, Category, User } = require('../database/models');
const { decodeToken } = require('../utils/jwt');
const { Op } = require('sequelize');

module.exports = {

  get: catchAsync(async (req, res, next) => {
    try {

      const token = req.header('auth-token');
      const decodedToken = decodeToken(token);

      const transactions = await Transaction.findAll({
        order: [['createdAt', 'DESC']],
        where: {
          [Op.or]: [
            { userId: decodedToken.id },
            { toUserId: decodedToken.id }
          ]
        }, include: [
          { model: Category },
          { model: User, as: "user", paranoid: false, attributes: { exclude: ['password'] } },
          { model: User, as: "toUser", paranoid: false, attributes: { exclude: ['password'] } },
        ]
      });

      if (!transactions || !transactions.length) {
        throw new Error(`No se encontraron transacciones!`);
      }

      endpointResponse({
        res,
        message: 'Transacciones recibidas correctamente!',
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

      const transactions = await Transaction.findAll({ include: [{ model: Category }], order: [['createdAt', 'ASC']] });

      endpointResponse({
        res,
        message: 'Transacciones recibidas correctamente!',
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
        throw new Error(`No se encontró la transacción!`);
      }

      endpointResponse({
        res,
        message: 'Transacción recibida correctamente!',
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

      const { concept, categoryId, amount } = req.body;
      let { toUserId } = req.body;
      let type = "???";
      
      if(categoryId) {
        type = "Egreso";
      }
      else if(!toUserId) {
        toUserId = decodedToken.id;
        type = "Ingreso";
      }      
      else {
        type = "Egreso";
      }    

      const transaction = await Transaction.create({
        concept,
        amount,
        userId: decodedToken.id,
        toUserId: toUserId ? toUserId : null,
        categoryId: categoryId ? categoryId : null,
        type,
      });

      endpointResponse({
        res,
        message: 'Transacción creada correctamente!',
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
        message: 'Transacción actualizada correctamente!',
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
        throw new Error(`No se pudo borrar la transacción porque no existe!`);
      }
      endpointResponse({
        res,
        message: `Transacción borrada correctamente!`,
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
