const express = require('express');

const router = express.Router();

const { 
    getAllTransactions, 
    getTransaction,
    createTransaction,
    editTransaction,
    deleteTransaction
} = require('../controllers/transactions');

router.get('/', getAllTransactions);

router.get('/:id', getTransaction);

router.post('/', createTransaction);

router.put('/:id', editTransaction);

router.delete('/:id', deleteTransaction);

module.exports = router;