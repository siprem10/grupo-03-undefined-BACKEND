const express = require('express');
const { verifyToken } = require('../middlewares/jwtValidator');
const validationResultHandler = require('../middlewares/validationResultHandler');
const { postValidator } = require('../middlewares/authValidator');
const { login, me } = require('../controllers/auth');

const router = express.Router();

router.post('/login', postValidator, validationResultHandler, login);
router.get('/me', verifyToken, me);

module.exports = router;