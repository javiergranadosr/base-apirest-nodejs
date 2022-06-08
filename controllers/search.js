const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { User, Product, Category } = require("../models");

const collections = ["users", "categories", "roles", "products"];

/**
 * Busqueda de usuarios por id, correo y nombre
 * @param {*} term
 * @param {*} res
 * @returns
 */
const searchUsers = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(term, "i"); // " i " ignora mayusculas y minisculas

  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }],
  });

  res.json({
    results: users,
  });
};

/**
 * Busqueda de categorias por id y nombre
 * @param {*} term
 * @param {*} res
 * @returns
 */
const searchCategories = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const category = await Category.findById(term);
    return res.json({ results: category ? [category] : [] });
  }

  const regex = new RegExp(term, "i");

  const categories = await Category.find({
    $or: [{ name: regex }],
    $and: [{ state: true }],
  });

  res.json({ results: categories });
};

/**
 * Busqueda de productos por id y nombre
 * @param {*} term
 * @param {*} res
 * @returns
 */
const searchProducts = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const product = await Product.findById(term);
    return res.json({ results: product ? [product] : [] });
  }

  const regex = new RegExp(term, "i");

  const products = await Product.find({
    $or: [{ name: regex }],
    $and: [{ state: true }],
  });

  res.json({ results: products });
};


/**
 * Buyqueda general
 * @param {*} req
 * @param {*} res
 * @returns
 */
const search = (req = request, res = response) => {
  const { collection, term } = req.params;

  if (!collections.includes(collection)) {
    return res
      .status(400)
      .json({ message: `Las colecciones permitidas son ${collections}` });
  }

  switch (collection) {
    case "users":
      searchUsers(term, res);
      break;
    case "categories":
      searchCategories(term, res);
      break;
    case "products":
      searchProducts(term, res);
      break;
    default:
      res.status(500).json({ message: "Se le olvido hacer esta busqueda" });
      break;
  }
};

module.exports = {
  search,
};
