const { Role, User, Category, Product } = require("../models/");

const isRole = async (role) => {
  const exists = await Role.findOne({ rol: role });
  if (!exists) {
    throw new Error(`El rol ${role} no existe en la base de datos.`);
  }
};

const existEmail = async (email) => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error(`El correo ${email} ya se encuentra registrado.`);
  }
};

const existUserById = async (id) => {
  const exists = await User.findById(id);
  if (!exists) {
    throw new Error(`El usuario con ${id} no existe.`);
  }
};

const existCategoryId = async (id) => {
  const exists = await Category.findById(id);
  if (!exists) {
    throw new Error(`La categoria con id ${id} no existe.`);
  }
};

const existProductId = async (id) => {
  const exists = await Product.findById(id);
  if (!exists) {
    throw new Error(`El producto con id ${id} no existe.`);
  }
};

module.exports = {
  isRole,
  existEmail,
  existUserById,
  existCategoryId,
  existProductId,
};
