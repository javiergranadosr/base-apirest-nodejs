const { request, response, json } = require("express");
const { Product } = require("../models");

/**
 * Obtiene listado de productos, paginados
 * @param {*} req
 * @param {*} res
 */

const getProducts = async (req = request, res = response) => {
  try {
    const { limit = 5, from = 0 } = req.query;
    const state = { state: true };

    const [total, products] = await Promise.all([
      Product.countDocuments(state),
      Product.find(state)
        .skip(+from)
        .limit(+limit)
        .populate("user", "name")
        .populate("category", "name"),
    ]);

    res.json({ total, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener productos, hable con un administrador.",
    });
  }
};

/**
 * Obtener detalle de un producto
 * @param {*} req
 * @param {*} res
 */
const getProduct = async (req = request, res = response) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id)
      .populate("user", "name")
      .populate("category", "name");
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener el producto, hable con un administrador.",
    });
  }
};

/**
 * Crea un nuevo producto
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createProduct = async (req = request, res = response) => {
  try {
    const { name, description, price, category } = req.body;
    const productBD = await Product.findOne({ name });

    if (productBD) {
      return res
        .status(400)
        .json({ message: `El producto ${name} que desea agregar ya existe.` });
    }

    const data = { name, category, user: req.user._id };

    if (price) {
      data.price = price;
    }

    if (description) {
      data.description = description;
    }

    const product = new Product(data);
    await product.save();

    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al crear producto, hable con un administrador.",
    });
  }
};

/**
 * Actualiza un producto
 * @param {*} req
 * @param {*} res
 */
const updateProduct = async (req = request, res = response) => {
  try {
    const id = req.params.id;
    const { state, name, description, price, category } = req.body;
    console.log(req.body);

    const data = {
      name,
      description,
      category,
    };

    if (price) {
      data.price = price;
    }

    if (description) {
      data.description = description;
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al actualizar producto, hable con un administrador.",
    });
  }
};

/**
 * Elimina un producto
 * @param {*} req
 * @param {*} res
 */
const deleteProduct = async (req = request, res = response) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al elminar producto, hable con un administrador.",
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
