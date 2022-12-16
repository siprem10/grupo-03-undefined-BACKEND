const createHttpError = require('http-errors');
const { User } = require('../database/models');
const { endpointResponse } = require('../helpers/success');
const { catchAsync } = require('../helpers/catchAsync');
const bcrypt = require('bcrypt');
const { getUser } = require('../repositories/users');
const { decodeToken } = require('../utils/jwt');
const { getExpiringDate, getCardNum } = require('../utils/creditCard');

module.exports = {
  getAll: catchAsync(async (req, res, next) => {
    try {
      const response = await User.findAll({
        attributes: { exclude: ['password'] },
      });

      endpointResponse({
        res,
        message: 'Usuarios recibidos correctamente!',
        body: response,
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
      const user = await getUser(id);

      if(!user) {
        throw new Error("Usuario no encontrado!")
      }
      
      if(excludeYou && (user.id === decodedToken.id) || user.email === decodedToken.email){
        throw new Error("Usuario no encontrado!")
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

      const response = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        creditCard: getCardNum(),
        creditCardExp: getExpiringDate(new Date()),
      });
      endpointResponse({
        res,
        message: `Usuario creado correctamente!`,
        body: response,
      });
    } catch (error) {
      console.log(error)
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
