const { request, response } = require("express");
const { Category } = require("../models");

const getCategories = async (req = request, res = response) => {
  try {
    const { limit = 5, from = 0 } = req.query;
    const state = { state: true };

    const [total, categories] = await Promise.all([
      Category.countDocuments(state),
      Category.find(state)
        .skip(+from)
        .limit(+limit)
        .populate("user", "name"),
    ]);

    res.json({
      total,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener categorias, hable con un administrador.",
    });
  }
};

// Obtener categoria, con populate

const getCategory = async (req = request, res = response) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al buscar categoria, hable con un administrador.",
    });
  }
};

const createCategory = async (req = request, res = response) => {
  try {
    const name = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({ name });

    if (categoryDB) {
      return res
        .status(400)
        .json({ message: `La categoria ${name} que desea agregar ya existe.` });
    }

    const data = { name, user: req.user._id };

    const category = new Category(data);
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al crear categoria, hable con un administrador.",
    });
  }
};

// Actualizar categoria

const updateCategory = async (req = request, res = response) => {
  try {
    const id = req.params.id;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al actualizar la categoria, hable con un administrador.",
    });
  }
};

// Eliminar categoria - eliminado fisico

const deleteCategory = async (req = request, res = response) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndUpdate(id, { state: false }, {new: true });
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al eliminar categoria, hable con un administrador.",
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
