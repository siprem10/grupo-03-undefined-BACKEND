const createHttpError = require('http-errors');
const { User } = require('../database/models');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const bcrypt = require('bcrypt');
const { decodeToken } = require('../utils/jwt');
const UsersRepository = require('../repositories/users');

module.exports = {
  getAll: catchAsync(async (req, res, next) => {
    try {
      const users = UsersRepository.getAll();

      if(!users || !users.length) {
        throw new Error("No hay usuarios creados!")
      }

      endpointResponse({
        res,
        message: 'Usuarios recibidos correctamente!',
        body: users,
      });

    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
  getById: catchAsync(async (req, res, next) => {
    try {
      const token = req.header('auth-token');
      const { id } = req.params;
      const { excludeYou } = req.query;
      const decodedToken = decodeToken(token);

      const user = await UsersRepository.getUser(id);

      if (!user ||
        excludeYou && (user.id === decodedToken.id || user.email === decodedToken.email)) {

        throw new Error("Usuario no encontrado!");
      }

      endpointResponse({
        res,
        message: `Usuario recibido correctamente!`,
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
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UsersRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
      });

      if(!newUser || !newUser.length) {
        throw new Error("No se pudo registrar el usuario!")
      }

      endpointResponse({
        res,
        message: `Usuario creado correctamente!`,
        body: newUser,
      });

    } catch (error) {

      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
  updateUser: catchAsync(async (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    try {
      const { firstName, lastName, newPassword } = req.body;
      const { id } = req.params;

      const response = await UsersRepository.getById(id);

      const user = {
        firstName,
        lastName,
        avatar: req.file
          ? `${url}/uploads/${req.file.filename}`
          : response.avatar,
      };

      if (newPassword) user.password = await bcrypt.hash(newPassword, 10);
      response.update(user);

      endpointResponse({
        res,
        message: `Usuario actualizado correctamente!`,
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
        message: `Usuario borrado correctamente!`,
        body: response,
      });
    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
};
