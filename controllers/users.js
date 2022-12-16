const createHttpError = require('http-errors');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const { decodeToken } = require('../utils/jwt');
const UsersRepository = require('../repositories/users');
const bcrypt = require('bcrypt');

module.exports = {
  getAll: catchAsync(async (req, res, next) => {
    try {
      const users = await UsersRepository.getAll();

      if (!users || !users.length) {
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

      if (!newUser) {
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
  updateProfile: catchAsync(async (req, res, next) => {
    try {
      const url = req.protocol + '://' + req.get('host');
      const { firstName, lastName } = req.body;
      const { id } = req.params;

      const user = await UsersRepository.getById(id);

      const updated = await UsersRepository.update({
        id,
        firstName,
        lastName,
        avatar: req.file ? `${url}/uploads/${req.file.filename}` : user.avatar
      });

      if (!updated || !updated.length) {
        throw new Error("No se pudo actualizar el usuario!");
      }

      const userUpdated = await UsersRepository.getById(id);

      endpointResponse({
        res,
        message: `Usuario actualizado correctamente!`,
        body: userUpdated,
      });

    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
  updatePwd: catchAsync(async (req, res, next) => {
    try {
      const { password, newPassword } = req.body;
      const { id } = req.params;

      if (password === newPassword) {
        throw new Error("La contraseña no puede ser la misma!");
      }
      
      const hashedNewPwd = await bcrypt.hash(newPassword, 10);

      const updated = await UsersRepository.updatePassword(id, hashedNewPwd);

      if (!updated || !updated.length) {
        throw new Error("No se pudo actualizar la contraseña!");
      }

      const userUpdated = await UsersRepository.getById(id);

      endpointResponse({
        res,
        message: `Contraseña actualizada correctamente!`,
        body: userUpdated,
      });

    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
  deleteUser: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await UsersRepository.destroy(id);

      if (!user) {
        throw new Error("No hay ningún usuario para ser baneado con ese id!")
      }

      endpointResponse({
        res,
        message: `Usuario baneado correctamente!`,
        body: user,
      });

    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
  restoreUser: catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await UsersRepository.restore(id);

      if (!user) {
        throw new Error("No hay ningún usuario para ser desbaneado con ese id!")
      }

      endpointResponse({
        res,
        message: `Usuario desbaneado correctamente!`,
        body: user,
      });

    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
};
