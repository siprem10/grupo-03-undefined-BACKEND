const createHttpError = require('http-errors')
const { User } = require('../database/models')
const { endpointResponse } = require('../helpers/success')
const { catchAsync } = require('../helpers/catchAsync')

// example of a controller. First call the service, then build the controller method
module.exports = {
  getAll: catchAsync(async (req, res, next) => {
    try {
      const response = await User.findAll();
      endpointResponse({
        res,
        message: 'Users retrieved successfully',
        body: response
      })
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving users] - [index - GET]: ${error.message}`
      )
      next(httpError);
    }
  }),
  getById: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await User.findByPk(id);
      endpointResponse({
        res,
        message: `User ${id} retrieved successfully`,
        body: response
      })
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving users] - [index - GET]: ${error.message}`
      )
      next(httpError);
    }
  })
}
