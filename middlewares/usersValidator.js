
const { body } = require("express-validator");

const isEmailValid = body("email")
  .notEmpty()
  .withMessage("email required")
  .isEmail()
  .withMessage("email invalid")

const postValidator = [
  isEmailValid,
];

module.exports = {
  postValidator
};