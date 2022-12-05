const express = require('express');
const { verifyToken } = require('../middlewares/jwtValidator');
const { postValidator } = require('../middlewares/transactionValidator');
const validationResultHandler = require('../middlewares/validationResultHandler');
const router = express.Router();

const {
  getAllTransactions,
  getTransaction,
  createTransaction,
  editTransaction,
  deleteTransaction,
} = require('../controllers/transactions');

router.get('/', verifyToken, getAllTransactions);

router.get('/:id', verifyToken, getTransaction);

router.post(
  '/',
  verifyToken,
  postValidator,
  validationResultHandler,
  createTransaction
);

router.put('/:id', verifyToken, editTransaction);

router.delete('/:id', verifyToken, deleteTransaction);

module.exports = router;
