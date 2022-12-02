const express = require('express');
const usersRouter = require('./users');
const categoriesRouter = require("./categories");
const authRouter = require('./auth');

const router = express.Router();

router.use("/users", usersRouter);
router.use("/categories", categoriesRouter);
router.use("/auth", authRouter);

module.exports = router;
