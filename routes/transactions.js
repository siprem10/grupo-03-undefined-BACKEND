const express = require('express');
const { verifyToken } = require('../middlewares/jwtValidator');
const { putValidator, postValidator } = require('../middlewares/transactionValidator');
const validationResultHandler = require('../middlewares/validationResultHandler');
const router = express.Router();

const {
  get,
  getAll,
  getById,
  create,
  editById,
  deleteById,
} = require('../controllers/transactions');


router.get('/', verifyToken, get);
router.get('/all', verifyToken, getAll);

router.get('/:id', verifyToken, getById);

router.post(
  '/',
  verifyToken,
  postValidator,
  validationResultHandler,
  create
);

router.put('/:id',
  verifyToken,
  putValidator,
  validationResultHandler,
  editById);

router.delete('/:id', verifyToken, deleteById);

module.exports = router;
