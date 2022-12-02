const express = require('express');
// const { verifyToken } = require('../middlewares/jwtValidator');
const { getAll, getById, createUser, updateUser, deleteUser } = require('../controllers/users');

const router = express.Router();

router.get('/', /*verifyToken,*/ getAll);
router.get('/:id', /*verifyToken,*/ getById);
router.post('/', createUser);
router.put('/:id', /*verifyToken,*/ updateUser);
router.delete('/:id', /*verifyToken,*/ deleteUser);

module.exports = router;