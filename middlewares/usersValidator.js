const { body } = require('express-validator');
const { getByEmail } = require('../repositories/users');
const db = require('../database/models');
const { compare } = require('bcrypt');

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
      throw new Error('User already exists!');
    }
  });

const isPwdValid = body('password')
  .notEmpty()
  .withMessage('password required')
  .isLength(8)
  .withMessage('password is short');

const postValidator = [
  isFirstNameValid,
  isLastNameValid,
  isEmailValid,
  isPwdValid,
];

const currentPasswordIncorrect = async (req, res, next) => {
  const { currentPassword } = req.body;
  const { id } = req.params;
  const user = await db.User.findByPk(id);

  const correctPassword = await compare(currentPassword, user.password);

  if (currentPassword && !correctPassword)
    return res.status(401).send({
      error:
        'La contraseña actual es incorrecta, intentelo de nuevo, o recupere su contraseña.',
    });
  next();
};

const emailsExists = async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;
  const user = await db.User.findByPk(id);

  const userEmailExists = await db.User.findAll({ where: { email } });

  if (user.email !== email && userEmailExists.length) {
    return res.status(401).send({
      error: 'El email ya fue registrado, proporcione otro o inicie sesión.',
    });
  }

  next();
};

const updateValidator = [
  isFirstNameValid,
  isLastNameValid,
  emailsExists,
  currentPasswordIncorrect
];

module.exports = {
  postValidator,
  updateValidator,
};
