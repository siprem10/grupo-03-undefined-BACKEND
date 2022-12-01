const express = require('express');
const { getAll, getById, createUser, updateUser, deleteUser } = require('../controllers/users');

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;