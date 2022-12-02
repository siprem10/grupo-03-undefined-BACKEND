const createHttpError = require('http-errors');
const { User } = require('../database/models');
const { catchAsync } = require('../helpers/catchAsync');
const { isValidPassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

module.exports = {
  login: catchAsync(async (req, res, next) => {
    try {

      const {email, password} = req.body;
      const user = await User.findOne({ where: { email: email } });

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
  
      user.password = undefined;
  
      return res.header("auth-token", token).json({
        user: user,
        token: token,
      });   
      
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving users] - [index - POST]: ${error.message}`
      )
      next(httpError);
    }
  })
}
