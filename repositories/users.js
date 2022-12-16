
const { Op } = require('sequelize');
const { User } = require('../database/models');
const CreditCard = require('../utils/creditCard');

const getById = async (id) => {
    return await User.findByPk(id, { attributes: { exclude: ['password'] } });
}

const getByEmail = async (email) => {
    return await User.findOne({ where: { email: email } }, { attributes: { exclude: ['password'] } });
}

const getUser = async (find) => {

    return await User.findOne({
        where: {
            [Op.or]: [
                { id: find },
                { email: find }
            ]
        }
    }, { attributes: { exclude: ['password'] } });
}

const getAll = async () => {

    return await User.findAll({
        paranoid: false
    },
    {
        attributes: { exclude: ['password'] },
    });
}

const getAllexcludeYou = async (id) => {

    return await User.findAll({
        paranoid: false,
        where: { id: { [Op.not]: id } }
    }, {
        attributes: { exclude: ['password'] },
    });
}

const create = async (data) => {

    return await User.create({
        ...data,
        creditCard: CreditCard.getCardNum(),
        creditCardExp: CreditCard.getExpiringDate(new Date()),
    });
}

const update = async (data) => {
    return await await User.update(data, { where: { id: data.id } });
}

const updatePassword = async (id, newPassword) => {
    return await User.update(
        { password: newPassword },
        { where: { id: id } }
    );
}

const destroy = async (id) => {
    return await User.destroy({ where: { id } });
}

const restore = async (id) => {
    return await User.restore({ where: { id } });
}


module.exports = {
    getById,
    getByEmail,
    getUser,
    getAll,
    getAllexcludeYou,
    create,
    update,
    updatePassword,
    destroy,
    restore
}