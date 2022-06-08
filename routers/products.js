const { Router } = require("express");
const { check } = require("express-validator");
const { validateJwt, validateFields, hasRole } = require("../middlewares");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");
const { existProductId } = require("../helpers/customValidators");

const router = Router();

router.get("/", getProducts);

router.get(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existProductId),
    validateFields,
  ],
  getProduct
);

router.post(
  "/",
  [
    validateJwt,
    hasRole("ADMIN_ROLE", "USER_ROLE"),
    check("name", "El nombre es obligatorio.").not().isEmpty(),
    check("category", "La categoria es obligatorio.").not().isEmpty(),
    check("category", "No es un id valido de la categoria.").isMongoId(),
    validateFields,
  ],
  createProduct
);

router.put(
  "/:id",
  [
    validateJwt,
    hasRole("ADMIN_ROLE", "USER_ROLE"),
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existProductId),
    check("name", "El nombre es obligatorio.").not().isEmpty(),
    check("category", "La categoria es obligatorio.").not().isEmpty(),
    check("category", "No es un id valido de la categoria.").isMongoId(),
    validateFields,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    validateJwt,
    hasRole("ADMIN_ROLE"),
    check("id", "No es un id valido.").isMongoId(),
    check("id").custom(existProductId),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;
