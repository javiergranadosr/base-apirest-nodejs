const path = require("path");
const fs = require("fs");
const { response } = require("express");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");

/**
 * Cargar de archivos, en cloudinary
 * @param {*} req
 * @param {*} res
 * @returns
 */
const upload = async (req, res = response) => {
  try {
    // Guardar imagen
    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    res.json({ secure_url });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

/**
 * Actualiza archivos, en cloudinary
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
      const shortName = model.image.split("/");
      const name = shortName[shortName.length - 1];
      const [public_id] = name.split(".");
      cloudinary.uploader.destroy(public_id);
    }

    // Guardar imagen
    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.image = secure_url;

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
 * Muestra imagen, en en cloudinary
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
            .json({ message: `No existe un usuario con el id ${id}` });
        }
        break;
      case "products":
        model = await Product.findById(id);
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

    if (model.image) {
      return res.json({image: model.image});
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
