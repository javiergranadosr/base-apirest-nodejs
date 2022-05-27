const Role = require("../models/role");
const User = require("../models/user");


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

module.exports = { isRole, existEmail, existUserById };
