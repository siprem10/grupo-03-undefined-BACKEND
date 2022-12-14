const { header } = require("express-validator");
const { decodeToken } = require("../utils/jwt");

const roleValid = header("auth-token")
  .custom(async (token) => {
    
    if (decodeToken(token).roleId !== 1) {
      throw new Error("This user is unauthorized");
    }
  })
  .withMessage("This user is unauthorized");

const roleValidator = [roleValid];

module.exports = {
  roleValidator
};