const express = require('express');
const { verifyToken } = require('../middlewares/jwtValidator');
const {
  getAll,
  getById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users');
const validationResultHandler = require('../middlewares/validationResultHandler');
const { postValidator } = require('../middlewares/usersValidator');
const multer = require('../middlewares/multerConfig');

const router = express.Router();

router.get('/', verifyToken, getAll);
router.get('/:id', verifyToken, getById);
router.post('/', postValidator, validationResultHandler, createUser);
router.put('/:id', verifyToken, multer, updateUser);
router.delete('/:id', verifyToken, deleteUser);

module.exports = router;
