const createHttpError = require('http-errors');
const { catchAsync } = require('../helpers/catchAsync');
const { endpointResponse } = require('../helpers/success');
const { isValidPassword } = require('../utils/password');
const { signToken, decodeToken } = require('../utils/jwt');
const { getByEmail } = require('../repositories/users');

module.exports = {
  login: catchAsync(async (req, res, next) => {
    try {

      const {email, password} = req.body;

      const user = await getByEmail(email);

      if(!user){
        throw new Error("User not found!");
      }

      const validPassword = await isValidPassword(password, user.password);
  
      if(!validPassword) {
        throw new Error("Invalid credentials!");
      }
  
      const token = signToken({
        name: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user.id,
      });
  
      return res.header("auth-token", token).json({
        token: token,
      });   
      
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving users] - [index - POST]: ${error.message}`
      )
      next(httpError);
    }
  }),
  me: catchAsync(async (req, res, next) => {
    try {

      const tokenHeader = req.headers["auth-token"];
      const tokenDecode = decodeToken(tokenHeader);    
      const user = await getByEmail(tokenDecode.email);

      if(!user){
        throw new Error("User not found!");
      }
      
      return endpointResponse({
        res,
        message: 'User find successfully',
        body: user
      })
      
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving users] - [index - POST]: ${error.message}`
      )
      next(httpError);
    }
  })
}
