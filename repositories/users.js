
const { Op } = require('sequelize');
const { User } = require('../database/models');

const getById = async (id) => {
    return await User.findByPk(id, { attributes: { exclude: ['password'] } });
};

const getByEmail = async (email) => {
    return await User.findOne({ where: { email: email } }, { attributes: { exclude: ['password'] } });
};

const getUser = async (find) => {

    return await User.findOne({
        where: {
            [Op.or]: [
                { id: find },
                { email: find }
            ]
        }
    }, { attributes: { exclude: ['password'] } });
};

module.exports = {
    getById,
    getByEmail,
    getUser
}