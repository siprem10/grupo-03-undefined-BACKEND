const { body } = require('express-validator');
const User = require("../repositories/users");
const Category = require("../repositories/category");

const isConcept = body('concept')
  .notEmpty()
  .withMessage('concept required')
  .isString()
  .withMessage('concept must be a string')
  .custom(async (concept) => {

    if(concept.length > 20){
      throw new Error("concept very long!");
    }
  });

const isToUserId = body("toUserId")
  .custom(async (toUserId) => {

    if(toUserId){
      const findUser = await User.getById(toUserId);

      if (!findUser) {
        throw new Error("User not found!");
      }
    }
  });

const isAmount = body('amount')
  .notEmpty()
  .withMessage('amount required')
  .isNumeric()
  .withMessage('amount must be a number')
  .custom(async (amount) => {
    if (amount <= 0) {
      throw new Error("cannot be (amount <= 0)");
    }
  });

const putValidator = [isConcept];
const postValidator = [isToUserId, /*isCategoryId,*/ isAmount];

module.exports = {
  putValidator,
  postValidator,
};
