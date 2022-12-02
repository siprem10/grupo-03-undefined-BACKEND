const express = require('express');
const { verifyToken } = require('../middlewares/jwtValidator');
const { login, me } = require('../controllers/auth');

const router = express.Router();

router.post('/login', login);
router.get('/me', verifyToken, me);

module.exports = router;