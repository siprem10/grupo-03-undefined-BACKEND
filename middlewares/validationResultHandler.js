const { validationResult } = require('express-validator');
const createHttpError = require('http-errors');

const validationResultHandler = (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    const httpError = createHttpError(
      400,
      errors.array()
    )
    next(httpError);
  }  
  next();
};

module.exports = validationResultHandler;