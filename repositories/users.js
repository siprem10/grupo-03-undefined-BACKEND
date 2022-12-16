
const { Op } = require('sequelize');
const { User } = require('../database/models');
const CreditCard = require('../utils/creditCard');

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

const getAll = async () => {

    return await User.findAll({
        attributes: { exclude: ['password'] },
    });
};

const create = async (data) => {

    return await User.create({
        ...data,
        creditCard: CreditCard.getCardNum(),
        creditCardExp: CreditCard.getExpiringDate(new Date()),
    });
};

module.exports = {
    getById,
    getByEmail,
    getUser,
    getAll,
    create
}