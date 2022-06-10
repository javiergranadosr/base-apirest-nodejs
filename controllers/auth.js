const { response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models");
const { generateJwt } = require("../helpers");
const { googleVerify } = require("../helpers");


/**
 * Inicio de sesion 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
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

/**
 * Inicio de sesion con google
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const googleSignIn = async (req, res = response) => {
  try {
    const { tokenId } = req.body;

    const { name, email, picture } = await googleVerify(tokenId);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: "123456",
        image: picture,
        google: true,
        rol: "USER_ROLE",
      };

      user = new User(data);
      await user.save();
    }

    if (!user.status) {
      return res
        .status(401)
        .json({ message: "Hable con el administrador. Usuario bloqueado" });
    }

    // TODO: Generar JWT
    const token = await generateJwt(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error hable con un administrador." });
  }
};

module.exports = { login, googleSignIn };
