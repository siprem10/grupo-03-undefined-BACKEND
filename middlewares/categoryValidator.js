
const { body } = require("express-validator");

const isNameValid = body("name")
  .notEmpty()
  .withMessage("name required")
  .isString()
  .withMessage("name invalid");

const putValidator = [
    isNameValid
];
const postValidator = [
    isNameValid
];

module.exports = {
  putValidator,
  postValidator
};