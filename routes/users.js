const express = require('express');
const { getAll, getById, post, put } = require('../controllers/users');

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', post);
router.put('/:id', put);
router.delete();

module.exports = router;