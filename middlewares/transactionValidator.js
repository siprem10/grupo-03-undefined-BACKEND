const { body } = require('express-validator');

const isUserId = body('userId')
  .notEmpty()
  .withMessage('userId required')
  .isNumeric()
  .withMessage('userId must be a number');

const isCategoryId = body('categoryId')
  .notEmpty()
  .withMessage('categoryId required')
  .isNumeric()
  .withMessage('categoryId must be a number');

const isAmount = body('amount')
  .notEmpty()
  .withMessage('amount required')
  .isNumeric()
  .withMessage('amount must be a number');

const isDate = body('date')
  .notEmpty()
  .withMessage('date required')
  .isDate()
  .withMessage('date must be a date');

const postValidator = [isUserId, isCategoryId, isAmount, isDate];

module.exports = {
  postValidator,
};
