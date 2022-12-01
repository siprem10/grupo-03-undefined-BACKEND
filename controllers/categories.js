const { Category } = require("../database/models");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: {
        active: true,
      },
    });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

const addCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "No name or description provided", error });
  }

  try {
    await Category.create({
      name,
      description,
      active: true,
    });

    return res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "No id provided" });

    const category = await Category.findOne({
      where: {
        id,
      },
    });

    if (!category)
      return res
        .status(404)
        .json({ message: "Category not found", category: null });

    return res.json(category);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

const editCategory = async (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  if (!id) return res.status(400).json({ message: "No id provided" });

  try {
    await Category.update(
      {
        name,
        description,
      },
      { where: { id } }
    );
    return res.json({ message: "Category updated" });
  } catch (error) {}
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await Category.update(
      {
        active: false,
        deletedAt: new Date(),
      },
      { where: { id } }
    );
    return res.json({ message: "Category Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports = {
  getCategories,
  addCategory,
  getCategoryById,
  editCategory,
  deleteCategory,
};
