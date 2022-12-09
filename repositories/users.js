
const { User } = require('../database/models');

const getByEmail = async (email) => {
   return await User.findOne({ where: { email: email } }, {attributes: {exclude: ['password'] }});
};


module.exports = {
    getByEmail
}