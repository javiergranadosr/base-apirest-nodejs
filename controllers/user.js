const { response, request } = require("express");

const getUsers = (req = request, res = response) => {

  const {apiKey} = req.query// query parameters  
    
  res.json({
    msg: "GET API - Controller",
    apiKey
  });
};

const createUser = (req = request, res = response) => {
  
  const {name, age} = req.body;

  res.json({
    msg: "POST API - Controller",
    name,
    age
  });
};

const updateUser = (req = request, res = response) => {

  const id = req.params.id;
    
  res.json({
    msg: "PUT API - Controller",
    id
  });
};

const updateUserPatch = (req, res = response) => {
  res.json({
    msg: "PATCH API - Controller",
  });
};

const deleteUser = (req, res = response) => {
  res.json({
    msg: "DELETE API - Controller",
  });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  updateUserPatch,
  deleteUser
};
