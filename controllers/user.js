const { response, request } = require("express");
const User = require("../models");
const bcryptjs = require("bcryptjs");

const getUsers = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query; // query parameters

  /*const users = await User.find({status: true})
    .skip(+from) // desde, inicio de la paginacion
    .limit(+limit); // limite de la paginación

  const totalUsers = await User.countDocuments({status: true});  */

  const [total, users] = await Promise.all([
    User.countDocuments({ status: true }),
    User.find({ status: true })
      .skip(+from)
      .limit(+limit),
  ]);

  res.json({
    total,
    users,
  });
};

const createUser = async (req = request, res = response) => {
  const { name, email, password, rol } = req.body;
  const user = new User({ name, email, password, rol });

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();

  res.json({
    user,
  });
};

const updateUser = async (req = request, res = response) => {
  const id = req.params.id;
  const { _id, password, google, email, ...data } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    data.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, data);

  res.json({
    user,
  });
};

const updateUserPatch = (req, res = response) => {
  res.json({
    msg: "PATCH API - Controller",
  });
};

const deleteUser = async (req, res = response) => {
  const id = req.params.id;

  // Borrado fisicamente en bd
  // const user = await User.findByIdAndDelete(id);

  // Borrado logico en bd
  const user = await User.findByIdAndUpdate(id, { status: false });

  res.json({
    user
  });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  updateUserPatch,
  deleteUser,
};
