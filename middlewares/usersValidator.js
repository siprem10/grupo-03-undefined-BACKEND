
const { body } = require("express-validator");
const { getByEmail } = require("../repositories/users");

const isFirstNameValid = body("firstName")
  .notEmpty()
  .withMessage("firstName required");

const isLastNameValid = body("lastName")
  .notEmpty()
  .withMessage("lastName required");

const isEmailValid = body("email")
  .notEmpty()
  .withMessage("email required")
  .isEmail()
  .withMessage("email invalid")
  .custom(async (email) => {

    const findUser = await getByEmail(email);

    if(findUser) {
      throw new Error("User already exists!");
    }
  });

const isPwdValid = body("password")
  .notEmpty()
  .withMessage("password required")
  .isLength(8)
  .withMessage("password is short");

const postValidator = [
  isFirstNameValid,
  isLastNameValid,
  isEmailValid,
  isPwdValid
];

module.exports = {
  postValidator
};