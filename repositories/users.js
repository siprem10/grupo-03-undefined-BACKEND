
const { User } = require('../database/models');

const getByEmail = async (email) => {
   return await User.findOne({ where: { email: email } })
};


module.exports = {
    getByEmail
}