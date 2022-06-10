const { response } = require("express");

const validFile = (req, res = response, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    res.status(400).json({ message: "No hay archivos seleccionados." });
    return;
  }
  next();
};

module.exports = { validFile };
