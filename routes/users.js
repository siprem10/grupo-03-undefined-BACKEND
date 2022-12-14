const express = require('express');
const { verifyToken } = require('../middlewares/jwtValidator');
const {
  getAll,
  getById,
  createUser,
  updateProfile,
  updateImage,
  updatePwd,
  deleteUser,
  restoreUser,
} = require('../controllers/users');
const validationResultHandler = require('../middlewares/validationResultHandler');
const {
  postValidator,
  updateProfileValidator,
  updatePwdValidator,
} = require('../middlewares/usersValidator');
const multer = require('../middlewares/multerConfig');

const router = express.Router();

router.get('/', verifyToken, getAll);
router.get('/:id', verifyToken, getById);
router.post('/', postValidator, validationResultHandler, createUser);
router.put(
  '/profile/:id',
  verifyToken,
  updateProfileValidator,
  validationResultHandler,
  updateProfile
);


router.put(
  '/changeimage/:id',
  verifyToken,
  multer,
  updateImage
);

router.put(
  '/changepassword/:id',
  verifyToken,
  updatePwdValidator,
  validationResultHandler,
  updatePwd
);
router.delete('/:id', verifyToken, deleteUser);
router.post('/:id', verifyToken, restoreUser);

module.exports = router;
