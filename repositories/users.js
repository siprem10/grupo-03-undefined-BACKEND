
const { User } = require('../database/models');

const getById = async (id) => {
    return await User.findOne({ where: { id: id } }, { attributes: { exclude: ['password'] } });
};

const getByEmail = async (email) => {
    return await User.findOne({ where: { email: email } }, { attributes: { exclude: ['password'] } });
};

module.exports = {
    getById,
    getByEmail
}