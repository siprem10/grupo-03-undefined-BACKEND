
const { body } = require("express-validator");

const isEmailValid = body("email")
  .notEmpty()
  .withMessage("email required")
  .isEmail()
  .withMessage("email invalid");

const isPwdValid = body("password")
  .notEmpty()
  .withMessage("password required");

const postValidator = [
    isEmailValid,
    isPwdValid
];

module.exports = {
  postValidator
};