const { Transaction } = require('../database/models');
const { decodeToken } = require('../utils/jwt');

const getAllTransactions = async (req, res) => {
  const token = req.headers('auth-token');
  const decodedToken = decodeToken(token);

  try {
    const transactions = await Transaction.findAll({
      where: { userId: decodedToken.id },
    });

    return res.status(200).json({ message: 'Success', transactions });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error });
  }
};

const getTransaction = async (req, res) => {
  const token = req.headers('auth-token');
  const decodedToken = decodeToken(token);

  const { id } = req.params;

  try {
    const transaction = await Transaction.findOne({
      where: { id },
    });

    if (transaction.userId !== decodedToken.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.status(200).json({ message: 'Success', transaction });
  } catch (error) {
    res.status(404).json({ message: `No transaction with id ${id}`, error });
  }
};

const createTransaction = async (req, res) => {
  const { userId, categoryId, amount, date } = req.body;
  if (!userId || !categoryId || !amount || !date) {
    res
      .status(400)
      .json({ message: 'User, Category, Amount and Date must be provided' });
  }
  try {
    const transaction = await Transaction.create({
      userId,
      categoryId,
      amount,
      date,
    });
    res
      .status(201)
      .json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

const editTransaction = async (req, res) => {
  const token = req.headers('auth-token');
  const decodedToken = decodeToken(token);

  const { userId, categoryId, amount, date } = req.body;
  const { id } = req.params;
  if (!userId || !categoryId || !amount || !date) {
    res
      .status(400)
      .json({ message: 'User, Category, Amount and Date must be provided' });
  }
  try {
    const transaction = await Transaction.update(req.body, {
      where: { id: id },
    });
    res.status(200).json({ message: 'Success', transaction });
  } catch (error) {
    res.status(404).json({ message: `No transaction with id ${id}`, error });
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await Transaction.destroy({
      where: { id: id },
    });
    res.status(200).json({ success: 'Success' });
  } catch (error) {
    res.status(404).json({ message: `No transaction with id ${id}`, error });
  }
};

module.exports = {
  getAllTransactions,
  getTransaction,
  createTransaction,
  editTransaction,
  deleteTransaction,
};
