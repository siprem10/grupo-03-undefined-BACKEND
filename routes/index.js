const express = require('express');
const usersRouter = require('./users');
const categoriesRouter = require("./categories");
const transactionsRouter = require("./transactions");
const authRouter = require('./auth');

const router = express.Router();

router.use("/users", usersRouter);
router.use("/categories", categoriesRouter);
router.use("/transactions", transactionsRouter);
router.use("/auth", authRouter);

module.exports = router;
