const path = require("path");
const { v4: uuidv4 } = require("uuid");

/**
 * Carga de archivos
 * @param {*} files 
 * @param {*} validExtensions 
 * @param {*} folder 
 * @returns 
 */
const uploadFile = (
  files,
  validExtensions = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const shortName = file.name.split(".");
    const extension = shortName[shortName.length - 1];

    // Validar extension de archivo
    if (!validExtensions.includes(extension)) {
      return reject(
        `La extension ${extension} no es permitida solo se permiten ${validExtensions}`
      );
    }

    // Generar nombre unico al archivo
    const nameTemp = uuidv4() + "." + extension;

    // Ruta archivo en la carpeta uploads
    const uploadPath = path.join(__dirname, "../uploads/", folder, nameTemp);

    // Mover archivo en la carpeta uploads
    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }
      resolve(nameTemp);
    });
  });
};

module.exports = { uploadFile };
