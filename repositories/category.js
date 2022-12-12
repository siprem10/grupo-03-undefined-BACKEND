
const { Category } = require('../database/models');

const getById = async (id) => {
    return await Category.findOne({ where: { id: id } });
};

module.exports = {
    getById
}