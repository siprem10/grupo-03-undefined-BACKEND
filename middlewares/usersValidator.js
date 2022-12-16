const { body, param } = require('express-validator');
const { getByEmail, getById } = require('../repositories/users');

const isFirstNameValid = body('firstName')
  .notEmpty()
  .withMessage('firstName required');

const isLastNameValid = body('lastName')
  .notEmpty()
  .withMessage('lastName required');

const isEmailValid = body('email')
  .notEmpty()
  .withMessage('email required')
  .isEmail()
  .withMessage('email invalid')
  .custom(async (email) => {
    const findUser = await getByEmail(email);

    if (findUser) {
      throw new Error('El usuario ya está registrado!');
    }
  });

const isPwdValid = body('password')
  .notEmpty()
  .withMessage('password required')
  .isLength(8)
  .withMessage('password is short');


const isNewPwdValid = body('newPassword')
  .notEmpty()
  .withMessage('newPassword required')
  .isLength(8)
  .withMessage('newPassword is short');

const isUserExists = param('id')
  .custom(async (id) => {
    const findUser = await getById(id);

    if (!findUser) {
      throw new Error('No se encontró el usuario!');
    }
  });

const postValidator = [
  isFirstNameValid,
  isLastNameValid,
  isEmailValid,
  isPwdValid,
];

const updateProfileValidator = [
  isFirstNameValid,
  isLastNameValid,
  isUserExists
];

const updatePwdValidator = [
  isPwdValid,
  isNewPwdValid,
  isUserExists
];

module.exports = {
  postValidator,
  updateProfileValidator,
  updatePwdValidator,
};
