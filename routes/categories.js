const express = require("express");
const {
  getCategories,
  getCategoryById,
  deleteCategory,
  editCategory,
  addCategory,
} = require("../controllers/categories");

const router = express.Router();

router.get("/", getCategories);
router.post("/", addCategory);
router.get("/:id", getCategoryById);
router.delete("/:id", deleteCategory);
router.put("/:id", editCategory);

module.exports = router;
