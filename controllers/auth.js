const { response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const { generateJwt } = require("../helpers/generateJwt");

const login = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    // TODO: Verificar correo
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Usuario / Password incorrectos." });
    }

    // TODO: Verificar usuario activo

    if (!user.status) {
      return res.status(400).json({ message: "Usuario no activo." });
    }

    // TODO: Verificar password

    const validatePassword = bcryptjs.compareSync(password, user.password);
    if (!validatePassword) {
      return res
        .status(400)
        .json({ message: "Usuario / Password incorrectos." });
    }

    // TODO: Generar JWT
    const token = await generateJwt(user.id);

    res.json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error hable con un administrador." });
  }
};

module.exports = { login };
