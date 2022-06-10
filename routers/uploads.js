const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields, validFile } = require("../middlewares");

//const { upload, updateUpload, showImage } = require("../controllers/uploadsLocalServer"); Subidas en servidor local
const { upload, updateUpload, showImage } = require("../controllers/uploadsCloudinary"); // Subidas en servidor cloudinary
const { validCollections } = require("../helpers");

const router = Router();

router.post("/", validFile, upload);
router.put(
  "/:collection/:id",
  [
    check("id", "No es un id valido.").isMongoId(),
    check("collection").custom((c) =>
      validCollections(c, ["users", "products"])
    ),
    validFile,
    validateFields,
  ],
  updateUpload
);
router.get("/:collection/:id", [
  check("id", "No es un id valido.").isMongoId(),
  check("collection").custom((c) => validCollections(c, ["users", "products"])),
  validateFields,
], showImage);

module.exports = router;
