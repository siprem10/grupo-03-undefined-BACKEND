const express = require("express");
const {
  getAll,
  getById,
  create,
  deleteById,
  editById,
} = require("../controllers/categories");
const { verifyToken } = require("../middlewares/jwtValidator");
const validationResultHandler = require("../middlewares/validationResultHandler");
const {
  putValidator,
  postValidator,
} = require('../middlewares/categoryValidator');

const router = express.Router();

router.get("/", verifyToken, validationResultHandler, getAll);
router.get("/:id", verifyToken, validationResultHandler, getById);
router.post("/", verifyToken, postValidator, validationResultHandler, create);
router.delete("/:id", verifyToken, validationResultHandler, deleteById);
router.put("/:id", verifyToken, putValidator, validationResultHandler, editById);

module.exports = router;
