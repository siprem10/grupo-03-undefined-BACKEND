const createHttpError = require('http-errors');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const { decodeToken } = require('../utils/jwt');
const UsersRepository = require('../repositories/users');
const bcrypt = require('bcrypt');
const Password = require('../utils/password');

module.exports = {
  getAll: catchAsync(async (req, res, next) => {
    try {
      const { excludeYou } = req.query;
      const token = req.header('auth-token');
      const decodedToken = decodeToken(token);

      const users = excludeYou ? await UsersRepository.getAllexcludeYou(decodedToken.id) : await UsersRepository.getAll();

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
      const { firstName, lastName } = req.body;
      const { id } = req.params;

      const updated = await UsersRepository.update(id, {
        firstName,
        lastName
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
  updateImage: catchAsync(async (req, res, next) => {
    try {
      const url = req.protocol + '://' + req.get('host');
      const { id } = req.params;
      const file = req.file;
      const fileSubmited = `${url}/uploads/${file.filename}`;

      if(!file) {
        throw new Error("Debes proporcionar una imagen!");
      }   

      if(!fileSubmited) {
        throw new Error("Error al cambiar la imagen!");
      }

      const updated = await UsersRepository.update(id, {
        avatar: fileSubmited
      });

      if (!updated || !updated.length) {
        throw new Error("No se pudo actualizar la imagen!");
      }

      const userUpdated = await UsersRepository.getById(id);

      endpointResponse({
        res,
        message: `Imagen actualizada correctamente!`,
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

      const user = await UsersRepository.getById(id);
      const isPwdEquals = await Password.isPwdEquals(password, user.password);
      const isNewPwdEquals = await Password.isPwdEquals(newPassword, user.password);

      if (!isPwdEquals) {
        throw new Error("La contraseña antigua no es correcta!");
      }

      if (isNewPwdEquals || (password === newPassword)) {
        throw new Error("La contraseña nueva no puede ser la misma!");
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

      const userDeleted = await UsersRepository.getById(id);

      endpointResponse({
        res,
        message: `Usuario baneado correctamente!`,
        body: userDeleted,
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

      const userRestore = await UsersRepository.getById(id);

      endpointResponse({
        res,
        message: `Usuario desbaneado correctamente!`,
        body: userRestore,
      });

    } catch (error) {
      const httpError = createHttpError(error.statusCode, error.message);
      next(httpError);
    }
  }),
};
