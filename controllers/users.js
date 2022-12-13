const createHttpError = require('http-errors');
const { User } = require('../database/models');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const bcrypt = require('bcrypt');
const { getUser } = require('../repositories/users');

module.exports = {
  getAll: catchAsync(async (req, res, next) => {
    try {
      const response = await User.findAll({
        attributes: { exclude: ['password'] },
      });

      endpointResponse({
        res,
        message: 'Users retrieved successfully',
        body: response,
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
  getById: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await getUser(id);

      if(!user) {
        throw new Error("Usuario no encontrado!")
      }
      
      endpointResponse({
        res,
        message: `User ${id} retrieved successfully`,
        body: user,
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
  createUser: catchAsync(async (req, res, next) => {
  try {
      const { firstName, lastName, email, password } = req.body;
      let hashedPassword = await bcrypt.hash(password, 10);

      const response = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      endpointResponse({
        res,
        message: `User posted successfully`,
        body: response,
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
  updateUser: catchAsync(async (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    try {
      const { firstName, lastName, email, newPassword } = req.body;
      const { id } = req.params;
      const response = await User.findByPk(id);
      
      const user = {
        firstName,
        lastName,
        email,
        avatar: req.file
          ? `${url}/uploads/${req.file.filename}`
          : response.avatar,
      };

      if (newPassword) user.password = await bcrypt.hash(newPassword, 10);
      response.update(user);

      endpointResponse({
        res,
        message: `User ${id} updated successfully`,
        body: response,
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
  deleteUser: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await User.destroy({
        where: {
          id: id,
        },
      });
      endpointResponse({
        res,
        message: `User ${id} deleted successfully`,
        body: response,
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
};
