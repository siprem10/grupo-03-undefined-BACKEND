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
const { roleValidator } = require("../middlewares/roleValidator");

const router = express.Router();

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getById);
router.post("/", verifyToken, postValidator, roleValidator, validationResultHandler, create);
router.delete("/:id", verifyToken, roleValidator, validationResultHandler, deleteById);
router.put("/:id", verifyToken, putValidator, roleValidator, validationResultHandler, editById);

module.exports = router;
