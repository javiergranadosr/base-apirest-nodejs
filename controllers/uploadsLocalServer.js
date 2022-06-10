const path = require("path");
const fs = require("fs");
const { response } = require("express");
const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");

/**
 * Cargar de archivos, en servidor local
 * @param {*} req
 * @param {*} res
 * @returns
 */
const upload = async (req, res = response) => {
  try {
    const nameFile = await uploadFile(req.files, undefined, "images"); // undefined agarrar el array por default en funcion
    res.json({ nameFile });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

/**
 * Actualiza archivos, en servidor local
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateUpload = async (req, res = response) => {
  try {
    const { collection, id } = req.params;

    let model;
    switch (collection) {
      case "users":
        model = await User.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ message: `No existe un usuario con el id ${id}` });
        }
        break;
      case "products":
        model = await Product.findById(id);
        console.log(model);
        if (!model) {
          return res
            .status(400)
            .json({ message: `No existe un producto con el id ${id}` });
        }
        break;
      default:
        return res
          .status(500)
          .json({ message: "No se detecto una coleccion valida." });
        break;
    }

    // Limpiar imagenes previas

    if (model.image) {
      // Hay que borrar la imagen del servidor
      const pathImage = path.join(
        __dirname,
        "../uploads",
        collection,
        model.image
      );
      if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
      }
    }

    const nameFile = await uploadFile(req.files, undefined, collection); // undefined agarrar el array por default en funcion
    model.image = nameFile;

    await model.save();

    res.json(model);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al actualizar imagen, hable con un administrador.",
    });
  }
};

/**
 * Muestra imagen, en servidor local
 * @param {*} req
 * @param {*} res
 * @returns
 */
const showImage = async (req, res = response) => {
  try {
    const { collection, id } = req.params;
    const pathDefault = path.join(__dirname, "../assets/no-image.jpg");

    let model;
    switch (collection) {
      case "users":
        model = await User.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ message: `No existe un usuario con el id ${id}`});
        }
        break;
      case "products":
        model = await Product.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ message: `No existe un producto con el id ${id}`});
        }
        break;
      default:
        return res
          .status(500)
          .json({ message: "No se detecto una coleccion valida." });
        break;
    }

    if (model.image) {
      // Hay que borrar la imagen del servidor
      const pathImage = path.join(
        __dirname,
        "../uploads",
        collection,
        model.image
      );
      if (fs.existsSync(pathImage)) {
        return res.sendFile(pathImage);
      }
    }

    return res.sendFile(pathDefault);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener imagen, hable con un administrador.",
    });
  }
};

module.exports = { upload, updateUpload, showImage };
