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
        `[Error retrieving user ${id}] - [index - GET]: ${error.message}`
      )
      next(httpError);
    }
  }),
  post: catchAsync(async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const response = await User.create({
        firstName,
        lastName,
        email,
        password
      })
      endpointResponse({
        res,
        message: `User posted successfully`,
        body: response
      })
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error creating user] - [index - POST]: ${error.message}`
      )
      next(httpError);
    }
  }),
  put: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = req.body;
      const response = await User.findByPk(id).update(user);
      endpointResponse({
        res,
        message: `User ${id} updated successfully`,
        body: response
      })
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error updating user] - [index - PUT]: ${error.message}`
      )
      next(httpError);
    }
  })
}
